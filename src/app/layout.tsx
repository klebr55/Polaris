import type { ReactNode } from "react";
import Navbar from "../components/modules/Navbar";
import SmoothScroller from "../components/modules/SmoothScroller";
import "../styles/globals.css";

export const metadata = {
  title: "Polaris — Data Storytelling de Mato Grosso",
  description:
    "Uma experiencia cinematografica de dados publicos que revela o salto tecnologico de Mato Grosso atraves da PNAD TIC do IBGE.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-screen bg-[#020617] font-sans text-slate-100 antialiased">
        <SmoothScroller />
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(15,23,42,0.8),rgba(2,6,23,1))]" />
            <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
          </div>
          <Navbar />
          <div className="relative z-10 min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}