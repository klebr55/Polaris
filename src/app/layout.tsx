import type { ReactNode } from "react";
import "../styles/globals.css";

const noiseUrl =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.35'/></svg>";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-screen bg-navy-950 font-sans text-slate-100 antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_-10%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(900px_circle_at_100%_0%,rgba(14,116,144,0.12),transparent_55%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light"
            style={{ backgroundImage: `url("${noiseUrl}")` }}
          />
          <div className="relative z-10 min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}
