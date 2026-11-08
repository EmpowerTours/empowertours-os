// Checks /api/health every 5 minutes. Emails only when the state changes (up -> down, down -> up),
// and a check counts as down only after a retry 15 s later also fails, so a single blip is ignored.
import { EmailMessage } from "cloudflare:email";

const URL_ = "https://earvingallardo.com/api/health";
const FROM = "uptime@csecsystems.com";
const TO = "unify34@gmail.com";

async function probe() {
  try {
    const r = await fetch(URL_, { headers: { "user-agent": "earvingallardo-uptime" }, cf: { cacheTtl: 0 } });
    const body = await r.text();
    let ok = false;
    try { ok = r.status === 200 && JSON.parse(body).ok === true; } catch {}
    return { ok, detail: `HTTP ${r.status} ${body.slice(0, 200)}` };
  } catch (e) {
    return { ok: false, detail: `fetch failed: ${e.message}` };
  }
}

async function send(env, subject, text) {
  const raw = [
    `From: earvingallardo.com uptime <${FROM}>`,
    `To: ${TO}`,
    `Subject: ${subject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@csecsystems.com>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    text,
  ].join("\r\n");
  await env.ALERT.send(new EmailMessage(FROM, TO, raw));
}

export default {
  async scheduled(_evt, env) {
    let res = await probe();
    if (!res.ok) {
      await new Promise((r) => setTimeout(r, 15000));
      res = await probe();
    }
    const now = res.ok ? "up" : "down";
    const prev = await env.STATE.get("status"); // null on the very first run
    if (prev === now) return;
    await env.STATE.put("status", now);
    const when = new Date().toISOString();
    if (prev === null) {
      await send(env, "Monitoring earvingallardo.com: it is " + now.toUpperCase(),
        `Uptime monitoring is now on. It checks ${URL_} every 5 minutes and emails you when the site goes down and when it recovers.\n\nFirst check (${when}): ${res.detail}`);
    } else if (now === "down") {
      await send(env, "DOWN: earvingallardo.com", `The health check failed twice in a row at ${when}.\n\n${res.detail}\n\nCheck: ${URL_}`);
    } else {
      await send(env, "Back up: earvingallardo.com", `The site is healthy again as of ${when}.\n\n${res.detail}`);
    }
  },
};
