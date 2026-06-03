"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  sublabel: string;
}

const STATS: Stat[] = [
  {
    prefix: "+",
    value: 24.3,
    suffix: "pp",
    decimals: 1,
    label: "Salto de conectividade",
    sublabel: "2019 → 2022",
  },
  {
    prefix: "",
    value: 3.2,
    suffix: "M",
    decimals: 1,
    label: "Mato-grossenses online",
    sublabel: "população impactada",
  },
  {
    prefix: "",
    value: 2020,
    suffix: "",
    decimals: 0,
    label: "O ano que mudou tudo",
    sublabel: "marco da virada digital",
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
          <div
            key={stat.label}
            className="group relative flex flex-col gap-2 rounded-none border border-white/[0.06] bg-white/[0.025] px-8 py-6 backdrop-blur-xl first:rounded-l-2xl last:rounded-r-2xl hover:bg-white/[0.04] transition-colors duration-300"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-none first:rounded-l-2xl last:rounded-r-2xl bg-gradient-to-br from-cyan-500/[0.04] to-transparent" />

            <div className="flex items-baseline gap-1">
              <span
                ref={(el) => { valueRefs.current[i] = el; }}
                className="font-mono text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl"
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
          </div>
        ))}
      </div>
    </div>
  );
}
