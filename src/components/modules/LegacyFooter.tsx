"use client";

import { motion, type Variants } from "framer-motion";
import PolarisLogo from "./PolarisLogo";

const SQUAD_MEMBERS = [
  { name: "Kleber Vinicius", role: "Tech Lead & Software Engineer" },
  { name: "Luiz Fernando", role: "Product/Data" },
  { name: "Thor Ribeiro", role: "UX/Storytelling" },
  { name: "Thaiane Vitoria", role: "Documentation" },
  { name: "Kelmy Adriano", role: "QA Analyst" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function LegacyFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#020617] to-[#020617]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-cyan-900/[0.06] blur-[150px]" />
        <div className="absolute -right-20 bottom-20 h-[400px] w-[400px] rounded-full bg-blue-900/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          />

          <span className="text-[0.6rem] font-medium uppercase tracking-[0.7em] text-cyan-500/70">
            Missao concluida
          </span>

          <div className="flex items-center justify-center gap-4">
            <PolarisLogo className="h-12 w-12 text-cyan-400" />
            <h2 className="font-display bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-5xl font-extrabold leading-none tracking-tighter text-transparent sm:text-6xl lg:text-7xl">
              Polaris
            </h2>
          </div>

          <p className="max-w-sm text-base leading-relaxed text-slate-500 sm:text-lg">
            Do coracao de Mato Grosso para o mundo.
          </p>
        </motion.div>

        <div className="mx-auto my-14 h-px w-full max-w-md bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {SQUAD_MEMBERS.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-7 text-center"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/[0.04] to-transparent" />
                <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <div className="absolute inset-0 rounded-2xl border border-cyan-400/20" />
                <div className="absolute inset-0 rounded-2xl bg-white/[0.03]" />
              </div>

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/[0.12] group-hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]">
                <span className="text-sm font-bold text-cyan-400/80 transition-colors duration-300 group-hover:text-cyan-300">
                  {member.name.charAt(0)}
                </span>
              </div>

              <div className="relative flex flex-col items-center gap-1">
                <span className="text-sm font-semibold text-slate-200 transition-all duration-300 group-hover:text-white group-hover:[text-shadow:0_0_20px_rgba(34,211,238,0.3)]">
                  {member.name}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-600 transition-colors duration-300 group-hover:text-slate-400">
                  {member.role}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[0.55rem] uppercase tracking-[0.6em] text-slate-500">
              Semana 04 · 2026
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <p className="text-[0.6rem] tracking-wider text-slate-500">
            Dados publicos · IBGE SIDRA · PNAD Continua TIC
          </p>

          <div className="mt-2 flex h-5 w-5 items-center justify-center opacity-30">
            <PolarisLogo className="h-4 w-4 text-cyan-500" animate={false} />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
