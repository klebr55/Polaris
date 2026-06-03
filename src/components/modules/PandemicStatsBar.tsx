"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  sublabel: string;
  glow: "cyan" | "white";
}

const STATS: Stat[] = [
  {
    prefix: "+",
    value: 24.3,
    suffix: "%",
    decimals: 1,
    label: "Salto de conectividade",
    sublabel: "2019 → 2022",
    glow: "cyan",
  },
  {
    prefix: "",
    value: 3.2,
    suffix: "M",
    decimals: 1,
    label: "Mato-grossenses online",
    sublabel: "população impactada",
    glow: "white",
  },
  {
    prefix: "",
    value: 2020,
    suffix: "",
    decimals: 0,
    label: "O ano que mudou tudo",
    sublabel: "marco da virada digital",
    glow: "white",
  },
];

export default function PandemicStatsBar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.value,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate() {
            el.textContent =
              stat.prefix +
              obj.val.toFixed(stat.decimals) +
              stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full">
      <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: i * 0.08 }}
            className="group relative flex flex-col gap-2 rounded-none border border-white/[0.06] bg-white/[0.025] px-8 py-6 backdrop-blur-xl first:rounded-l-2xl last:rounded-r-2xl hover:bg-white/[0.045] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(34,211,238,0.07)] transition-all duration-500 ease-out"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-none first:rounded-l-2xl last:rounded-r-2xl bg-gradient-to-br from-cyan-500/[0.05] to-transparent" />

            <div className="flex items-baseline gap-1">
              <span
                ref={(el) => { valueRefs.current[i] = el; }}
                className={`font-display text-3xl font-bold tabular-nums tracking-tighter text-white sm:text-4xl ${stat.glow === "cyan" ? "text-glow-cyan" : "text-glow-white"}`}
              >
                {stat.prefix}0{stat.suffix}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-slate-200">
                {stat.label}
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {stat.sublabel}
              </span>
            </div>

            <div className="mt-1 h-px w-8 bg-gradient-to-r from-cyan-400/60 to-transparent" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
