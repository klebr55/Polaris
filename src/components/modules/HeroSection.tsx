"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PandemicStatsBar from "./PandemicStatsBar";
import SplitTextReveal from "./SplitTextReveal";

interface HeroSectionProps {
  children: ReactNode;
}

const HEADLINE_LINES = [
  { text: "Quando as portas", gradient: "from-white via-slate-100 to-slate-400", glow: false },
  { text: "se fecharam,", gradient: "from-cyan-300 via-cyan-400 to-blue-400", glow: true },
  { text: "a tela abriu o mundo.", gradient: "from-slate-200 to-slate-500", glow: false },
];

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
      id="choque"
      ref={sectionRef}
      className="relative flex min-h-[110vh] items-center px-6 py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/[0.05] blur-[100px]" />
        <div className="absolute -left-40 bottom-1/4 h-[350px] w-[350px] rounded-full bg-indigo-500/[0.04] blur-[100px]" />
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-20"
      >
        <div className="flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <span className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.45em] text-cyan-400/80">
              Março de 2020 &mdash; O Catalisador &nbsp;·&nbsp; PNAD TIC / Mato Grosso
            </span>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-12 -top-10 h-32 rounded-full bg-cyan-400/[0.05] blur-[80px]" />
            <h1 className="font-display relative z-10 max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl">
              {HEADLINE_LINES.map((line, i) => (
                <span key={line.text} className="block">
                  <SplitTextReveal
                    text={line.text}
                    delay={i * 0.12}
                    className={`bg-gradient-to-b bg-clip-text text-transparent ${line.gradient} ${line.glow ? "text-glow-cyan" : ""}`}
                  />
                </span>
              ))}
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
            className="max-w-lg text-lg leading-relaxed text-slate-400 sm:text-xl"
          >
            Em 60 dias, a internet deixou de ser conveniência.
            Tornou-se escola, escritório, consulta médica.
            A pandemia não criou a demanda —{" "}
            <span className="text-slate-300">tornou impossível ignorá-la.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
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
            <span className="uppercase tracking-widest">Role para explorar</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <PandemicStatsBar />
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="polaris-card group relative overflow-hidden px-6 py-8 ring-1 ring-inset ring-white/[0.04] hover:shadow-[0_20px_80px_rgba(8,145,178,0.18)] hover:border-white/[0.18]"
          tabIndex={0}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-blue-500/[0.02]" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-white/[0.03] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-cyan-400/[0.12] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.08)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
          <div className="relative">{children}</div>
        </motion.figure>
      </motion.div>
    </section>
  );
}
