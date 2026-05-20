"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const [visible, setVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

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
      setVisible(direction === "up");
    }

    lastScrollY.current = current;
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        hasScrolled
          ? "border-b border-white/[0.06] bg-[#020617]/60 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="group flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md transition-all duration-300 group-hover:bg-cyan-400/30 group-hover:blur-lg" />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="relative z-10"
            >
              <path
                d="M10 2L12.09 7.26L18 8.27L13.82 12.14L14.94 18L10 15.27L5.06 18L6.18 12.14L2 8.27L7.91 7.26L10 2Z"
                fill="url(#star-gradient)"
                stroke="rgba(34,211,238,0.4)"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="star-gradient" x1="10" y1="2" x2="10" y2="18">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-[0.15em] text-white/90 transition-colors duration-200 group-hover:text-white">
            POLARIS
          </span>
        </a>

        <div className="hidden items-center gap-8 sm:flex">
          {[
            { label: "Inicio", href: "#" },
            { label: "Conectividade", href: "#conectividade" },
            { label: "Educacao", href: "#educacao" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-xs font-medium uppercase tracking-[0.25em] text-slate-400 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-transparent after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/klebr55/Polaris"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
