import { LINKS } from "../data";

export const metadata = {
  title: "Privacy · Earvin Gallardo",
  description: "What earvingallardo.com collects, why, and how to remove it.",
  alternates: { canonical: "/privacy" },
};

const H = ({ children }) => (
  <h2 className="font-display text-2xl font-semibold tracking-tight mt-10 mb-3">
    {children}
  </h2>
);

export default function Privacy() {
  return (
    <main className="min-h-screen bg-night text-bone">
      <div className="max-w-2xl mx-auto px-6 py-14 leading-relaxed">
        <a
          href="/"
          className="text-sm text-mist underline underline-offset-2 hover:text-bone"
        >
          ← earvingallardo.com
        </a>
        <h1 className="font-display text-5xl font-bold tracking-tight mt-6">
          Privacy
        </h1>
        <p className="text-mist mt-2 text-sm">Last updated 7 November 2026</p>

        <p className="mt-6">
          This is my personal site. It has no ads, sells nothing about you, and
          only keeps what it needs to run the guestbook. Here is all of it.
        </p>

        <H>Notes you leave</H>
        <ul className="list-disc pl-5 space-y-2 text-bone/90">
          <li>
            A note is public: its text, the date, and the wallet that signed it,
            shown as the name you registered or, without one, as the wallet
            address.
          </li>
          <li>
            Older notes, from before wallet sign-in, show the X handle and
            profile photo, or the guest name, they were left with.
          </li>
          <li>
            To stop rate-limit abuse, each note is stored with a one-way hash of
            your IP address mixed with a secret. The IP itself is never stored
            and the hash can't be turned back into it.
          </li>
        </ul>

        <H>Your wallet</H>
        <ul className="list-disc pl-5 space-y-2 text-bone/90">
          <li>
            Sign-in uses a Mera passkey wallet. The wallet's key is made on your
            device from your passkey (Face ID, fingerprint or your password
            manager) and never leaves it. The site only receives a signature
            over a one-time sign-in message, and keeps your wallet address and,
            if you choose one, your registered name.
          </li>
          <li>Signing in is free and moves no money.</li>
          <li>
            Your browser remembers which passkey you used, so it can ask for the
            same one next time. That stays in your browser.
          </li>
        </ul>

        <H>Cookies</H>
        <p className="text-bone/90">
          Only sign-in cookies, which the guestbook needs to work:{" "}
          <code className="text-mango">eg_w</code> keeps you signed in with your
          wallet for 30 days, and <code className="text-mango">eg_x</code> /{" "}
          <code className="text-mango">eg_xo</code> belong to the older X
          sign-in. They are HTTP-only and sent over HTTPS only. There are no
          tracking or advertising cookies.
        </p>

        <H>Other services</H>
        <ul className="list-disc pl-5 space-y-2 text-bone/90">
          <li>
            The site runs on Cloudflare, which handles every request and keeps
            standard logs under its own privacy policy.
          </li>
          <li>
            Songs and cover art load from an IPFS gateway (Pinata), and older
            notes' profile photos load from X, so those services see your IP
            when they load.
          </li>
        </ul>

        <H>Changing or removing your data</H>
        <p className="text-bone/90">
          You can change or clear your registered name at any time from the
          Notes window. To have a note removed, message{" "}
          <a href={LINKS.x} className="underline underline-offset-2 text-mango">
            @EmpowerTours on X
          </a>{" "}
          from the account or wallet that left it, and I'll take it down.
        </p>
      </div>
    </main>
  );
}
