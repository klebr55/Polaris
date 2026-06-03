"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchPandemicImpact } from "../../services/sidra/pandemicImpactAdapter";
import type { CleanPandemicImpact } from "../../types/pandemicImpact";

const MatoGrossoMap = dynamic(() => import("./MatoGrossoMap"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full animate-pulse rounded-3xl bg-white/[0.02]" /> 
});

export default function EpilogueSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [60, 0]);

  const [impactData, setImpactData] = useState<CleanPandemicImpact | null>(null);

  useEffect(() => {
    fetchPandemicImpact().then(setImpactData);
  }, []);

  const stats = impactData ? [
    { label: "Crescimento Rural (2019-23)", value: `+${impactData.resumo.deltaRuralPandemia.toFixed(1)}%`, color: "cyan" },
    { label: "Gap Pós-Pandemia (Urb x Rur)", value: `${impactData.resumo.gapUrbanRuralPosPandemia.toFixed(1)}%`, color: "slate" },
    { label: "Crescimento Urbano (2019-23)", value: `+${impactData.resumo.deltaUrbanoPandemia.toFixed(1)}%`, color: "slate" },
    { label: "Período Analisado", value: "2019–23", color: "slate" },
  ] : [
    { label: "Crescimento Rural", value: "...", color: "cyan" },
    { label: "Gap Pós-Pandemia", value: "...", color: "slate" },
    { label: "Crescimento Urbano", value: "...", color: "slate" },
    { label: "Período Analisado", value: "...", color: "slate" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05)_0%,transparent_65%)]" />

      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div style={{ opacity, y }}>
            <div className="mb-10 flex items-center gap-3">
              <span className="inline-block h-px w-6 bg-gradient-to-r from-cyan-400/80 to-transparent" />
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.45em] text-cyan-400/80">
                Epílogo — O Legado
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="font-display mb-8 text-4xl font-bold tracking-tighter text-white text-glow-white md:text-5xl lg:text-6xl"
            >
              O legado do{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent text-glow-cyan">
                isolamento.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
              className="mb-10 text-lg leading-relaxed text-slate-400"
            >
              A pandemia escancarou o abismo digital. O choque forçou o crescimento da conectividade no estado, 
              mas a zona rural ainda é o epicentro do apagão em Mato Grosso, sustentando um gap persistente 
              em relação aos centros urbanos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="polaris-card p-4"
                  data-cursor="hover"
                >
                  <div className={`font-display text-xl font-bold tracking-tighter ${stat.color === "cyan" ? "text-cyan-400 text-glow-cyan" : "text-slate-300"}`}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <MatoGrossoMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
