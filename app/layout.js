import "./globals.css";import {Bricolage_Grotesque,Instrument_Sans} from "next/font/google";
const display=Bricolage_Grotesque({subsets:["latin"],variable:"--font-display",display:"swap"});
const body=Instrument_Sans({subsets:["latin"],variable:"--font-body",display:"swap"});
const DESC="Earvin Gallardo: music artist (Unify34), developer and founder of EmpowerTours. US Marine Corps veteran.";
export const metadata={metadataBase:new URL("https://earvingallardo.com"),title:"Earvin Gallardo",description:DESC,openGraph:{title:"Earvin Gallardo",description:DESC,url:"https://earvingallardo.com",images:["/hero.jpg"]},twitter:{card:"summary_large_image"},icons:{icon:[{url:"/favicon-32.png",sizes:"32x32",type:"image/png"},{url:"/favicon-48.png",sizes:"48x48",type:"image/png"}],apple:[{url:"/apple-touch-icon.png",sizes:"180x180"}]}};
export const viewport={width:"device-width",initialScale:1,themeColor:"#160B26"};
export default function L({children}){return <html lang="en" className={`${display.variable} ${body.variable}`}><body className="font-sans antialiased">{children}</body></html>}
