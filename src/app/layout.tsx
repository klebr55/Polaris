import type { ReactNode } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-screen bg-[#020617] font-sans text-slate-100 antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_circle_at_50%_20%,#0f172a_0%,rgba(2,6,23,0.9)_55%,#020617_100%)]" />
          <div className="relative z-10 min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}