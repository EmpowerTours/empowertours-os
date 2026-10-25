"use client";
import {useEffect,useRef,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";

const SITE="https://earvingallardo.com";
const fmtTime=d=>d.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
const fmtDate=d=>d.toLocaleDateString([], {weekday:"long",month:"long",day:"numeric"});

function useNow(){const [n,setN]=useState(null);useEffect(()=>{setN(new Date());const t=setInterval(()=>setN(new Date()),1000);return()=>clearInterval(t)},[]);return n}

const Icon=({g,label})=>(<div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl grid place-items-center text-xl shadow-lg ${g}`} aria-label={label}>{label}</div>);

const APPS={
 tours:{title:"Tours",emoji:"⛰️",g:"bg-gradient-to-br from-blue-500 to-violet-600"},
 music:{title:"Music & Videos",emoji:"🎧",g:"bg-gradient-to-br from-fuchsia-500 to-violet-700"},
 blog:{title:"Blog",emoji:"📝",g:"bg-gradient-to-br from-amber-400 to-orange-500"},
 shop:{title:"Shop",emoji:"🛍️",g:"bg-gradient-to-br from-emerald-400 to-teal-600"},
 schedule:{title:"Scheduling",emoji:"📅",g:"bg-gradient-to-br from-sky-400 to-blue-600"},
 about:{title:"About",emoji:"🧗",g:"bg-gradient-to-br from-indigo-400 to-purple-600"},
 notes:{title:"Leave a note",emoji:"✍️",g:"bg-gradient-to-br from-yellow-300 to-yellow-500"},
};

const NOTIFS=[
 {app:"music",t:"New song out now",b:"“Oyasumi” music video draft just dropped. Tap to watch.",ago:"now"},
 {app:"tours",t:"Next climbing tour",b:"Web3-powered rock climbing adventure — dates coming soon.",ago:"12m ago"},
 {app:"shop",t:"Shop drop",b:"New EmpowerTours gear is live in the shop.",ago:"1h ago"},
 {app:"blog",t:"Latest blog post",b:"Money Making Machine – Artist: Earvin Gallardo",ago:"3h ago"},
];

function Lock({onUnlock,now}){
 return(<motion.div className="fixed inset-0 z-[100] flex flex-col items-center select-none" initial={{y:0}} exit={{y:"-100%",transition:{duration:.55,ease:[.7,0,.3,1]}}}
  drag="y" dragConstraints={{top:0,bottom:0}} dragElastic={{top:.6,bottom:0}} onDragEnd={(e,i)=>{if(i.offset.y<-80||i.velocity.y<-400)onUnlock()}}>
  <div className="absolute inset-0 bg-cover bg-center scale-110 blur-md brightness-[.45]" style={{backgroundImage:"url(/hero.jpg)"}}/>
  <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/80"/>
  <div className="relative mt-16 sm:mt-14 text-center">
   <p className="text-base sm:text-lg font-medium opacity-90">{now?fmtDate(now):"\u00a0"}</p>
   <p className="text-7xl sm:text-8xl font-semibold tracking-tight">{now?fmtTime(now):"\u00a0"}</p>
   <p className="mt-2 text-xs uppercase tracking-[.3em] text-violet-200/80">EmpowerTours</p>
  </div>
  <div className="relative mt-auto mb-6 w-[92%] max-w-md space-y-2">
   {NOTIFS.map((n,i)=>(<motion.button key={i} onClick={()=>onUnlock(n.app)} initial={{y:12}} animate={{y:0,transition:{delay:.1+i*.08}}}
     className="glass bg-[#2c2c2f]/70 w-full rounded-2xl p-3 flex gap-3 text-left hover:bg-white/10 transition">
     <div className={`w-9 h-9 shrink-0 rounded-lg grid place-items-center ${APPS[n.app].g}`}>{APPS[n.app].emoji}</div>
     <div className="min-w-0 flex-1"><div className="flex justify-between text-sm"><b className="truncate">{n.t}</b><span className="text-xs text-white/50 ml-2">{n.ago}</span></div>
     <p className="text-[13px] text-white/80 leading-snug">{n.b}</p></div></motion.button>))}
   <button onClick={()=>onUnlock()} className="w-full pt-3 text-xs text-white/70 flex flex-col items-center gap-1">
    <motion.span animate={{y:[0,-6,0]}} transition={{repeat:Infinity,duration:1.6}}>⌃</motion.span>Swipe up or tap to unlock</button>
  </div></motion.div>)
}

function Tours(){return(<div className="space-y-3">
 <img src="/hero.jpg" alt="EmpowerTours climber on a neon mountain" className="w-full rounded-xl"/>
 <h2 className="text-xl font-bold">Web3-Powered Rock Climbing Adventures</h2>
 <p className="text-white/75 text-sm">Guided climbing trips that blend the outdoors with Web3 — earn on-chain proof of every summit, connect with a community of climbers, and unlock perks along the way.</p>
 <div className="rounded-xl bg-white/5 p-3 text-sm"><b>Next tour:</b> <span className="text-amber-300">[Placeholder — date & location TBA]</span></div>
 <a href={`${SITE}/empowertours`} target="_blank" className="inline-block rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold">Learn more ↗</a></div>)}
function Music(){return(<div className="space-y-3">
 <video src="/oyasumi.mp4" controls playsInline className="w-full max-h-[55vh] rounded-xl bg-black"/>
 <p className="text-sm text-white/70">Sample: “Oyasumi” music video (draft)</p>
 <h3 className="font-semibold pt-2">Songs <span className="text-xs text-amber-300">(placeholder list)</span></h3>
 <ul className="divide-y divide-white/10 text-sm">{["Oyasumi","Money Making Machine","[Song title TBA]","[Song title TBA]"].map((s,i)=>(<li key={i} className="py-2 flex justify-between"><span>{i+1}. {s}</span><span className="text-white/40">–:––</span></li>))}</ul></div>)}
function Blog(){return(<div className="space-y-3"><p className="text-xs text-white/50">Latest post</p>
 <h2 className="text-xl font-bold">Money Making Machine – Artist: Earvin Gallardo</h2>
 <p className="text-sm text-white/75">A new track from Earvin Gallardo. <span className="text-amber-300">[Placeholder summary — post body to be added]</span></p>
 <a href={SITE} target="_blank" className="text-violet-300 text-sm">Read on earvingallardo.com ↗</a></div>)}
const LinkOut=({path,text,cta})=>(<div className="space-y-3 text-sm"><p className="text-white/75">{text}</p>
 <a href={`${SITE}${path}`} target="_blank" className="inline-block rounded-full bg-violet-600 px-4 py-2 font-semibold">{cta} ↗</a></div>);
function About(){return(<div className="space-y-3 text-sm"><div className="flex items-center gap-3"><img src="/hero.jpg" alt="" className="w-14 h-14 rounded-full object-cover"/><div><b className="text-lg">Earvin Gallardo</b><p className="text-white/60">Artist · Founder of EmpowerTours</p></div></div>
 <p className="text-white/75">EmpowerTours brings together rock climbing, music and Web3. <span className="text-amber-300">[Placeholder bio — replace with your own words]</span></p>
 <a href={`${SITE}/about`} target="_blank" className="text-violet-300">Full About page ↗</a></div>)}
function Notes(){const [list,setList]=useState([]);const [name,setName]=useState("");const [msg,setMsg]=useState("");
 useEffect(()=>{try{setList(JSON.parse(localStorage.getItem("et-notes")||"[]"))}catch{}},[]);
 const add=e=>{e.preventDefault();if(!msg.trim())return;const n=[{name:name.trim()||"Anonymous",msg:msg.trim(),at:Date.now()},...list];setList(n);localStorage.setItem("et-notes",JSON.stringify(n));setMsg("")};
 return(<div className="space-y-3 text-sm"><form onSubmit={add} className="space-y-2">
  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none"/>
  <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Leave a note…" rows={3} className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none"/>
  <button className="rounded-full bg-yellow-400 text-black px-4 py-1.5 font-semibold">Post note</button>
  <p className="text-xs text-white/40">Preview only: notes are saved in this browser.</p></form>
  {list.map(n=>(<div key={n.at} className="rounded-xl bg-yellow-200/90 text-black p-3"><p>{n.msg}</p><p className="text-xs opacity-60 mt-1">— {n.name}</p></div>))}</div>)}

const CONTENT={tours:<Tours/>,music:<Music/>,blog:<Blog/>,about:<About/>,notes:<Notes/>,
 shop:<LinkOut path="/shop" text="Gear, merch and tour passes are sold through the existing EmpowerTours shop." cta="Open the shop"/>,
 schedule:<LinkOut path="/scheduling" text="Book a climbing session or a call using the existing scheduling page." cta="Book a time"/>};

function Win({id,z,focus,close,idx,mobile}){const a=APPS[id];
 return(<motion.div drag={!mobile} dragMomentum={false} dragListener={!mobile} onPointerDown={focus} style={{zIndex:z}}
  initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.9}}
  className={mobile?"fixed inset-x-2 top-9 bottom-24 glass rounded-2xl flex flex-col overflow-hidden":"absolute glass rounded-xl shadow-2xl w-[460px] max-h-[72vh] flex flex-col overflow-hidden"}
  {...(!mobile&&{style:{zIndex:z,left:120+idx*40,top:60+idx*30}})}>
  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 cursor-grab active:cursor-grabbing">
   <button onClick={close} className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-label="Close"/><span className="w-3 h-3 rounded-full bg-[#febc2e]"/><span className="w-3 h-3 rounded-full bg-[#28c840]"/>
   <span className="flex-1 text-center text-xs font-medium text-white/70 -ml-12">{a.title}</span>
   {mobile&&<button onClick={close} className="text-xs text-violet-300">Done</button>}</div>
  <div className="p-4 overflow-y-auto">{CONTENT[id]}</div></motion.div>)}

export default function Page(){
 const now=useNow();const [locked,setLocked]=useState(true);const [wins,setWins]=useState([]);const [top,setTop]=useState(10);const [mobile,setMobile]=useState(false);
 useEffect(()=>{const f=()=>setMobile(window.innerWidth<640);f();window.addEventListener("resize",f);
   if(new URLSearchParams(location.search).get("open")){setLocked(false);setWins([{id:new URLSearchParams(location.search).get("open"),z:11}])}
   return()=>window.removeEventListener("resize",f)},[]);
 const open=id=>{setTop(t=>t+1);setWins(w=>w.find(x=>x.id===id)?w.map(x=>x.id===id?{...x,z:top+1}:x):[...w,{id,z:top+1}])};
 const unlock=id=>{setLocked(false);if(id)setTimeout(()=>open(id),450)};
 return(<main className="fixed inset-0 overflow-hidden">
  <div className="absolute inset-0 wall"/>
  <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110 mix-blend-screen" style={{backgroundImage:"url(/hero.jpg)"}}/>
  {/* menu bar */}
  <div className="relative z-40 h-7 glass !border-x-0 !border-t-0 flex items-center px-3 text-[13px] gap-4">
   <b>⛰ EmpowerTours</b><span className="hidden sm:inline text-white/70">File</span><span className="hidden sm:inline text-white/70">View</span><span className="hidden sm:inline text-white/70">Go</span><span className="hidden sm:inline text-white/70">Help</span>
   <span className="ml-auto text-white/80">{now?`${now.toLocaleDateString([], {weekday:"short",month:"short",day:"numeric"})}  ${fmtTime(now)}`:""}</span>
   <button onClick={()=>{setWins([]);setLocked(true)}} className="text-white/60" title="Lock">🔒</button></div>
  {/* desktop icons */}
  <div className="relative z-10 p-4 sm:p-6 grid grid-cols-4 sm:grid-cols-1 gap-4 sm:w-24">
   {Object.entries(APPS).map(([k,a])=>(<button key={k} onDoubleClick={()=>open(k)} onClick={()=>mobile&&open(k)} className="flex flex-col items-center gap-1 text-[11px] text-white/90">
    <Icon g={a.g} label={a.emoji}/>{a.title}</button>))}</div>
  <div className="hidden sm:block absolute right-8 top-14 text-right z-0"><p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">EmpowerTours</p><p className="text-white/60">Web3-Powered Rock Climbing Adventures</p><p className="text-xs text-white/40 mt-1">Double-click an icon or use the dock</p></div>
  <AnimatePresence>{wins.map((w,i)=>(<Win key={w.id} id={w.id} z={w.z} idx={i} mobile={mobile} focus={()=>{setTop(t=>t+1);setWins(ws=>ws.map(x=>x.id===w.id?{...x,z:top+1}:x))}} close={()=>setWins(ws=>ws.filter(x=>x.id!==w.id))}/>))}</AnimatePresence>
  {/* dock */}
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[60] glass rounded-2xl px-2 py-2 flex gap-1.5 sm:gap-2 max-w-[96vw] overflow-x-auto">
   {Object.entries(APPS).map(([k,a])=>(<motion.button key={k} whileHover={{y:-8,scale:1.15}} onClick={()=>open(k)} title={a.title} className="relative">
    <Icon g={a.g} label={a.emoji}/>{wins.find(w=>w.id===k)&&<span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80"/>}</motion.button>))}</div>
  <AnimatePresence>{locked&&<Lock now={now} onUnlock={unlock}/>}</AnimatePresence>
 </main>)}
