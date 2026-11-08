import "./globals.css";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { LINKS } from "./data";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const SITE = "https://earvingallardo.com";
const DESC =
  "Earvin Gallardo: music artist (Unify34), developer and founder of EmpowerTours. US Marine Corps veteran.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Earvin Gallardo",
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Earvin Gallardo",
    description: DESC,
    url: SITE,
    images: ["/hero.jpg"],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0908",
};

// schema.org Person, so search engines can show a proper profile result.
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Earvin Gallardo",
  alternateName: "Unify34",
  url: SITE,
  image: `${SITE}/hero.jpg`,
  description: DESC,
  jobTitle: "Music artist, developer and founder",
  worksFor: {
    "@type": "Organization",
    name: "EmpowerTours",
    url: "https://empowertours.xyz",
  },
  sameAs: [LINKS.linkedin, LINKS.github, LINKS.x, LINKS.art],
};

export default function L({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }}
        />
        {children}
        {/* Cloudflare Web Analytics: cookieless page-view counts. The token is public by design. */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "ce3de90b8be745afbb0e5fc105d9b35a"}'
        />
      </body>
    </html>
  );
}
