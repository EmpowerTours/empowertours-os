"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clapperboard,
  Globe,
  Mic,
  Music2,
  Newspaper,
  Pause,
  Play,
  ScanFace,
  ShoppingBag,
  SkipForward,
  Sprout,
  StickyNote,
  User,
} from "lucide-react";
import {
  About,
  EmpowerTours,
  GitHub,
  Music,
  Notes,
  Player,
  Sites,
  Updates,
  XProfile,
  useGitHub,
  usePlayer,
} from "./apps";
import { SONGS } from "./data";
import { Artists, Canon, Films, Flaps, Shop } from "./gallery";

/* ---------- brand marks (not in the icon set) ---------- */

const GitHubMark = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
const XMark = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
  </svg>
);

/* ---------- apps ---------- */

const GOLD = "bg-mango text-night border-mango";
const DARK = "bg-plum text-bone border-white/10";
const APPS = {
  artists: { title: "For artists", icon: <Mic size={22} />, tile: GOLD, w: 980, isNew: true },
  shop: { title: "Shop", icon: <ShoppingBag size={22} />, tile: GOLD, w: 1040, isNew: true },
  canon: { title: "Who he is", icon: <ScanFace size={22} />, tile: GOLD, w: 1080, isNew: true },
  films: { title: "Films", icon: <Clapperboard size={22} />, tile: GOLD, w: 1040, isNew: true },
  about: { title: "About", icon: <User size={22} />, tile: DARK, w: 860, gap: true },
  music: { title: "Music", icon: <Music2 size={22} />, tile: DARK, w: 760 },
  sites: { title: "Sites", icon: <Globe size={22} />, tile: DARK, w: 1040 },
  github: { title: "GitHub", icon: <GitHubMark />, tile: DARK, w: 960 },
  x: { title: "X", icon: <XMark />, tile: DARK, w: 640 },
  empowertours: { title: "EmpowerTours", icon: <Sprout size={22} />, tile: DARK, w: 820 },
  notes: { title: "Notes", icon: <StickyNote size={22} />, tile: DARK, w: 820 },
  updates: { title: "Updates", icon: <Newspaper size={22} />, tile: DARK, w: 720 },
};
const render = (id, open) =>
  ({
    artists: <Artists />,
    shop: <Shop />,
    canon: <Canon />,
    films: <Films />,
    about: <About open={open} />,
    music: <Music />,
    sites: <Sites />,
    github: <GitHub />,
    x: <XProfile />,
    empowertours: <EmpowerTours open={open} />,
    notes: <Notes />,
    updates: <Updates />,
  })[id];

/* ---------- clock ---------- */

function useNow() {
  const [n, setN] = useState(null);
  useEffect(() => {
    setN(new Date());
    const t = setInterval(() => setN(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return n;
}
const hhmm = (d) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/* ---------- wallpaper: a year of commits as a ribbon of tiles ---------- */

const TILE = [
  "bg-mango/[.07]",
  "bg-mango/20",
  "bg-mango/40",
  "bg-gold2/60",
  "bg-gold2",
];
function Ribbon({ dim }) {
  const gh = useGitHub();
  const weeks = useMemo(() => {
    const days =
      gh?.days ??
      Array.from({ length: 371 }, (_, i) => ({ date: `blank-${i}`, level: 0 }));
    const w = [];
    days.forEach((x, i) => (w[Math.floor(i / 7)] ??= []).push(x));
    return w;
  }, [gh]);
  const last = gh?.days?.[gh.days.length - 1]?.date;
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${dim ? "opacity-40" : "opacity-100"}`}
      style={{ perspective: "1400px" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_10%,#2A2112_0%,#120F0B_45%,#0A0908_100%)]" />
      <div
        className="absolute left-1/2 top-1/2 flex gap-[7px]"
        style={{
          transform:
            "translate(-50%,-50%) rotateX(56deg) rotateZ(-34deg) scale(1.15)",
          transformStyle: "preserve-3d",
        }}
      >
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-[7px]">
            {w.map((x, di) => (
              <span
                key={x.date}
                style={
                  gh
                    ? { animationDelay: `${(wi * 7 + di) * 2.2}ms` }
                    : undefined
                }
                className={`block w-[30px] h-[30px] rounded-[3px] ${x.date.startsWith("pad") ? "opacity-0" : TILE[x.level]} ${gh ? "cell-on" : ""} ${x.date === last ? "cell-today bg-mango" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- TV splash: the commercial, once per visitor ---------- */

const SEEN_KEY = "eg_ad_seen";
const POWER_PATH = "M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0";
const PowerGlyph = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d={POWER_PATH} />
  </svg>
);

function TvSplash({ onDone }) {
  const tv = useRef(null);
  const scr = useRef(null);
  const ad = useRef(null);
  const snow = useRef(null);
  const osd = useRef(null);
  const dot = useRef(null);
  const [stage, setStage] = useState("standby"); // standby | on | playing
  const [muted, setMuted] = useState(false);
  const [src, setSrc] = useState(null);
  const snowOn = useRef(false);

  useEffect(() => {
    setSrc(matchMedia("(max-aspect-ratio: 4/5)").matches ? "/pitch_v.mp4" : "/pitch.mp4");
    const ctx = snow.current.getContext("2d");
    let raf;
    const noise = () => {
      if (snowOn.current) {
        const im = ctx.createImageData(320, 180);
        for (let i = 0; i < im.data.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
          im.data[i + 3] = 255;
        }
        ctx.putImageData(im, 0, 0);
      }
      raf = requestAnimationFrame(noise);
    };
    noise();
    return () => cancelAnimationFrame(raf);
  }, []);

  const anim = (el, kf, ms, easing = "cubic-bezier(.2,.7,.2,1)") =>
    el.animate(kf, { duration: ms, easing, fill: "forwards" }).finished;

  const turnOn = async () => {
    setStage("on");
    const s = scr.current;
    s.style.visibility = "visible";
    s.style.background = "#fff";
    await anim(s, [{ transform: "scale(0,.004)", filter: "brightness(3)" }, { transform: "scale(1,.004)", filter: "brightness(3)" }], 170);
    await anim(s, [{ transform: "scale(1,.004)", filter: "brightness(3)" }, { transform: "scale(1,1)", filter: "brightness(1.6)" }], 230);
    s.style.background = "#000";
    snowOn.current = true;
    snow.current.style.opacity = 1;
    anim(s, [{ filter: "brightness(1.6)" }, { filter: "brightness(1)" }], 300);
    osd.current.style.opacity = 1;
    try {
      await ad.current.play();
    } catch {
      ad.current.muted = true;
      setMuted(true);
      try { await ad.current.play(); } catch {}
    }
    await new Promise((r) => setTimeout(r, 380));
    await anim(snow.current, [{ opacity: 1 }, { opacity: 0 }], 320);
    snowOn.current = false;
    setStage("playing");
    setTimeout(() => osd.current && anim(osd.current, [{ opacity: 1 }, { opacity: 0 }], 600), 2200);
  };

  const turnOff = async () => {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    ad.current?.pause();
    if (stage !== "standby") {
      const s = scr.current;
      s.style.background = "#fff";
      await anim(s, [{ transform: "scale(1,1)", filter: "brightness(1)" }, { transform: "scale(1,.004)", filter: "brightness(4)" }], 200, "ease-in");
      await anim(s, [{ transform: "scale(1,.004)" }, { transform: "scale(0,.004)" }], 160, "ease-in");
      dot.current.style.opacity = 1;
      await anim(dot.current, [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.2)" }], 500, "ease-out");
    }
    await anim(tv.current, [{ opacity: 1 }, { opacity: 0 }], 450);
    onDone();
  };

  const ctl = "label px-3.5 py-2.5 border border-bone/30 bg-night/55 text-bone hover:border-mango hover:text-gold2";
  return (
    <section ref={tv} aria-label="Commercial" className="fixed inset-0 z-[200] bg-black grid place-items-center overflow-hidden">
      <div ref={scr} className="absolute inset-0 bg-black overflow-hidden" style={{ visibility: "hidden", transformOrigin: "50% 50%" }}>
        <video ref={ad} src={src || undefined} playsInline preload="auto" onEnded={turnOff} className="absolute inset-0 w-full h-full object-contain bg-black" />
        <canvas ref={snow} width={320} height={180} className="absolute inset-0 w-full h-full opacity-0" style={{ imageRendering: "pixelated" }} />
        <div className="crt" />
        <div ref={osd} className="absolute top-7 right-9 font-mono font-bold text-[34px] tracking-[.06em] text-[#7CFF8A] opacity-0" style={{ textShadow: "0 0 10px rgba(124,255,138,.8)" }}>
          CH 34<small className="block text-[13px] tracking-[.2em] text-right">EMPOWERTOURS</small>
        </div>
      </div>
      {stage === "standby" && (
        <div className="relative z-[3] flex flex-col items-center gap-6 text-center px-6">
          <button onClick={turnOn} aria-label="Turn on the TV and play the commercial" className="breathe w-[108px] h-[108px] rounded-full border-2 border-mango grid place-items-center text-gold2 hover:bg-mango hover:text-night">
            <PowerGlyph />
          </button>
          <b className="font-display font-extrabold text-[15px] tracking-[.2em]">EARVIN GALLARDO</b>
          <p className="label text-mist tracking-[.3em]">Press power · sound on</p>
          <button onClick={turnOff} className="label text-[10px] text-mist/70 underline underline-offset-4 hover:text-bone mt-2">
            Skip to the site
          </button>
        </div>
      )}
      <span className={`absolute right-[30px] bottom-[26px] w-2 h-2 rounded-full z-[3] ${stage === "standby" ? "bg-[#E5484D] shadow-[0_0_10px_#E5484D]" : "bg-[#7CFF8A] shadow-[0_0_10px_#7CFF8A]"}`} />
      <span ref={dot} className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -m-[3px] rounded-full bg-white opacity-0 z-[5]" style={{ boxShadow: "0 0 30px 12px rgba(255,255,255,.7)" }} />
      <div className={`absolute right-6 bottom-[22px] flex gap-2 z-[4] transition-opacity duration-500 ${stage === "playing" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button className={ctl} onClick={() => { ad.current.muted = !ad.current.muted; setMuted(ad.current.muted); }}>
          {muted ? "Unmute" : "Mute"}
        </button>
        <button className={ctl} onClick={turnOff}>Skip ▸</button>
      </div>
    </section>
  );
}

/* ---------- landing: Earvin on film, face box, split-flap name ---------- */

// Face box in source video coords (1280x720), mapped through object-fit: cover.
const FACES = [[520, 120, 360, 420], [560, 110, 330, 400], [600, 130, 320, 390], [590, 120, 330, 400]];

function useFaceBox() {
  const [box, setBox] = useState(null);
  useEffect(() => {
    let fi = 0;
    const place = () => {
      const W = innerWidth, H = innerHeight, vw = 1280, vh = 720, s = Math.max(W / vw, H / vh);
      const ox = (W - vw * s) / 2, oy = (H - vh * s) / 2;
      const [x, y, w, h] = FACES[fi % FACES.length];
      setBox({ left: ox + x * s, top: oy + y * s, width: w * s, height: h * s, conf: (0.93 + Math.random() * 0.06).toFixed(2) });
    };
    place();
    const t = setInterval(() => { fi++; place(); }, 1000);
    addEventListener("resize", place);
    return () => { clearInterval(t); removeEventListener("resize", place); };
  }, []);
  return box;
}

const LEDE_SONGS = ["OYASUMI", "Dime Que Si", "Suddenly", "Money Making Machine", "Killah", "MARINA"];

function Boot({ onPower, now, replay }) {
  const box = useFaceBox();
  const { idx, play } = usePlayer();
  const btn = "label px-5 py-3.5 border border-white/[.18] bg-night/35 backdrop-blur-md hover:border-mango";
  return (
    <motion.section
      className="fixed inset-0 z-[100] overflow-hidden bg-night"
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.6 } }}
    >
      <video src="/earvin.mp4" poster="/still.jpg" autoPlay muted loop playsInline aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(.9) contrast(1.05)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(10,9,8,.92) 0%,rgba(10,9,8,.55) 42%,rgba(10,9,8,.05) 70%),linear-gradient(0deg,rgba(10,9,8,.95) 0%,rgba(10,9,8,0) 45%)" }} />
      <div className="grain" aria-hidden />
      {box && (
        <div aria-hidden className="hidden sm:block absolute z-[2] border border-gold2/75 pointer-events-none transition-all duration-[900ms] ease-[cubic-bezier(.3,.7,.2,1)] before:absolute before:-left-0.5 before:-top-0.5 before:w-2.5 before:h-2.5 before:border-2 before:border-r-0 before:border-b-0 before:border-gold2 after:absolute after:-right-0.5 after:-bottom-0.5 after:w-2.5 after:h-2.5 after:border-2 after:border-l-0 after:border-t-0 after:border-gold2" style={{ left: box.left, top: box.top, width: box.width, height: box.height }}>
          <i className="absolute left-0 -top-5 font-mono text-[10px] tracking-[.06em] not-italic whitespace-nowrap">
            earvin gallardo <em className="not-italic text-gold2">{box.conf}</em>
          </i>
        </div>
      )}
      <div className="absolute top-0 inset-x-0 z-[3] flex justify-between items-center px-4 sm:px-10 py-4 sm:py-[22px] border-b border-white/10">
        <div className="flex items-baseline gap-3">
          <b className="font-display font-extrabold text-[15px] tracking-[.18em] border-l-[3px] border-mango pl-2.5" style={{ fontStretch: "110%" }}>EARVIN</b>
          <span className="font-mono text-[10px] tracking-[.14em] text-mist">GALLARDO.COM</span>
        </div>
        <span className="label text-mist tabular-nums">{now ? hhmm(now).toUpperCase() : ""}</span>
      </div>
      <div className="absolute z-[3] left-4 right-4 sm:right-auto sm:left-10 bottom-[120px] sm:bottom-16 max-w-[680px]">
        <h1 className="sr-only">Earvin Gallardo</h1>
        <Flaps word="EARVIN" delay={300} className="gap-1.5 mb-3.5" flapClass="w-[clamp(44px,7.4vw,96px)] h-[clamp(60px,10vw,128px)] text-[clamp(34px,6vw,80px)]" />
        <p className="font-mono font-medium text-[13px] tracking-[.32em] text-gold2 mb-[18px] ml-0.5">GALLARDO BRAVO · UNIFY34</p>
        <p className="text-[clamp(17px,1.5vw,21px)] leading-[1.45] text-[#E6DFD3] max-w-[600px]">
          Music artist, developer and founder. Marine Corps veteran. The voice on{" "}
          {LEDE_SONGS.map((n, k) => {
            const i = SONGS.findIndex((s) => s.n === n);
            return (
              <span key={n}>
                <button onClick={() => play(i)} className="text-gold2 hover:underline underline-offset-4">{n}</button>
                {k < LEDE_SONGS.length - 2 ? ", " : k === LEDE_SONGS.length - 2 ? " and " : ""}
              </span>
            );
          })}
          . My songs, my code and the films.
        </p>
        <div className="flex gap-2.5 mt-[26px] flex-wrap">
          <button onClick={() => onPower()} className="label px-5 py-3.5 bg-bone text-night border border-bone flex items-center gap-2.5 hover:bg-gold2">
            <PowerGlyph size={14} /> Power on
          </button>
          <button onClick={replay} className={btn}>▶ Watch the commercial</button>
          <button onClick={() => onPower("artists")} className={btn}>For artists</button>
          <button onClick={() => onPower("canon")} className={btn}>Meet him</button>
          <button onClick={() => onPower("notes")} className={btn}>Leave a note</button>
        </div>
      </div>
      <div className="absolute z-[3] left-4 sm:left-auto sm:right-10 bottom-[22px] sm:bottom-16 text-left sm:text-right">
        <p className="font-mono text-[11px] leading-[1.8] tracking-[.12em] text-[#CFC7BA] uppercase">Now playing · {SONGS[idx].n}</p>
        <p className="font-mono text-[11px] leading-[1.8] tracking-[.12em] text-[#CFC7BA] uppercase">Unify34 · on EmpowerTours</p>
        <p className="font-mono text-[10px] tracking-[.1em] text-mist mt-1">
          © {new Date().getFullYear()} Earvin Gallardo ·{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-bone">Privacy</a>
        </p>
      </div>
    </motion.section>
  );
}

/* ---------- window ---------- */

function Win({ id, z, idx, mobile, focused, focus, close }) {
  const a = APPS[id];
  const [max, setMax] = useState(false);
  const W = a.w;
  const box = max
    ? { left: 16, right: 16, top: 56, bottom: 104 }
    : {
        width: `min(${W}px, calc(100vw - 48px))`,
        height: "min(calc(100vh - 178px), 900px)",
        left: `max(24px, calc(50% - ${W / 2}px + ${idx * 24}px))`,
        top: `calc(60px + ${idx * 22}px)`,
      };
  return (
    <motion.section
      aria-label={a.title}
      drag={!mobile && !max}
      dragMomentum={false}
      onPointerDown={focus}
      initial={{ opacity: 0, scale: 0.97, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 14 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className={`${mobile ? "fixed inset-x-0 bottom-0 top-11" : "absolute"} pane flex flex-col overflow-hidden ${focused ? "shadow-[0_30px_80px_rgba(0,0,0,.6)]" : "shadow-[0_16px_40px_rgba(0,0,0,.45)]"}`}
      style={mobile ? { zIndex: z } : { zIndex: z, ...box }}
    >
      <header
        onDoubleClick={() => !mobile && setMax((m) => !m)}
        className="flex items-center justify-between gap-3 px-3.5 h-11 shrink-0 cursor-grab active:cursor-grabbing select-none border-b border-white/10"
      >
        <span className="label text-mist truncate">
          <b className="text-bone font-medium">{a.title}</b> · earvingallardo.com
        </span>
        <div className="flex gap-1.5 shrink-0">
          {!mobile && (
            <button
              onClick={() => setMax((m) => !m)}
              aria-label={max ? "Restore window" : "Maximise window"}
              className="w-[22px] h-[22px] grid place-items-center border border-white/[.18] font-mono text-[11px] hover:bg-mango hover:text-night hover:border-mango"
            >
              {max ? "▫" : "□"}
            </button>
          )}
          <button
            onClick={close}
            aria-label={`Close ${a.title}`}
            className="w-[22px] h-[22px] grid place-items-center border border-white/[.18] font-mono text-[11px] hover:bg-mango hover:text-night hover:border-mango"
          >
            ×
          </button>
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-[30px] py-5 sm:py-7">
        {render(id, focus.open)}
      </div>
    </motion.section>
  );
}

/* ---------- the OS ---------- */

export default function Page() {
  const now = useNow();
  const [powered, setPowered] = useState(false);
  const [tv, setTv] = useState(false);
  const [wins, setWins] = useState([]);
  const [top, setTop] = useState(10);
  const [mobile, setMobile] = useState(false);

  // One audio element for the whole OS.
  const audio = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const play = useCallback(
    (i) => {
      const el = audio.current;
      if (!el) return;
      if (i !== undefined && i !== idx) {
        setIdx(i);
        el.src = SONGS[i].au;
      }
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    },
    [idx],
  );
  const pause = useCallback(() => {
    audio.current?.pause();
    setPlaying(false);
  }, []);
  const toggle = useCallback(
    () => (playing ? pause() : play()),
    [playing, pause, play],
  );
  const next = useCallback(() => play((idx + 1) % SONGS.length), [idx, play]);
  const player = { idx, playing, play, pause, toggle, next };

  const open = useCallback(
    (id) => {
      setTop((t) => t + 1);
      setWins((w) =>
        w.find((x) => x.id === id)
          ? w.map((x) => (x.id === id ? { ...x, z: top + 1 } : x))
          : [...w, { id, z: top + 1 }],
      );
    },
    [top],
  );
  const close = (id) => setWins((w) => w.filter((x) => x.id !== id));
  const focusWin = (id) => {
    setTop((t) => t + 1);
    setWins((w) => w.map((x) => (x.id === id ? { ...x, z: top + 1 } : x)));
  };

  useEffect(() => {
    const f = () => setMobile(window.innerWidth < 640);
    f();
    window.addEventListener("resize", f);
    const qs = new URLSearchParams(location.search);
    const q = qs.get("open");
    if (q && APPS[q]) {
      setPowered(true);
      setWins([{ id: q, z: 11 }]);
    } else {
      // First visit: the TV with the commercial. After that it stays off unless asked for.
      let seen = false;
      try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch {}
      if (!seen || qs.has("tv")) setTv(true);
    }
    return () => window.removeEventListener("resize", f);
  }, []);

  const power = (app) => {
    setPowered(true);
    if (app) setTimeout(() => open(app), 350);
  };
  const focused = wins.reduce((a, b) => (!a || b.z > a.z ? b : a), null);
  const tiles = Object.entries(APPS);

  return (
    <Player.Provider value={player}>
      <main className="fixed inset-0 overflow-hidden bg-night">
        <audio ref={audio} src={SONGS[0].au} preload="none" onEnded={next} />
        <Ribbon dim={wins.length > 0} />

        {/* menu bar */}
        {powered && (
          <div className="bar relative z-50 h-11 flex items-center gap-3 px-3 sm:px-[22px] border-b border-white/10">
            <button
              onClick={() => {
                setWins([]);
                setPowered(false);
              }}
              title="Power off"
              className="font-display font-extrabold text-[13px] tracking-[.16em] border-l-[3px] border-mango pl-2 hover:text-gold2"
            >
              EG
            </button>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[.12em] text-mist uppercase">
              {focused ? APPS[focused.id].title : "Earvin Gallardo Bravo"}
            </span>
            <div className="ml-auto flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play Unify34"}
                className="w-7 h-7 grid place-items-center rounded-full bg-mango text-night shrink-0"
              >
                {playing ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                onClick={() => open("music")}
                className="min-w-0 text-left hover:text-gold2"
              >
                <span className="block truncate max-w-[34vw] sm:max-w-[260px] font-mono text-[11px] tracking-[.1em] uppercase">
                  <span className="font-medium">{SONGS[idx].n}</span>
                  <span className="text-mist normal-case"> by {SONGS[idx].a}</span>
                </span>
              </button>
              <button
                onClick={next}
                aria-label="Next track"
                className="hidden sm:grid w-7 h-7 place-items-center rounded-full hover:bg-white/10 shrink-0"
              >
                <SkipForward size={12} />
              </button>
              <span className="font-mono text-[11px] text-mist tabular-nums pl-1 sm:pl-3 shrink-0">
                {now ? hhmm(now).toUpperCase() : ""}
              </span>
            </div>
          </div>
        )}

        {/* desktop: name and app icons */}
        {powered && (
          <>
            <div className="absolute left-4 sm:left-10 bottom-8 sm:bottom-[132px] z-0 pointer-events-none">
              <Flaps
                word="EARVIN"
                delay={500}
                className="gap-1.5"
                flapClass="w-[clamp(30px,4vw,54px)] h-[clamp(42px,5.4vw,72px)] text-[clamp(24px,3.4vw,46px)]"
              />
              <p className="font-mono text-[11px] tracking-[.2em] text-mist mt-2">
                MUSIC ARTIST · DEVELOPER · FOUNDER
              </p>
            </div>
            <nav
              aria-label="Apps"
              className="sm:hidden absolute z-10 top-16 left-4 right-4 grid grid-cols-4 gap-x-3 gap-y-4"
            >
              {tiles.map(([k, a]) => (
                <button
                  key={k}
                  onClick={() => open(k)}
                  className="flex flex-col items-center gap-1.5 font-mono text-[10px] tracking-[.06em] uppercase text-bone/90"
                >
                  <span className={`relative w-14 h-14 grid place-items-center border ${a.tile}`}>
                    {a.icon}
                    {a.isNew && (
                      <span className="absolute -top-[7px] -right-1.5 font-mono font-bold text-[8px] tracking-[.1em] bg-bone text-night px-1">
                        NEW
                      </span>
                    )}
                  </span>
                  {a.title}
                </button>
              ))}
            </nav>
          </>
        )}

        <AnimatePresence>
          {wins.map((w, i) => (
            <Win
              key={w.id}
              id={w.id}
              z={w.z}
              idx={i}
              mobile={mobile}
              focused={focused?.id === w.id}
              focus={Object.assign(() => focusWin(w.id), { open })}
              close={() => close(w.id)}
            />
          ))}
        </AnimatePresence>

        {/* dock */}
        {powered && !mobile && (
          <nav
            aria-label="Dock"
            className="absolute bottom-[18px] left-1/2 -translate-x-1/2 z-[60] flex gap-2 p-[9px] bg-[#131210]/80 border border-white/10 backdrop-blur-md max-w-[calc(100vw-24px)]"
          >
            {tiles.map(([k, a]) => (
              <span key={k} className="flex gap-2">
                {a.gap && <span className="w-px bg-white/[.18] my-1 mx-0.5" aria-hidden />}
                <motion.button
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  onClick={() => open(k)}
                  className="group relative"
                  aria-label={a.title}
                >
                  <span className={`w-[54px] h-[54px] grid place-items-center border hover:border-gold2 ${a.tile}`}>
                    {a.icon}
                  </span>
                  {a.isNew && (
                    <span className="absolute -top-[7px] -right-1.5 font-mono font-bold text-[8px] tracking-[.1em] bg-bone text-night px-1">
                      NEW
                    </span>
                  )}
                  <span className="absolute bottom-16 left-1/2 -translate-x-1/2 label text-[10px] whitespace-nowrap bg-night border border-white/[.18] px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {a.title}
                  </span>
                  {wins.find((x) => x.id === k) && (
                    <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-gold2" />
                  )}
                </motion.button>
              </span>
            ))}
          </nav>
        )}

        <AnimatePresence>
          {!powered && <Boot now={now} onPower={power} replay={() => setTv(true)} />}
        </AnimatePresence>
        {tv && <TvSplash onDone={() => setTv(false)} />}
      </main>
    </Player.Provider>
  );
}
