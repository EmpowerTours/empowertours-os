"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ArrowUpRight, BadgeCheck, Fingerprint, Pause, Play, Wallet } from "lucide-react";
import { explainWalletError, walletSignIn } from "./wallet";
import {
  CERTS,
  EDUCATION,
  EXP,
  LINKS,
  POSTS,
  SITES,
  SONGS,
  STACK,
} from "./data";

/* ---------- shared state ---------- */

// One audio player for the whole OS: the menu bar and the Music window both drive it.
export const Player = createContext(null);
export const usePlayer = () => useContext(Player);

// Live GitHub activity from the Worker (/api/github), fetched once per visit.
let ghCache = null;
export function useGitHub() {
  const [d, setD] = useState(ghCache);
  useEffect(() => {
    if (ghCache) return;
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && j.days) {
          ghCache = j;
          setD(j);
        }
      })
      .catch(() => {});
  }, []);
  return d;
}

/* ---------- small pieces ---------- */

const Ext = ({ href, children, className = "" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className={`inline-flex items-center gap-1 hover:text-mango ${className}`}
  >
    {children}
    <ArrowUpRight size={14} aria-hidden />
  </a>
);
const H = ({ children }) => (
  <h3 className="font-display text-xl font-semibold tracking-tight mt-8 mb-3">
    {children}
  </h3>
);
const host = (u) => u.replace(/^https:\/\//, "").replace(/\/$/, "");

/* ---------- About ---------- */

const ROLES = [
  [
    "Music artist",
    "I record as Unify34: my vocals over beats from independent producers, released on-chain.",
    "music",
  ],
  [
    "Developer",
    "Solidity, TypeScript, Go and Python. Contracts, apps and the infrastructure under them.",
    "github",
  ],
  [
    "Founder",
    "EmpowerTours, plus Azteca Lighting & Electric and Controlled Security Systems.",
    "empowertours",
  ],
];

export function About({ open }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-5">
        <img
          src="/hero.jpg"
          alt="Earvin Gallardo"
          className="w-20 h-20 rounded-2xl object-cover"
        />
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight leading-none">
            Earvin Gallardo
          </h2>
          <p className="text-mist mt-2">New York City and Guerrero, Mexico</p>
        </div>
      </div>
      <p className="mt-6 text-lg leading-relaxed text-bone/90 max-w-[62ch]">
        I make music, I write software, and I run the companies behind it.
        Before all of it I spent seven years in the Marine Corps keeping
        generators running for a joint command centre, which turns out to be
        most of what shipping software is.
      </p>
      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        {ROLES.map(([t, d, app]) => (
          <button
            key={t}
            onClick={() => open(app)}
            className="text-left rounded-2xl bg-white/[.04] hover:bg-white/[.08] border border-white/5 p-4 transition"
          >
            <span className="font-display text-lg font-semibold block">
              {t}
            </span>
            <span className="text-sm text-mist leading-snug block mt-1">
              {d}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-mango text-night p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="font-display text-lg font-semibold">
          Need an app built? I take on contract work, end to end.
        </p>
        <a
          href={LINKS.linkedin}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-full bg-night text-bone px-5 py-2.5 font-semibold text-sm hover:bg-plum"
        >
          Message me on LinkedIn
        </a>
      </div>

      <H>Experience</H>
      <ol className="border-l border-white/10 ml-1">
        {EXP.map(([r, c, when, x]) => (
          <li key={c} className="pl-5 pb-5 relative">
            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-violet" />
            <p className="font-semibold">
              {r}, {c}
            </p>
            <p className="text-xs text-mist mt-0.5">{when}</p>
            <p className="text-sm text-bone/80 mt-1 max-w-[62ch]">{x}</p>
          </li>
        ))}
      </ol>

      <H>Stack</H>
      <div className="flex flex-wrap gap-2">
        {STACK.map((t) => (
          <span
            key={t}
            className="rounded-lg bg-white/[.06] px-2.5 py-1 text-sm"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <H>Education</H>
          <ul className="space-y-1.5 text-sm text-bone/85">
            {EDUCATION.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <H>Certifications</H>
          <ul className="space-y-1.5 text-sm text-bone/85">
            {CERTS.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-8">
        <Ext href={LINKS.linkedin} className="text-violet">
          Full profile on LinkedIn
        </Ext>
      </p>
    </div>
  );
}

/* ---------- Sites ---------- */

export function Sites() {
  return (
    <div>
      {SITES.map(({ group, items }) => (
        <section key={group} className="mb-8 last:mb-0">
          <h3 className="font-display text-xl font-semibold tracking-tight mb-3">
            {group}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(([n, d, u, r]) => (
              <div
                key={n}
                className="group rounded-2xl bg-white/[.04] hover:bg-white/[.08] border border-white/5 p-4 flex flex-col transition"
              >
                <a
                  href={u}
                  target="_blank"
                  rel="noopener"
                  className="font-display text-lg font-semibold leading-tight group-hover:text-mango"
                >
                  {n}
                </a>
                <p className="text-sm text-mist leading-snug mt-1.5 flex-1">
                  {d}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs min-w-0">
                  <a
                    href={u}
                    target="_blank"
                    rel="noopener"
                    className="text-bone/50 truncate min-w-0 hover:text-bone"
                  >
                    {host(u)}
                  </a>
                  {r && (
                    <Ext
                      href={`${LINKS.github}/${r}`}
                      className="ml-auto shrink-0 text-bone/60"
                    >
                      Code
                    </Ext>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------- GitHub ---------- */

const LVL = [
  "bg-white/[.05]",
  "bg-violet/30",
  "bg-violet/55",
  "bg-violet/85",
  "bg-mango",
];
const ago = (iso) => {
  const s = (Date.now() - new Date(iso)) / 1e3;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  const d = Math.round(s / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
};

export function GitHub() {
  const d = useGitHub();
  if (!d) return <p className="text-mist">Loading activity from GitHub…</p>;
  const weeks = [];
  d.days.forEach((x, i) => (weeks[Math.floor(i / 7)] ??= []).push(x));
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
        <div>
          <p className="font-display text-6xl font-bold tracking-tight leading-none">
            {d.total.toLocaleString()}
          </p>
          <p className="text-mist mt-2">contributions in the last 12 months</p>
        </div>
        <div className="flex gap-8 pb-1">
          <div>
            <p className="font-display text-3xl font-semibold leading-none">
              {d.last30.toLocaleString()}
            </p>
            <p className="text-sm text-mist mt-1">in the last 30 days</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold leading-none">
              {d.activeDays}
            </p>
            <p className="text-sm text-mist mt-1">days with commits</p>
          </div>
        </div>
      </div>
      <div
        className="overflow-x-auto mt-6 pb-1"
        ref={(el) => el && (el.scrollLeft = el.scrollWidth)}
      >
        <div
          className="flex gap-[3px] w-max"
          role="img"
          aria-label={`${d.total} contributions in the last year`}
        >
          {weeks.map((w, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {w.map((x) => (
                <span
                  key={x.date}
                  title={
                    x.date.startsWith("pad") ? "" : `${x.count} on ${x.date}`
                  }
                  className={`w-[11px] h-[11px] rounded-[3px] ${x.date.startsWith("pad") ? "opacity-0" : LVL[x.level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight mt-8 mb-3">
        What I'm working on
      </h3>
      <ul className="grid sm:grid-cols-2 gap-3">
        {d.repos.map((r) => (
          <li
            key={r.name}
            className="rounded-2xl bg-white/[.04] border border-white/5 p-4"
          >
            <div className="flex items-baseline gap-3">
              <a
                href={r.url}
                target="_blank"
                rel="noopener"
                className="font-display text-lg font-semibold hover:text-mango truncate"
              >
                {r.name}
              </a>
              <span className="ml-auto text-xs text-mist shrink-0">
                {ago(r.pushed)}
              </span>
            </div>
            {r.description && (
              <p className="text-sm text-mist leading-snug mt-1">
                {r.description}
              </p>
            )}
            <div className="flex gap-4 text-xs text-bone/50 mt-2">
              {r.language && <span>{r.language}</span>}
              {r.homepage && (
                <Ext href={r.homepage} className="text-violet">
                  Live
                </Ext>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Ext href={LINKS.github} className="text-violet">
          github.com/EmpowerTours
        </Ext>
      </p>
    </div>
  );
}

/* ---------- Music ---------- */

export function Music() {
  const p = usePlayer();
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
        <img
          src={SONGS[p.idx].img}
          alt={`Cover art for ${SONGS[p.idx].n}`}
          className="w-40 h-40 rounded-2xl object-cover bg-white/5 shadow-2xl"
        />
        <div>
          <h2 className="font-display text-5xl font-bold tracking-tight leading-none">
            Unify34
          </h2>
          <p className="text-mist mt-3 max-w-[52ch]">
            My music. My vocals over beats from independent producers, minted
            on-chain so the artist is paid directly.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => p.toggle()}
              className="inline-flex items-center gap-2 rounded-full bg-mango text-night px-5 py-2.5 font-semibold"
            >
              {p.playing ? <Pause size={16} /> : <Play size={16} />}
              {p.playing ? "Pause" : "Play"}
            </button>
            <a
              href={LINKS.radio}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-white/10 hover:bg-white/15 px-5 py-2.5 font-semibold"
            >
              EmpowerTours Radio
            </a>
          </div>
        </div>
      </div>
      <ol className="mt-6 divide-y divide-white/[.06]">
        {SONGS.map((t, i) => {
          const on = p.idx === i;
          return (
            <li key={t.n}>
              <button
                onClick={() => p.play(i)}
                className={`w-full py-2.5 flex items-center gap-4 text-left rounded-lg px-2 -mx-2 hover:bg-white/[.04] ${on ? "text-mango" : ""}`}
              >
                <span className="w-5 text-right text-sm text-mist tabular-nums">
                  {on && p.playing ? "♪" : i + 1}
                </span>
                <img
                  src={t.img}
                  alt=""
                  loading="lazy"
                  className="w-10 h-10 rounded-md object-cover bg-white/5"
                />
                <span className="flex-1 min-w-0">
                  <span className="font-semibold block truncate">{t.n}</span>
                  <span className="text-xs text-mist">{t.a}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <h3 className="font-display text-xl font-semibold tracking-tight mt-8 mb-3">
        Oyasumi, the video
      </h3>
      <video
        src="/oyasumi.mp4"
        controls
        playsInline
        preload="metadata"
        onPlay={() => p.pause()}
        className="w-full max-h-[60vh] rounded-2xl bg-black"
      />
    </div>
  );
}

/* ---------- X ---------- */

export function XProfile() {
  const [p, setP] = useState(null);
  useEffect(() => {
    fetch("/api/x")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.profile && setP(j.profile))
      .catch(() => {});
  }, []);
  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-5">
        <img
          src={p?.avatar || "/hero.jpg"}
          alt="Earvin Gallardo's X profile photo"
          className="w-20 h-20 rounded-full object-cover bg-white/10"
        />
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-bold tracking-tight leading-none truncate">
            {p?.name || "EmpowerTours"}
          </h2>
          <p className="text-mist mt-1">@EmpowerTours</p>
        </div>
      </div>
      {p?.bio && (
        <p className="mt-5 text-lg leading-relaxed text-bone/90">{p.bio}</p>
      )}
      {p?.followers != null && (
        <p className="mt-2 text-sm text-mist">
          {p.followers.toLocaleString()} followers
        </p>
      )}
      <a
        href={LINKS.x}
        target="_blank"
        rel="noopener"
        className="mt-6 inline-flex rounded-full bg-bone text-night px-6 py-3 font-semibold hover:bg-white"
      >
        Follow @EmpowerTours on X
      </a>
    </div>
  );
}

/* ---------- EmpowerTours ---------- */

export function EmpowerTours({ open }) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-4xl font-bold tracking-tight">
        EmpowerTours
      </h2>
      <p className="text-mist mt-2">
        My company, founded in March 2025. It has two sides.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => open("sites")}
          className="text-left rounded-2xl bg-violet/15 hover:bg-violet/25 border border-violet/20 p-5 transition"
        >
          <span className="font-display text-xl font-semibold block">
            The software studio
          </span>
          <span className="text-sm text-bone/80 block mt-1">
            Consumer apps on Monad: Hunt, Art, Radio, Cota, Regalo and more.
            Open the Sites window to try them.
          </span>
        </button>
        <div className="rounded-2xl bg-mango/15 border border-mango/20 p-5">
          <span className="font-display text-xl font-semibold block">
            The farm and orchard
          </span>
          <span className="text-sm text-bone/80 block mt-1">
            A working farm and orchard in Guerrero, Mexico, open to visitors.
            We're hiring ranch and orchard staff.
          </span>
        </div>
      </div>
      <p className="mt-6 text-bone/85 max-w-[62ch]">
        I also oversee Azteca Lighting & Electric, where I scaled revenue to
        $1.3M in under a year, and Controlled Security Systems, which delivers
        AI, computer vision and life-safety infrastructure.
      </p>
    </div>
  );
}

/* ---------- Updates ---------- */

export function Updates() {
  return (
    <div className="max-w-2xl">
      <p className="text-mist">From my LinkedIn.</p>
      <ul className="mt-4 space-y-3">
        {POSTS.map(([t, b, u]) => (
          <li
            key={t}
            className="rounded-2xl bg-white/[.04] border border-white/5 p-4"
          >
            <p className="font-display text-lg font-semibold">{t}</p>
            <p className="text-sm text-bone/80 mt-1">{b}</p>
            {u && (
              <Ext href={u} className="text-violet text-sm mt-2">
                {host(u)}
              </Ext>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Ext href={LINKS.linkedin} className="text-violet">
          Read the posts on LinkedIn
        </Ext>
      </p>
    </div>
  );
}

/* ---------- Notes (guestbook, signed with a wallet) ---------- */

const fmtDay = (iso) => new Date(iso.replace(" ", "T") + (iso.endsWith("Z") ? "" : "Z")).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
const short = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;

// A small gold 3x3 pattern from the address, so wallets look distinct without a photo.
function WalletMark({ address, size = 24 }) {
  let h = 0;
  for (const c of address.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className="rounded shrink-0" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={(i % 3) * 4} y={Math.floor(i / 3) * 4} width="4" height="4" fill={(h >> i) & 1 ? "#F4A63A" : "#2B2340"} />
      ))}
    </svg>
  );
}

export function Notes() {
  const [list, setList] = useState(null);
  const [wallet, setWallet] = useState(undefined); // undefined = loading, null = signed out, { address, name }
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState({ busy: false, msg: "", ok: false });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setWallet(j?.wallet ?? null))
      .catch(() => setWallet(null));
    fetch("/api/notes")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setList(j.notes))
      .catch(() => setList([]));
  }, []);

  const signIn = async (create) => {
    setState({ busy: true, msg: "", ok: false });
    try {
      const w = await walletSignIn({ create });
      setWallet(w);
      setEditing(!w.name); // first time here: offer a name
      setNameDraft(w.name || "");
      setState({ busy: false, msg: "", ok: false });
    } catch (e) {
      setState({ busy: false, msg: explainWalletError(e), ok: false });
    }
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setWallet(null);
    setEditing(false);
    setState({ busy: false, msg: "Signed out on this site.", ok: true });
  };

  const saveName = async (e) => {
    e.preventDefault();
    setState({ busy: true, msg: "", ok: false });
    const r = await fetch("/api/auth/wallet/name", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: nameDraft }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    if (!r?.ok) return setState({ busy: false, msg: j?.error || "The name didn't save. Try again.", ok: false });
    setWallet(j.wallet);
    setEditing(false);
    // Notes show the current name, so update the ones already on screen.
    setList((l) => l?.map((n) => (n.wallet === j.wallet.address ? { ...n, who: j.wallet.name } : n)));
    setState({ busy: false, msg: "", ok: false });
  };

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return setState({ busy: false, msg: "Write something before leaving a note.", ok: false });
    setState({ busy: true, msg: "", ok: false });
    try {
      const r = await fetch("/api/notes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body, website: hp }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 401) setWallet(null);
      if (!r.ok) return setState({ busy: false, msg: j.error || "The note didn't save. Try again.", ok: false });
      if (j.note) setList((l) => [j.note, ...(l || [])]);
      setBody("");
      setState({ busy: false, msg: "Note left. Thanks for stopping by.", ok: true });
    } catch {
      setState({ busy: false, msg: "The note didn't save. Check your connection and try again.", ok: false });
    }
  };

  const btn = "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold disabled:opacity-60";
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-4xl font-bold tracking-tight">Leave a note</h2>
      <p className="text-mist mt-2">Say hi, ask a question, or tell me what you'd build. Notes are public and dated.</p>

      <div className="mt-6 rounded-2xl bg-[#F6D27A] text-night p-5 shadow-xl">
        {wallet === undefined ? (
          <p className="text-sm">Checking your sign-in…</p>
        ) : !wallet ? (
          <div>
            <p className="font-display text-lg font-semibold">Sign in with your wallet to leave a note</p>
            <p className="text-sm text-night/75 mt-1">
              A Mera passkey wallet: one Face ID or fingerprint, nothing to install. Signing in is free and moves no money.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={state.busy} onClick={() => signIn(false)} className={`${btn} bg-night text-bone hover:bg-plum`}>
                <Fingerprint size={18} aria-hidden />
                {state.busy ? "Waiting for your passkey…" : "Sign in with Mera"}
              </button>
              <button type="button" disabled={state.busy} onClick={() => signIn(true)} className={`${btn} bg-white/80 hover:bg-white`}>
                <Wallet size={18} aria-hidden />
                Create a wallet
              </button>
            </div>
            <p className="text-xs text-night/60 mt-3">First time here? Create a wallet. It lives in your device's passkeys, so use the same device or synced passkeys to sign in again.</p>
          </div>
        ) : editing ? (
          <form onSubmit={saveName}>
            <p className="text-sm flex items-center gap-2">
              <WalletMark address={wallet.address} /> Signed in as <b className="font-mono">{short(wallet.address)}</b>
            </p>
            <label htmlFor="wname" className="font-display text-lg font-semibold block mt-3">
              Register a name for this wallet?
            </label>
            <p className="text-sm text-night/75 mt-1">
              Your notes will show this name instead of <span className="font-mono">{short(wallet.address)}</span>. It's linked to your wallet, and no one else can take it.
            </p>
            <div className="mt-2 flex gap-2">
              <input id="wname" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={40} autoComplete="nickname" placeholder="Your name" className="flex-1 min-w-0 rounded-xl bg-white/70 px-4 py-2.5 placeholder:text-night/40 outline-none focus:ring-2 focus:ring-night" />
              <button disabled={state.busy} className="rounded-xl bg-night text-bone px-5 font-semibold disabled:opacity-60">Register</button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-xl bg-white/70 hover:bg-white px-4 font-semibold">
                Skip
              </button>
            </div>
            <p className="text-xs text-night/60 mt-2">Skip to post as your wallet address. You can register or change the name any time.</p>
          </form>
        ) : (
          <form onSubmit={send}>
            <p className="text-sm flex items-center gap-2 flex-wrap">
              <WalletMark address={wallet.address} />
              Leaving a note as{" "}
              {wallet.name ? (
                <b title={wallet.address}>{wallet.name}</b>
              ) : (
                <b className="font-mono" title={wallet.address}>{short(wallet.address)}</b>
              )}
              <button type="button" onClick={() => { setNameDraft(wallet.name || ""); setEditing(true); }} className="underline underline-offset-2 text-night/70 hover:text-night">
                {wallet.name ? "change name" : "register a name"}
              </button>
              <button type="button" onClick={signOut} className="underline underline-offset-2 text-night/70 hover:text-night">
                sign out
              </button>
            </p>
            <label htmlFor="body" className="sr-only">
              Your note
            </label>
            <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} rows={4} placeholder="Write your note…" className="mt-3 w-full rounded-xl bg-white/70 px-4 py-3 placeholder:text-night/40 outline-none focus:ring-2 focus:ring-night resize-none" />
            {/* Spam trap: hidden from people, filled in by bots. */}
            <input value={hp} onChange={(e) => setHp(e.target.value)} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] w-px h-px opacity-0" />
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xs text-night/60 tabular-nums">{body.length}/500</span>
              <button disabled={state.busy} className="ml-auto rounded-xl bg-night text-bone px-5 py-2.5 font-semibold disabled:opacity-60">
                {state.busy ? "Leaving note…" : "Leave note"}
              </button>
            </div>
          </form>
        )}
        {state.msg && (
          <p role="status" className={`mt-3 text-sm font-medium ${state.ok ? "text-[#2E6B3E]" : "text-[#9B2C1F]"}`}>
            {state.msg}
          </p>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold tracking-tight mt-8 mb-3">{list?.length ? `${list.length} note${list.length === 1 ? "" : "s"}` : "Notes"}</h3>
      {list === null && <p className="text-mist">Loading notes…</p>}
      {list?.length === 0 && <p className="text-mist">No notes yet. Be the first to leave one.</p>}
      <ul className="grid sm:grid-cols-2 gap-3">
        {list?.map((n) => (
          <li key={n.id} className="rounded-2xl bg-white/[.04] border border-white/5 p-4">
            <div className="flex items-center gap-2 min-w-0">
              {n.wallet ? (
                <>
                  <WalletMark address={n.wallet} size={22} />
                  <span title={n.wallet} className={`font-semibold truncate ${n.who ? "" : "font-mono text-sm"}`}>
                    {n.who || short(n.wallet)}
                  </span>
                  <Wallet size={13} className="text-mango shrink-0" aria-label="Signed with a wallet" />
                </>
              ) : n.verified ? (
                <>
                  {n.avatar && <img src={n.avatar} alt="" loading="lazy" className="w-6 h-6 rounded-full shrink-0" />}
                  <a href={`https://x.com/${n.who.slice(1)}`} target="_blank" rel="noopener nofollow ugc" className="font-semibold hover:text-mango truncate">
                    {n.who}
                  </a>
                  <BadgeCheck size={15} className="text-violet shrink-0" aria-label="Verified with X" />
                </>
              ) : (
                <>
                  <span className="font-semibold truncate">{n.who}</span>
                  <span className="text-[11px] text-mist shrink-0">guest</span>
                </>
              )}
              <time dateTime={n.created_at} className="ml-auto text-xs text-mist shrink-0">
                {fmtDay(n.created_at)}
              </time>
            </div>
            <p className="text-sm text-bone/85 mt-2 whitespace-pre-line break-words">{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
