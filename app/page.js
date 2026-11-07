"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Music2,
  Newspaper,
  Pause,
  Play,
  Power,
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
} from "./apps";
import { SONGS } from "./data";

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

const APPS = {
  about: {
    title: "About",
    icon: <User size={24} />,
    tile: "bg-violet text-night",
    w: 860,
  },
  music: {
    title: "Music",
    icon: <Music2 size={24} />,
    tile: "bg-mango text-night",
    w: 760,
  },
  sites: {
    title: "Sites",
    icon: <Globe size={24} />,
    tile: "bg-bone text-night",
    w: 1040,
  },
  github: {
    title: "GitHub",
    icon: <GitHubMark />,
    tile: "bg-plum text-bone ring-1 ring-white/15",
    w: 960,
  },
  x: {
    title: "X",
    icon: <XMark />,
    tile: "bg-black text-bone ring-1 ring-white/15",
    w: 640,
  },
  empowertours: {
    title: "EmpowerTours",
    icon: <Sprout size={24} />,
    tile: "bg-[#3E7C4F] text-bone",
    w: 820,
  },
  notes: { title: "Notes", icon: <StickyNote size={24} />, tile: "bg-[#F6D27A] text-night", w: 820 },
  updates: {
    title: "Updates",
    icon: <Newspaper size={24} />,
    tile: "bg-[#5B3B8C] text-bone",
    w: 720,
  },
};
const render = (id, open) =>
  ({
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
  "bg-white/[.045]",
  "bg-violet/25",
  "bg-violet/45",
  "bg-violet/75",
  "bg-mango",
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(131,110,249,.22),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(242,165,65,.10),transparent_50%)]" />
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
                className={`block w-[30px] h-[30px] rounded-[6px] ${x.date.startsWith("pad") ? "opacity-0" : TILE[x.level]} ${gh ? "cell-on" : ""} ${x.date === last ? "cell-today bg-mango" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- power-on screen ---------- */

function PowerOn({ onPower, now }) {
  const [on, setOn] = useState(false);
  const flip = (app) => {
    setOn(true);
    setTimeout(() => onPower(app), 380);
  };
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/50 to-night/10" />
      <div className="relative flex justify-between px-6 sm:px-10 pt-6 text-sm text-mist">
        <span>earvingallardo.com</span>
        <span className="tabular-nums">{now ? hhmm(now) : ""}</span>
      </div>
      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-10 max-w-6xl">
        <h1 className="font-display font-bold tracking-[-0.04em] leading-[.86] text-[clamp(64px,13vw,190px)]">
          Earvin
          <br />
          Gallardo
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-bone/85 max-w-[34ch]">
          Music artist, developer and founder. Marine Corps veteran.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <button
            onClick={() => flip()}
            role="switch"
            aria-checked={on}
            className="group flex items-center gap-4 rounded-full bg-white/[.06] hover:bg-white/[.1] border border-white/10 pl-2 pr-6 py-2"
          >
            <span
              className={`relative w-[74px] h-[40px] rounded-full transition-colors duration-300 ${on ? "bg-mango" : "bg-plum"}`}
            >
              <span
                className={`absolute top-1 w-8 h-8 rounded-full bg-bone grid place-items-center text-night shadow-lg transition-all duration-300 ${on ? "left-[38px]" : "left-1"}`}
              >
                <Power size={16} />
              </span>
            </span>
            <span className="font-display text-lg font-semibold">Power on</span>
          </button>
          <div className="flex flex-wrap gap-2">
            {["music", "sites", "github", "about", "notes"].map((k) => (
              <button
                key={k}
                onClick={() => flip(k)}
                className="rounded-full px-4 py-2 text-sm bg-white/[.04] hover:bg-white/[.1] border border-white/10"
              >
                {k === "music"
                  ? "Play my music"
                  : k === "sites"
                    ? "See what I've built"
                    : k === "github"
                      ? "What I'm coding"
                      : k === "about" ? "About me" : "Leave a note"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="relative px-6 sm:px-10 pb-6 text-sm text-mist max-w-[60ch]">
        The tiles behind this are my last year of commits. Each one is a day.
      </p>
    </motion.div>
  );
}

/* ---------- window ---------- */

function Win({ id, z, idx, mobile, focused, focus, close }) {
  const a = APPS[id];
  const [max, setMax] = useState(false);
  const W = a.w;
  const box = max
    ? { left: 16, right: 16, top: 52, bottom: 112 }
    : {
        width: `min(${W}px, calc(100vw - 48px))`,
        height: "min(80vh, 900px)",
        left: `max(24px, calc(50% - ${W / 2}px + ${idx * 26}px))`,
        top: `calc(56px + ${idx * 22}px)`,
      };
  return (
    <motion.section
      aria-label={a.title}
      drag={!mobile && !max}
      dragMomentum={false}
      onPointerDown={focus}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className={`${mobile ? "fixed inset-x-0 bottom-0 top-12 rounded-t-3xl" : "absolute rounded-3xl"} pane flex flex-col overflow-hidden ${focused ? "shadow-[0_40px_120px_-30px_rgba(0,0,0,.85)]" : "shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)]"}`}
      style={mobile ? { zIndex: z } : { zIndex: z, ...box }}
    >
      <header
        onDoubleClick={() => !mobile && setMax((m) => !m)}
        className="flex items-center gap-3 px-5 h-12 shrink-0 cursor-grab active:cursor-grabbing select-none border-b border-white/[.06]"
      >
        {!mobile && (
          <div className="flex gap-2">
            <button
              onClick={close}
              aria-label={`Close ${a.title}`}
              className="w-3.5 h-3.5 rounded-full bg-mango hover:brightness-110"
            />
            <button
              onClick={close}
              aria-label={`Minimise ${a.title}`}
              className="w-3.5 h-3.5 rounded-full bg-mist/50 hover:bg-mist"
            />
            <button
              onClick={() => setMax((m) => !m)}
              aria-label={max ? "Restore window" : "Maximise window"}
              className="w-3.5 h-3.5 rounded-full bg-violet hover:brightness-110"
            />
          </div>
        )}
        <span
          className={`font-display font-semibold ${mobile ? "text-lg" : "flex-1 text-center -ml-16 text-[15px] text-bone/80"}`}
        >
          {a.title}
        </span>
        {mobile && (
          <button
            onClick={close}
            className="ml-auto rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold"
          >
            Done
          </button>
        )}
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8">
        {render(id, focus.open)}
      </div>
    </motion.section>
  );
}

/* ---------- the OS ---------- */

export default function Page() {
  const now = useNow();
  const [powered, setPowered] = useState(false);
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
    const q = new URLSearchParams(location.search).get("open");
    if (q && APPS[q]) {
      setPowered(true);
      setWins([{ id: q, z: 11 }]);
    }
    return () => window.removeEventListener("resize", f);
  }, []);

  const power = (app) => {
    setPowered(true);
    if (app) setTimeout(() => open(app), 350);
  };
  const focused = wins.reduce((a, b) => (!a || b.z > a.z ? b : a), null);

  return (
    <Player.Provider value={player}>
      <main className="fixed inset-0 overflow-hidden bg-night">
        <audio ref={audio} src={SONGS[0].au} preload="none" onEnded={next} />
        <Ribbon dim={wins.length > 0} />

        {/* menu bar */}
        {powered && (<div className="bar relative z-40 h-11 flex items-center gap-3 px-3 sm:px-4 text-sm border-b border-white/[.06]">
          <button
            onClick={() => {
              setWins([]);
              setPowered(false);
            }}
            title="Power off"
            className="font-display font-bold tracking-tight rounded-lg px-2 py-1 hover:bg-white/10"
          >
            EG
          </button>
          <span className="hidden sm:inline font-display font-semibold text-bone/80">
            {focused ? APPS[focused.id].title : "Earvin Gallardo"}
          </span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2 min-w-0">
            <button
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play Unify34"}
              className="w-8 h-8 grid place-items-center rounded-full bg-mango text-night shrink-0"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={() => open("music")}
              className="min-w-0 text-left px-1 hover:text-mango"
            >
              <span className="block truncate max-w-[34vw] sm:max-w-[240px]">
                <span className="font-semibold">{SONGS[idx].n}</span>
                <span className="text-mist"> by {SONGS[idx].a}</span>
              </span>
            </button>
            <button
              onClick={next}
              aria-label="Next track"
              className="hidden sm:grid w-8 h-8 place-items-center rounded-full hover:bg-white/10 shrink-0"
            >
              <SkipForward size={14} />
            </button>
            <span className="tabular-nums text-bone/80 pl-2 sm:pl-3 shrink-0">
              {now ? hhmm(now) : ""}
            </span>
          </div>
        </div>)}

        {/* desktop: name and app icons */}
        {powered && (
          <>
            <div className="absolute left-6 sm:left-10 bottom-32 sm:bottom-36 z-0 pointer-events-none">
              <p className="font-display font-bold tracking-[-0.04em] leading-[.86] text-[clamp(44px,7vw,110px)] text-bone/95">
                Earvin
                <br />
                Gallardo
              </p>
              <p className="mt-3 text-mist text-lg">
                Music artist, developer and founder.
              </p>
            </div>
            <nav
              aria-label="Apps"
              className="sm:hidden absolute z-10 top-16 left-4 right-4 grid grid-cols-4 gap-x-3 gap-y-4"
            >
              {Object.entries(APPS).map(([k, a]) => (
                <button
                  key={k}
                  onClick={() => open(k)}
                  className="flex flex-col items-center gap-1.5 text-xs text-bone/90 group"
                >
                  <span
                    className={`w-14 h-14 rounded-2xl grid place-items-center shadow-lg transition-transform group-hover:-translate-y-0.5 ${a.tile}`}
                  >
                    {a.icon}
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[60] bar rounded-[26px] border border-white/10 px-2.5 py-2.5 flex gap-2.5">
            {Object.entries(APPS).map(([k, a]) => (
              <motion.button
                key={k}
                whileHover={{ y: -10, scale: 1.12 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                onClick={() => open(k)}
                title={a.title}
                className="relative"
              >
                <span
                  className={`w-14 h-14 rounded-2xl grid place-items-center ${a.tile}`}
                >
                  {a.icon}
                </span>
                {wins.find((x) => x.id === k) && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mango" />
                )}
              </motion.button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {!powered && <PowerOn now={now} onPower={power} />}
        </AnimatePresence>
      </main>
    </Player.Provider>
  );
}
