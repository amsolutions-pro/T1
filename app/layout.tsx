import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import { PlausibleScript } from "@/components/PlausibleScript";
import { JsonLd } from "@/components/JsonLd";
import { getClientEnv } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "ArmenSTEM — Cours particuliers maths, physique, échecs par des profs arméniens d'élite | 25€/h",
    template: "%s | ArmenSTEM",
  },
  description:
    "Cours particuliers en visio par les profs qui forment les médaillés olympiades arméniens. Lycée et prépa. 25€/h, premier cours à 10€ remboursable.",
  keywords: [
    "cours particuliers",
    "maths",
    "physique",
    "informatique",
    "échecs",
    "prépa",
    "olympiades",
    "Arménie",
    "professeurs arméniens",
    "visio",
  ],
  authors: [{ name: "ArmenSTEM" }],
  creator: "ArmenSTEM",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ArmenSTEM",
    title:
      "ArmenSTEM — Cours particuliers maths, physique, échecs par des profs arméniens d'élite | 25€/h",
    description:
      "Cours particuliers en visio par les profs qui forment les médaillés olympiades arméniens. Lycée et prépa. 25€/h, premier cours à 10€ remboursable.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArmenSTEM — Cours particuliers d'élite par des profs arméniens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ArmenSTEM — Cours particuliers maths, physique, échecs par des profs arméniens d'élite",
    description:
      "Profs qui forment les médaillés olympiades arméniens. 25€/h. Premier cours à 10€ remboursable.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const env = getClientEnv();
  return (
    <html lang="fr" className={`${inter.variable} ${plex.variable}`}>
      <body className="font-sans">
        {/*
          JSON-LD blocks are emitted at the very top of <body>. Google
          treats application/ld+json identically wherever it appears in
          the document; rendering it here keeps it on every route.
        */}
        <JsonLd siteUrl={siteUrl} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu principal
        </a>
        {children}
        <PlausibleScript
          domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          scriptUrl={env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL}
        />
      </body>
    </html>
  );
}
