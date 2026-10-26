import "./globals.css";import {Inter} from "next/font/google";
const inter=Inter({subsets:["latin"],variable:"--font-inter"});
export const metadata={title:"Earvin Gallardo",description:"Earvin Gallardo — artist, builder and founder of EmpowerTours."};
export const viewport={width:"device-width",initialScale:1,themeColor:"#161618"};
export default function L({children}){return <html lang="en" className={inter.variable}><body className="font-sans antialiased">{children}</body></html>}
