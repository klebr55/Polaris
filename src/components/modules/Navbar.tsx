"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import PolarisLogo from "./PolarisLogo";

const NAV_LINKS = [
  { label: "O Choque", href: "#choque" },
  { label: "O Abismo", href: "#conectividade" },
  { label: "A Urgência", href: "#educacao" },
];

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const lastScrollY = useRef(0);
  const [visible, setVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = lastScrollY.current;
    const direction = current > previous ? "down" : "up";
    const delta = Math.abs(current - previous);

    if (delta < 5) return;

    if (current < 80) {
      setVisible(true);
      setHasScrolled(false);
    } else {
      setHasScrolled(true);
      if (direction === "down" && current > 300) {
        setVisible(false);
        setMobileOpen(false);
      } else {
        setVisible(true);
      }
    }

    lastScrollY.current = current;
  });

  useMotionValueEvent(scrollYProgress, "change", (val) => {
    setProgress(val);
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-slate-900 focus:outline-none"
      >
        Pular para o conteúdo
      </a>

      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          hasScrolled
            ? "border-b border-white/[0.04] bg-[#020617]/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl ring-1 ring-inset ring-white/[0.02]"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        >
          <a
            href="#choque"
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Polaris — voltar ao início"
          >
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md transition-all duration-300 group-hover:bg-cyan-400/35 group-hover:blur-lg" />
              <PolarisLogo className="relative z-10 h-6 w-6 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold tracking-[0.15em] text-white/90 transition-colors duration-200 group-hover:text-white">
              POLARIS
            </span>
          </a>

          <div className="hidden items-center gap-8 sm:flex" role="list">
            {NAV_LINKS.map((link, idx) => (
              <div key={link.label} className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-slate-400" role="listitem">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${progress > idx * 0.3 ? "bg-cyan-400" : "bg-slate-700"}`}
                />
                <a
                  href={link.href}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/klebr55/Polaris"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver código no GitHub (abre em nova aba)"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <button
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu de navegação"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.15] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:hidden"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {mobileOpen ? (
                  <>
                    <line x1="2" y1="2" x2="14" y2="14" />
                    <line x1="14" y1="2" x2="2" y2="14" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="4" x2="14" y2="4" />
                    <line x1="2" y1="8" x2="14" y2="8" />
                    <line x1="2" y1="12" x2="14" y2="12" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div
          aria-hidden="true"
          className="absolute left-0 bottom-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-75"
          style={{ width: `${progress * 100}%` }}
        />

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/[0.04] bg-[#020617]/95 backdrop-blur-2xl sm:hidden"
            >
              <nav aria-label="Menu mobile" className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link, idx) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.25em] text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${progress > idx * 0.3 ? "bg-cyan-400" : "bg-slate-700"}`}
                    />
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
