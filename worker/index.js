import { getAddress, isAddress, verifyMessage } from "viem";
// Cloudflare Worker for earvingallardo.com.
// Serves the static Next.js export (ASSETS binding) and /api/github, which reads the
// public GitHub contribution calendar + recently pushed public repos. No token needed;
// responses are cached at the edge for an hour so GitHub's unauthenticated limits never bite.
const USER = "EmpowerTours";
const TTL = 3600;

async function github(ctx) {
  const cache = caches.default;
  const key = new Request("https://cache.internal/api/github/v1");
  const hit = await cache.match(key);
  if (hit) return hit;

  const ua = { "User-Agent": "earvingallardo.com" };
  const [cal, repos] = await Promise.all([
    fetch(`https://github.com/users/${USER}/contributions`, {
      headers: ua,
    }).then((r) => {
      if (!r.ok) throw new Error(`contributions ${r.status}`);
      return r.text();
    }),
    fetch(
      `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=20&type=owner`,
      {
        headers: { ...ua, Accept: "application/vnd.github+json" },
      },
    ).then((r) => {
      if (!r.ok) throw new Error(`repos ${r.status}`);
      return r.json();
    }),
  ]);

  // <td ... data-date="YYYY-MM-DD" id="contribution-day-component-R-C" data-level="N">
  const cells = new Map();
  for (const m of cal.matchAll(
    /<td[^>]*data-date="([\d-]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g,
  )) {
    cells.set(m[2], { date: m[1], level: +m[3], count: 0 });
  }
  // <tool-tip for="contribution-day-component-R-C">5 contributions on ...</tool-tip>
  for (const m of cal.matchAll(
    /<tool-tip[^>]*for="([^"]+)"[^>]*>\s*(\d+|No) contribution/g,
  )) {
    const c = cells.get(m[1]);
    if (c) c.count = m[2] === "No" ? 0 : +m[2];
  }
  const days = [...cells.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300) throw new Error(`calendar parse: ${days.length} days`);

  // Pad the front so the first column starts on Sunday, like GitHub's grid.
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const padded = [
    ...Array(first)
      .fill(null)
      .map((_, i) => ({ date: `pad-${i}`, level: 0, count: 0 })),
    ...days,
  ];

  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else if (i === days.length - 1)
      continue; // today may not have commits yet
    else break;
  }

  const body = {
    user: USER,
    total: days.reduce((s, d) => s + d.count, 0),
    activeDays: days.filter((d) => d.count > 0).length,
    streak,
    last30: days.slice(-30).reduce((s, d) => s + d.count, 0),
    days: padded,
    repos: repos
      .filter((r) => !r.fork && !r.archived && r.name !== "empowertours-os")
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        pushed: r.pushed_at,
      })),
    updated: new Date().toISOString(),
  };

  const res = new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${TTL}`,
    },
  });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

// Latest @EmpowerTours posts from X's public syndication feed (what X's own embed uses).
// Edge-cached for an hour; on any failure the client falls back to X's official embed.
async function xfeed(ctx) {
  const cache = caches.default;
  const key = new Request("https://cache.internal/api/x/v2");
  const staleKey = new Request("https://cache.internal/api/x/stale-v2");
  const hit = await cache.match(key);
  if (hit) return hit;
  const r = await fetch(
    "https://syndication.twitter.com/srv/timeline-profile/screen-name/EmpowerTours",
    {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; earvingallardo.com)" },
    },
  );
  if (!r.ok) {
    // X rate-limits this feed often; serve the last good copy (kept up to 7 days) if we have one.
    const stale = await cache.match(staleKey);
    if (stale) return stale;
    throw new Error(`x ${r.status}`);
  }
  const html = await r.text();
  const m = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!m) throw new Error("x: no data");
  const entries = JSON.parse(m[1])?.props?.pageProps?.timeline?.entries ?? [];
  const tweets = entries.map((e) => e?.content?.tweet).filter(Boolean);
  if (!tweets.length) throw new Error("x: empty");
  const u =
    tweets.find((t) => t.user?.screen_name?.toLowerCase() === "empowertours")
      ?.user ??
    tweets[0].user ??
    {};
  const strip = (t) =>
    (t.full_text || t.text || "").replace(/https:\/\/t\.co\/\w+$/, "").trim();
  const body = {
    profile: {
      name: u.name,
      bio: u.description,
      followers: u.followers_count ?? null,
      avatar:
        (u.profile_image_url_https || "").replace("_normal", "_400x400") ||
        null,
    },
    // Only original posts by @EmpowerTours: no reposts, no replies, no posts by other accounts.
    posts: tweets
      .filter(
        (t) =>
          t.user?.screen_name?.toLowerCase() === "empowertours" &&
          !t.retweeted_status &&
          !t.in_reply_to_status_id_str &&
          !(t.full_text || t.text || "").startsWith("@") &&
          !(t.full_text || t.text || "").startsWith("RT @"),
      )
      .slice(0, 10)
      .map((t) => ({
        id: t.id_str,
        text: strip(t),
        date: t.created_at,
        likes: t.favorite_count || 0,
        reposts: t.retweet_count || 0,
        image:
          t.entities?.media?.[0]?.media_url_https ||
          t.extended_entities?.media?.[0]?.media_url_https ||
          null,
      })),
  };
  const res = new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${TTL}`,
    },
  });
  const stale = new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=604800",
    },
  });
  ctx.waitUntil(
    Promise.all([cache.put(key, res.clone()), cache.put(staleKey, stale)]),
  );
  return res;
}

// Guestbook notes (D1). Public read; public write with validation and per-visitor rate limits.
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

async function ipHash(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${env.NOTES_SALT}|${ip}`),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function notes(request, env) {
  if (request.method === "GET") {
    // Wallet notes show the wallet's CURRENT name (or nothing, and the UI shows the short address).
    const { results } = await env.DB.prepare(
      `SELECT n.id, CASE WHEN n.wallet IS NOT NULL THEN COALESCE(w.name, '') ELSE n.who END AS who,
              n.body, n.created_at, n.verified, n.avatar, n.wallet
         FROM notes n LEFT JOIN wallet_names w ON w.address = n.wallet
        WHERE n.hidden = 0 ORDER BY n.id DESC LIMIT 100`,
    ).all();
    return json({ notes: results });
  }
  if (request.method !== "POST")
    return json({ error: "Use GET or POST." }, 405);

  let d;
  try {
    d = await request.json();
  } catch {
    return json({ error: "Send the note as JSON." }, 400);
  }
  if (d.website) return json({ ok: true }); // honeypot: bots fill hidden fields; drop silently
  // New notes need a signed-in wallet. The author is the wallet; its name lives in wallet_names.
  const w = await walletSession(request, env);
  if (!w)
    return json({ error: "Sign in with your wallet to leave a note." }, 401);
  const body = clean(d.body).replace(/\n{3,}/g, "\n\n");
  if (!body)
    return json({ error: "Write something before leaving a note." }, 400);
  if (body.length > 500)
    return json({ error: "Keep the note under 500 characters." }, 400);
  if (/https?:\/\/|www\./i.test(body))
    return json({ error: "Links aren't allowed in notes." }, 400);

  const ip = await ipHash(request, env);
  const since = "created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 day')";
  const minute =
    "SUM(created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-60 seconds'))";
  for (const [col, val] of [
    ["ip_hash", ip],
    ["wallet", w.address],
  ]) {
    const r = await env.DB.prepare(
      `SELECT ${minute} AS minute, COUNT(*) AS day FROM notes WHERE ${col} = ? AND ${since}`,
    )
      .bind(val)
      .first();
    if ((r?.minute ?? 0) > 0)
      return json(
        {
          error: "You just left a note. Wait a minute before leaving another.",
        },
        429,
      );
    if ((r?.day ?? 0) >= 10)
      return json({ error: "That's 10 notes today. Come back tomorrow." }, 429);
  }

  const name =
    (
      await env.DB.prepare("SELECT name FROM wallet_names WHERE address = ?")
        .bind(w.address)
        .first()
    )?.name || "";
  const row = await env.DB.prepare(
    "INSERT INTO notes (who, body, ip_hash, verified, wallet) VALUES (?, ?, ?, 0, ?) RETURNING id, who, body, created_at, verified, avatar, wallet",
  )
    .bind(name, body, ip, w.address)
    .first();
  return json({ note: row }, 201);
}

const clean = (v) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .trim();

// ---------- Sign in with a wallet (Mera passkey wallet; any EOA that can sign a message works) ----------
// GET  /api/auth/wallet/challenge?address=0x..   -> { message, token }  token = sealed {address, nonce, iat}, 5 min
// POST /api/auth/wallet/verify { token, signature } -> checks the EIP-191 signature, burns the nonce, sets eg_w (30 days)
// POST /api/auth/wallet/name { name }            -> sets (or with "" clears) the wallet's display name
// The server never sees a key: it only checks a signature over a message it issued itself.
const signInMessage = (address, nonce, iat) =>
  "earvingallardo.com wants you to sign in with your wallet.\n\n" +
  "This proves you own this wallet so you can leave notes. It costs nothing and moves nothing.\n\n" +
  `Address: ${address}\nNonce: ${nonce}\nIssued At: ${new Date(iat).toISOString()}`;

async function walletSession(req, env) {
  const s = await unseal(env, cookie(req, "eg_w"));
  return s?.address ? s : null;
}

// Compared with letters and digits only, lowercased ("Earvin Gallardo" -> "earvingallardo").
const RESERVED_NAMES = [
  "earvin",
  "earvingallardo",
  "earvingallardobravo",
  "unify34",
  "empowertours",
  "admin",
];

async function walletAuth(request, env, url) {
  if (url.pathname === "/api/auth/wallet/challenge") {
    const raw = url.searchParams.get("address") || "";
    if (!isAddress(raw))
      return json({ error: "That isn't a wallet address." }, 400);
    const address = getAddress(raw);
    const nonce = rand(16);
    const iat = Date.now();
    const token = await seal(env, {
      address,
      nonce,
      iat,
      exp: iat + 5 * 60 * 1000,
    });
    return json({ message: signInMessage(address, nonce, iat), token });
  }
  if (url.pathname === "/api/auth/wallet/verify" && request.method === "POST") {
    const d = await request.json().catch(() => ({}));
    const t = await unseal(env, d.token);
    if (!t?.address || !t.nonce)
      return json({ error: "Sign-in expired. Try again." }, 400);
    const ok = await verifyMessage({
      address: t.address,
      message: signInMessage(t.address, t.nonce, t.iat),
      signature: d.signature,
    }).catch(() => false);
    if (!ok)
      return json({ error: "That signature doesn't match the wallet." }, 401);
    const used = await env.DB.prepare(
      "INSERT INTO wallet_nonces (nonce) VALUES (?) ON CONFLICT(nonce) DO NOTHING RETURNING nonce",
    )
      .bind(t.nonce)
      .first();
    if (!used)
      return json({ error: "That sign-in was already used. Try again." }, 400);
    const name =
      (
        await env.DB.prepare("SELECT name FROM wallet_names WHERE address = ?")
          .bind(t.address)
          .first()
      )?.name || "";
    const sess = await seal(env, {
      address: t.address,
      exp: Date.now() + 30 * 24 * 3600 * 1000,
    });
    return new Response(
      JSON.stringify({ wallet: { address: t.address, name } }),
      {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "set-cookie": setCookie("eg_w", sess, 30 * 24 * 3600),
        },
      },
    );
  }
  if (url.pathname === "/api/auth/wallet/name" && request.method === "POST") {
    const w = await walletSession(request, env);
    if (!w) return json({ error: "Sign in with your wallet first." }, 401);
    const d = await request.json().catch(() => ({}));
    const name = clean(d.name).replace(/\s+/g, " ");
    if (name.length > 40)
      return json({ error: "Keep your name under 40 characters." }, 400);
    if (/https?:\/\/|www\.|@/i.test(name))
      return json({ error: "Names can't contain links or @handles." }, 400);
    if (name && /^0x[0-9a-f]/i.test(name))
      return json({ error: "Pick a name, not an address." }, 400);
    // Nobody else can register the site owner's names.
    const squash = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (name && RESERVED_NAMES.includes(squash(name)))
      return json({ error: "That name is reserved." }, 409);
    if (!name)
      await env.DB.prepare("DELETE FROM wallet_names WHERE address = ?")
        .bind(w.address)
        .run();
    else {
      // A registered name belongs to one wallet (unique index, case-insensitive).
      const taken = await env.DB.prepare(
        "SELECT address FROM wallet_names WHERE name = ? COLLATE NOCASE AND address != ?",
      )
        .bind(name, w.address)
        .first();
      if (taken)
        return json(
          { error: "That name is already registered to another wallet." },
          409,
        );
      try {
        await env.DB.prepare(
          "INSERT INTO wallet_names (address, name) VALUES (?, ?) ON CONFLICT(address) DO UPDATE SET name = excluded.name, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')",
        )
          .bind(w.address, name)
          .run();
      } catch (e) {
        if (/UNIQUE/i.test(String(e?.message || e)))
          return json(
            { error: "That name is already registered to another wallet." },
            409,
          );
        throw e;
      }
    }
    return json({ wallet: { address: w.address, name } });
  }
  return json({ error: "Not found." }, 404);
}

// ---------- Sign in with X (OAuth 2.0 authorization code + PKCE, confidential client) ----------
// Needs X_CLIENT_ID (var) and X_CLIENT_SECRET (secret). Without them the button is hidden and
// notes work in guest mode only. Sessions are HMAC-signed cookies; no X tokens are stored.
const enc = new TextEncoder();
const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const rand = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));
async function hmac(env, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
async function seal(env, obj) {
  const data = b64url(enc.encode(JSON.stringify(obj)));
  return `${data}.${await hmac(env, data)}`;
}
async function unseal(env, token) {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  if ((await hmac(env, data)) !== sig) return null;
  try {
    const obj = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(data.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
          c.charCodeAt(0),
        ),
      ),
    );
    return obj.exp && obj.exp > Date.now() ? obj : null;
  } catch {
    return null;
  }
}
const cookie = (req, name) =>
  (req.headers.get("cookie") || "")
    .split(/;\s*/)
    .find((c) => c.startsWith(name + "="))
    ?.slice(name.length + 1);
const setCookie = (name, value, maxAge) =>
  `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
const xReady = (env) =>
  Boolean(env.X_CLIENT_ID && env.X_CLIENT_SECRET && env.SESSION_SECRET);
const session = (req, env) => unseal(env, cookie(req, "eg_x"));

async function auth(request, env, url) {
  const callback = `${url.origin}/api/auth/x/callback`;
  if (url.pathname === "/api/auth/me") {
    const s = xReady(env) ? await session(request, env) : null;
    const w = await walletSession(request, env);
    const name = w
      ? (
          await env.DB.prepare(
            "SELECT name FROM wallet_names WHERE address = ?",
          )
            .bind(w.address)
            .first()
        )?.name || ""
      : "";
    return json({
      xEnabled: xReady(env),
      user: s ? { username: s.username, name: s.name, avatar: s.avatar } : null,
      wallet: w ? { address: w.address, name } : null,
    });
  }
  if (url.pathname.startsWith("/api/auth/wallet/"))
    return walletAuth(request, env, url);
  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    const h = new Headers({ "content-type": "application/json" });
    h.append("set-cookie", setCookie("eg_x", "", 0));
    h.append("set-cookie", setCookie("eg_w", "", 0));
    return new Response(JSON.stringify({ ok: true }), { headers: h });
  }
  if (!xReady(env))
    return json({ error: "Sign in with X isn't set up yet." }, 503);

  if (url.pathname === "/api/auth/x/login") {
    const state = rand(16);
    const verifier = rand(48);
    const challenge = b64url(
      await crypto.subtle.digest("SHA-256", enc.encode(verifier)),
    );
    const q = new URLSearchParams({
      response_type: "code",
      client_id: env.X_CLIENT_ID,
      redirect_uri: callback,
      scope: "users.read tweet.read",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
    const pending = await seal(env, {
      state,
      verifier,
      exp: Date.now() + 10 * 60 * 1000,
    });
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://x.com/i/oauth2/authorize?${q}`,
        "set-cookie": setCookie("eg_xo", pending, 600),
      },
    });
  }

  if (url.pathname === "/api/auth/x/callback") {
    const back = (msg) => {
      const h = new Headers({
        location: `/?open=notes${msg ? `&auth=${encodeURIComponent(msg)}` : ""}`,
      });
      h.append("set-cookie", setCookie("eg_xo", "", 0));
      return h;
    };
    const pending = await unseal(env, cookie(request, "eg_xo"));
    const code = url.searchParams.get("code");
    if (url.searchParams.get("error"))
      return new Response(null, { status: 302, headers: back("cancelled") });
    if (!pending || !code || url.searchParams.get("state") !== pending.state)
      return new Response(null, { status: 302, headers: back("expired") });

    const tok = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization: `Basic ${btoa(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: callback,
        code_verifier: pending.verifier,
        client_id: env.X_CLIENT_ID,
      }),
    });
    if (!tok.ok)
      return new Response(null, { status: 302, headers: back("failed") });
    const { access_token } = await tok.json();
    const me = await fetch(
      "https://api.x.com/2/users/me?user.fields=profile_image_url",
      { headers: { authorization: `Bearer ${access_token}` } },
    );
    if (!me.ok)
      return new Response(null, { status: 302, headers: back("failed") });
    const u = (await me.json()).data;
    // Best effort: revoke the access token, we only needed it to learn who signed in.
    fetch("https://api.x.com/2/oauth2/revoke", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization: `Basic ${btoa(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        token: access_token,
        token_type_hint: "access_token",
      }),
    }).catch(() => {});
    const sess = await seal(env, {
      id: u.id,
      username: u.username,
      name: u.name,
      avatar: u.profile_image_url || null,
      exp: Date.now() + 30 * 24 * 3600 * 1000,
    });
    const h = back("");
    h.append("set-cookie", setCookie("eg_x", sess, 30 * 24 * 3600));
    return new Response(null, { status: 302, headers: h });
  }
  return json({ error: "Not found." }, 404);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname.startsWith("/api/auth/")) {
      try {
        return await auth(request, env, url);
      } catch (e) {
        return json({ error: "Sign-in failed. Try again." }, 500);
      }
    }
    if (url.pathname === "/api/notes") {
      try {
        return await notes(request, env);
      } catch (e) {
        return json(
          { error: "Notes are unavailable right now. Try again shortly." },
          500,
        );
      }
    }
    if (url.pathname === "/api/x") {
      try {
        return await xfeed(ctx);
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e.message || e) }), {
          status: 502,
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
          },
        });
      }
    }
    if (url.pathname === "/api/github") {
      try {
        return await github(ctx);
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e.message || e) }), {
          status: 502,
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
          },
        });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
