"use client";

import { motion } from "framer-motion";

const SQUAD_MEMBERS = [
  { name: "Vinicius", role: "Arquiteto de Dados" },
  { name: "Kleber", role: "Engenheiro de Interface" },
  { name: "Rafael", role: "Engenheiro de Serviços" },
  { name: "Thiago", role: "Analista de Visualização" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function LegacyFooter() {
  return (
    <footer className="relative px-6 pb-24 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-cyan-950/10 to-slate-950/60" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        viewport={{ once: true, margin: "-15%" }}
        className="relative mx-auto w-full max-w-6xl"
      >
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 px-8 py-16 shadow-[0_32px_96px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 rounded-4xl bg-linear-to-br from-cyan-500/8 via-transparent to-transparent" />

          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/6 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-500/8 blur-[100px]" />

          <div className="relative flex flex-col items-center gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-linear-to-r from-transparent to-cyan-500/60" />
                <span className="text-[0.65rem] uppercase tracking-[0.6em] text-slate-500">
                  Missão concluída
                </span>
                <div className="h-px w-16 bg-linear-to-l from-transparent to-cyan-500/60" />
              </div>

              <h2 className="text-balance bg-linear-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-extrabold leading-tight tracking-[-0.04em] text-transparent sm:text-5xl lg:text-6xl">
                Polaris
              </h2>

              <p className="max-w-md text-base text-slate-400 sm:text-lg">
                Do coração de Mato Grosso para o mundo
              </p>
            </motion.div>

            <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {SQUAD_MEMBERS.map((member) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  className="group relative flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-6 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
                    <span className="text-sm font-bold text-cyan-300">
                      {member.name.charAt(0)}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <span className="text-sm font-semibold text-white">{member.name}</span>
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                    {member.role}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-linear-to-r from-transparent to-white/20" />
                <span className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-600">
                  Semana 04 · 2026
                </span>
                <div className="h-px w-8 bg-linear-to-l from-transparent to-white/20" />
              </div>
              <p className="text-[0.65rem] text-slate-700">
                Dados públicos · IBGE SIDRA · PNAD Contínua TIC
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
