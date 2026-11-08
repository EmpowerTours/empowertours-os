"use client";
// The four windows from the approved black-and-gold design: For artists, Shop, Who he is, Films.
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "./apps";
import { LINKS, SONGS } from "./data";

const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Split-flap word: each letter rolls through random letters, then lands. */
export function Flaps({ word, delay = 0, className = "", flapClass = "", chars = CH, step = 70 }) {
  const [shown, setShown] = useState(() => word.split("").map(() => ""));
  const [going, setGoing] = useState(() => word.split("").map(() => 0));
  useEffect(() => {
    const timers = [];
    word.split("").forEach((target, i) => {
      let n = 4 + i * 2 + Math.floor(Math.random() * 3);
      const tick = () => {
        setShown((s) => {
          const c = [...s];
          c[i] = n-- > 0 ? chars[Math.floor(Math.random() * chars.length)] : target;
          return c;
        });
        setGoing((g) => {
          const c = [...g];
          c[i] = (c[i] + 1) % 2;
          return c;
        });
        if (n >= 0) timers.push(setTimeout(tick, step));
      };
      timers.push(setTimeout(tick, delay + i * 90));
    });
    return () => timers.forEach(clearTimeout);
  }, [word, delay, chars, step]);
  return (
    <div className={`flex ${className}`} aria-label={word} role="img">
      {shown.map((c, i) => (
        <div
          key={`${i}-${going[i]}`}
          aria-hidden
          className={`flap go ${word[i] === "." ? "text-gold2" : ""} ${flapClass}`}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

/** Numbered section heading: "00  GET PAID FOR YOUR MUSIC ........ kicker". */
export function Sec({ n, title, kick }) {
  return (
    <div className="flex items-start gap-3.5 mb-6">
      <span className="label text-mango mt-2">{n}</span>
      <h2
        className="font-display font-black uppercase leading-[.92] text-[clamp(32px,4vw,56px)]"
        style={{ fontStretch: "75%" }}
      >
        {title}
      </h2>
      {kick && (
        <span className="label text-mist ml-auto mt-2 hidden sm:block whitespace-nowrap text-[10px]">
          {kick}
        </span>
      )}
    </div>
  );
}

/* ---------- For artists ---------- */

export function Artists() {
  const [boarding, setBoarding] = useState(false);
  const [boardKey, setBoardKey] = useState(0);
  const launch = () => {
    setBoarding(true);
    setBoardKey((k) => k + 1);
    setTimeout(() => {
      window.open(LINKS.art, "_blank", "noopener");
      setBoarding(false);
    }, 900);
  };
  return (
    <div>
      <Sec n="00" title="Get paid for your music" kick="A message from Earvin" />
      <div className="relative border border-white/[.18] bg-black">
        <video
          src="/pitch.mp4"
          poster="/pitch_poster.jpg"
          controls
          playsInline
          preload="none"
          className="w-full block aspect-video object-cover"
        />
      </div>
      <div className="grid grid-cols-3 border border-t-0 border-white/10">
        {[
          ["90%", "of every sale to the artist"],
          ["MON", "paid to listeners for listening"],
          ["ON-CHAIN", "every play counted on Monad"],
        ].map(([b, s]) => (
          <div key={b} className="px-4 py-3.5 border-r border-white/10 last:border-r-0">
            <b
              className="block font-display font-black text-[clamp(20px,3vw,30px)] leading-none text-gold2"
              style={{ fontStretch: "80%" }}
            >
              {b}
            </b>
            <span className="label text-[10px] text-mist">{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 border border-white/[.18] bg-[#0E0D0B] p-4">
        <div className="flex justify-between label text-[10px] text-mist mb-3">
          <span>Departures · artists</span>
          <em className="not-italic text-gold2 blink">Now boarding</em>
        </div>
        <Flaps
          key={boardKey}
          word="ART.EMPOWERTOURS.XYZ"
          chars={CH + "."}
          step={60}
          className="gap-[3px] flex-wrap"
          flapClass="w-[clamp(15px,2.6vw,34px)] h-[clamp(24px,3.6vw,46px)] text-[clamp(12px,2.1vw,28px)] !rounded-[3px]"
        />
      </div>
      <button
        onClick={launch}
        className={`sheen relative overflow-hidden mt-3.5 w-full flex items-center justify-between px-5 py-4 font-mono font-bold text-xs tracking-[.18em] uppercase text-night ${boarding ? "bg-bone" : "bg-mango hover:bg-gold2"}`}
      >
        <span>
          {boarding
            ? "Boarding · opening art.empowertours.xyz"
            : "Open the protocol · upload your music"}
        </span>
        <span className="text-lg">→</span>
      </button>
    </div>
  );
}

/* ---------- Shop: real covers, checkout happens on art.empowertours.xyz ---------- */

export function Shop() {
  // One card per distinct cover, so the grid doesn't repeat art.
  const seen = new Set();
  const items = SONGS.filter((s) => (seen.has(s.img) ? false : seen.add(s.img)));
  const { play } = usePlayer();
  return (
    <div>
      <Sec n="04" title="Own the music" kick="Minted on Monad · art.empowertours.xyz" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3.5">
        {items.map((s) => {
          const i = SONGS.indexOf(s);
          return (
            <div key={s.n} className="border border-white/10 bg-plum flex flex-col">
              <img
                src={s.img}
                alt={`${s.n} cover art`}
                loading="lazy"
                className="w-full aspect-square object-cover block bg-[#0d0c0a]"
              />
              <div className="p-3">
                <span className="label text-[10px] text-mist">{s.a} · music NFT</span>
                <h3
                  className="font-display font-black uppercase text-[22px] leading-none mt-1 mb-3"
                  style={{ fontStretch: "75%" }}
                >
                  {s.n}
                </h3>
                <div className="flex gap-1.5">
                  <a
                    href={LINKS.art}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 text-center font-mono font-semibold text-[10px] tracking-[.12em] uppercase py-2.5 bg-mango text-night hover:bg-gold2"
                  >
                    Buy
                  </a>
                  <button
                    onClick={() => play(i)}
                    className="flex-1 font-mono font-semibold text-[10px] tracking-[.12em] uppercase py-2.5 border border-white/[.18] hover:border-mango"
                  >
                    Listen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="label text-[10px] text-mist mt-4">
        Every sale settles on-chain: <b className="text-gold2 font-medium">90% to Earvin</b> ·
        checkout and prices on art.empowertours.xyz
      </p>
    </div>
  );
}

/* ---------- Who he is ---------- */

const CANON = [
  ["Head", "A camouflage bandana tied over the head, knot at the back."],
  ["Shades", "Gold-framed aviators with amber mirrored lenses. On in every shot; he lowers them with one finger, never takes them off."],
  ["Chain", "One heavy gold Cuban link chain. The only gold on him besides the frames."],
  ["Tee", "A plain white crew-neck t-shirt. No logos."],
  ["Face", "Short dark beard, strong jaw, calm and unimpressed. He nods instead of smiling."],
  ["Room", "Black walls with gold mouldings, gold baroque chairs, warm low light."],
  ["Colour", "Black, white and gold. Gold is the one accent, on him and on this site."],
  ["Medium", "Photographic, film grain, cinematic light. Never cartoon."],
];

export function Canon() {
  return (
    <div>
      <Sec n="01" title="Who he is" kick="The canon · the full character" />
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-8">
        <div>
          <div className="relative p-2 before:absolute before:left-0 before:top-0 before:w-3 before:h-3 before:border-l before:border-t before:border-bone after:absolute after:right-0 after:bottom-0 after:w-3 after:h-3 after:border-r after:border-b after:border-bone">
            <img
              src="/still.jpg"
              alt="Earvin Gallardo Bravo in a camo bandana, gold aviators and a gold chain"
              className="w-full block"
            />
          </div>
          <p className="label text-[10px] text-mist mt-2.5">Still 01 · the casting clip</p>
          <p className="text-[13px] text-mist mt-1.5 leading-relaxed">
            The reference clip every image and film of him starts from. The look is
            constant; the worlds change.
          </p>
        </div>
        <div>
          <p className="text-xl leading-snug mb-5">
            Earvin Gallardo Bravo records as <b className="text-gold2">Unify34</b>. Real
            voice, real songs, released on-chain. The music videos are made with AI, and
            he is the main character in all of them.
          </p>
          <div className="border-t border-white/10">
            {CANON.map(([k, v], i) => (
              <div
                key={k}
                className="grid sm:grid-cols-[110px_1fr] gap-1 sm:gap-3.5 py-3 border-b border-white/10 text-sm leading-relaxed"
              >
                <span className="label text-[10px] text-mist pt-0.5">
                  <b className="text-mango font-medium mr-2">0{i + 1}</b>
                  {k}
                </span>
                <div>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Films ---------- */

export function Films() {
  const { play } = usePlayer();
  const ad = useRef(null);
  return (
    <div>
      <Sec n="02" title="The films" kick="Music videos" />
      <p className="text-[13px] text-mist leading-relaxed -mt-1.5 mb-5 max-w-[720px]">
        One card per song. The audio is the real record, my vocals. A card fills in when
        its music video is made.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
        <div className="border border-mango/60 bg-plum flex flex-col">
          <div className="aspect-[16/10] bg-black">
            <video
              ref={ad}
              src="/pitch.mp4"
              poster="/pitch_poster.jpg"
              controls
              playsInline
              preload="none"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="p-3">
            <span className="label text-[10px] text-mist">EmpowerTours</span>
            <h3
              className="font-display font-black uppercase text-[26px] leading-none mt-1.5 mb-2"
              style={{ fontStretch: "72%" }}
            >
              The commercial
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              <span className="label text-[9px] border border-mango text-gold2 px-1.5 py-0.5">
                Real voice
              </span>
              <span className="label text-[9px] border border-white/[.18] text-[#CFC7BA] px-1.5 py-0.5">
                Out now
              </span>
            </div>
          </div>
        </div>
        {SONGS.map((s, i) => (
          <div key={s.n} className="border border-white/10 bg-plum flex flex-col">
            <div className="aspect-[16/10] grid place-items-center label text-[10px] text-[#5E584F] bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgba(242,236,225,.03)_10px_20px)]">
              Video in production
            </div>
            <div className="p-3">
              <span className="label text-[10px] text-mist">{s.a}</span>
              <h3
                className="font-display font-black uppercase text-[26px] leading-none mt-1.5 mb-2"
                style={{ fontStretch: "72%" }}
              >
                {s.n}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                <span className="label text-[9px] border border-mango text-gold2 px-1.5 py-0.5">
                  Real vocals
                </span>
                <button
                  onClick={() => play(i)}
                  className="label text-[9px] border border-white/[.18] text-[#CFC7BA] px-1.5 py-0.5 hover:border-mango"
                >
                  ▶ Listen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
