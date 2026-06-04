import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "../components/modules/Navbar";
import SmoothScroller from "../components/modules/SmoothScroller";
import CustomCursor from "../components/modules/CustomCursor";
import "../styles/globals.css";

const siteUrl = "https://projectpolaris-unic.vercel.app";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Polaris — O Abismo Digital em Mato Grosso",
    template: "%s | Polaris",
  },

  description:
    "Explore uma experiência interativa baseada em dados públicos do IBGE que revela o abismo digital entre áreas urbanas e rurais em Mato Grosso durante a pandemia.",

  applicationName: "Polaris",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  keywords: [
    "Polaris",
    "IBGE",
    "PNAD TIC",
    "Mato Grosso",
    "internet em Mato Grosso",
    "abismo digital",
    "desigualdade digital",
    "dados públicos",
    "conectividade rural",
    "conectividade urbana",
    "COVID-19",
    "visualização de dados",
    "data storytelling",
    "scrollytelling",
  ],

  authors: [
    { name: "Kleber Vinícius" },
    { name: "Luiz Fernando" },
    { name: "Thor Ribeiro" },
    { name: "Thaiane Vitoria" },
    { name: "Kelmy Adriano" },
  ],

  creator: "Equipe Polaris",
  publisher: "Polaris",

  category: "Data Visualization",

  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },

  openGraph: {
    title: "Polaris — O Abismo Digital em Mato Grosso",
    description:
      "Uma experiência interativa baseada em dados públicos do IBGE que revela como a pandemia escancarou a desigualdade digital entre áreas urbanas e rurais em Mato Grosso.",
    url: siteUrl,
    siteName: "Polaris",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Polaris — Nem todos atravessaram a pandemia da mesma forma.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Polaris — O Abismo Digital em Mato Grosso",
    description:
      "Explore uma narrativa visual sobre conectividade, exclusão digital e os impactos da pandemia em Mato Grosso.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`h-full ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#020617] font-body text-slate-100 antialiased">
        <CustomCursor />
        <SmoothScroller />

        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(15,23,42,0.8),rgba(2,6,23,1))]" />
            <div className="stars stars-1" />
            <div className="stars stars-2" />
            <div className="stars stars-3" />
            <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
            <div className="scan-line" />
          </div>

          <Navbar />

          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}