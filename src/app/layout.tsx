import type { ReactNode } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "../components/modules/Navbar";
import SmoothScroller from "../components/modules/SmoothScroller";
import CustomCursor from "../components/modules/CustomCursor";
import "../styles/globals.css";

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

export const metadata = {
  title: "Polaris — Data Storytelling de Mato Grosso",
  description:
    "Uma experiência cinematográfica de dados públicos que revela o salto tecnológico de Mato Grosso através da PNAD TIC do IBGE.",
  keywords: ["IBGE", "PNAD TIC", "Mato Grosso", "internet", "dados públicos", "conectividade"],
  openGraph: {
    title: "Polaris — Data Storytelling de Mato Grosso",
    description:
      "Uma experiência cinematográfica de dados públicos que revela o salto tecnológico de Mato Grosso.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`h-full ${spaceGrotesk.variable} ${inter.variable}`}>
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
          <div className="relative z-10 min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}