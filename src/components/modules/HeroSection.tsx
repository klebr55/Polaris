"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  children: ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.55, 0.95], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.55, 0.95], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0.55, 0.95], [0, 60]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[110vh] items-center px-6 py-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/[0.05] blur-[100px]" />
        <div className="absolute -left-40 bottom-1/4 h-[350px] w-[350px] rounded-full bg-indigo-500/[0.04] blur-[100px]" />
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14"
      >
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-cyan-400/80">
              PNAD TIC &mdash; Mato Grosso
            </span>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-12 -top-10 h-32 rounded-full bg-cyan-400/[0.06] blur-[80px]" />
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Polaris transforma
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                dados publicos
              </span>
              <br />
              <span className="bg-gradient-to-b from-slate-200 to-slate-500 bg-clip-text text-transparent">
                em arte viva.
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl"
          >
            Uma experiencia de data storytelling que revela o crescimento
            tecnologico de Mato Grosso com rigor analitico e sensibilidade
            visual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex items-center gap-3 text-sm text-slate-500"
          >
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              className="animate-bounce"
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor" />
            </svg>
            <span className="tracking-widest uppercase">Role para explorar</span>
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-8 shadow-[0_8px_60px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-[0_20px_70px_rgba(8,145,178,0.12)]"
          tabIndex={0}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-blue-500/[0.02]" />
          <div className="relative">{children}</div>
        </motion.figure>
      </motion.div>
    </section>
  );
}
