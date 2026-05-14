"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  children: ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="flex min-h-screen items-center px-6 py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <motion.div className="flex flex-col gap-6">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-8 -top-6 h-24 rounded-full bg-cyan-500/10 blur-3xl" />
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative z-10 text-balance text-4xl font-extrabold tracking-[-0.05em] text-transparent sm:text-5xl lg:text-6xl bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text"
            >
              Polaris transforma dados publicos em arte viva.
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl"
          >
            Uma experiencia de data storytelling que revela o crescimento
            tecnologico de Mato Grosso com rigor analitico e sensibilidade
            visual.
          </motion.p>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl border border-glass-border bg-glass px-6 py-8 shadow-glass ring-1 ring-inset ring-glass-highlight backdrop-blur-xl transition-soft hover:border-white/30 hover:bg-white/10 hover:shadow-[0_18px_50px_rgba(15,23,42,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          tabIndex={0}
        >
          <div className="pointer-events-none absolute inset-0 bg-glass-highlight opacity-55" />
          <div className="relative">{children}</div>
        </motion.figure>
      </div>
    </section>
  );
}
