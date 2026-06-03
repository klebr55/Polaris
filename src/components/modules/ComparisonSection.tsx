"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import type { MatoGrossoDigitalDivideData } from "../../types/digitalDivide";
import SectionReveal from "./SectionReveal";

interface ComparisonSectionProps {
  data: MatoGrossoDigitalDivideData;
}

const MICRO_STATS = [
  { value: "Fique em Casa", label: "O estopim do abismo" },
  { value: "Renda & Local", label: "Fatores de exclusão" },
  { value: "2020", label: "O ano da ruptura" },
];

export default function ComparisonSection({ data }: ComparisonSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const heroNumberRef = useRef<HTMLSpanElement>(null);

  const teleworkRates = data.choqueTrabalhoRemoto.teleworkByRendimento.map(
    (t) => t.percentualTeletrabalho,
  );
  const maxTelework =
    teleworkRates.length > 0 ? Math.max(...teleworkRates) : 42.5;
  
  const apagao = data.realidadeInfraestrutura.percentualDomiciliosSemInternet;

  const gap = maxTelework - apagao;

  const chartData = [
    {
      name: "Home Office Urbano",
      value: maxTelework,
      fill: "url(#urban-gradient)",
    },
    {
      name: "Apagão Rural",
      value: apagao,
      fill: "url(#rural-gradient)",
    },
  ];

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !chartWrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroObj = { val: 0 };
      gsap.to(heroObj, {
        val: gap,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          once: true,
        },
        onUpdate() {
          if (heroNumberRef.current) {
            heroNumberRef.current.textContent = heroObj.val.toFixed(1);
          }
        },
      });

      gsap.from(chartWrapperRef.current, {
        opacity: 0,
        x: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: chartWrapperRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [gap]);

  return (
    <section id="conectividade" ref={containerRef} className="relative px-6 py-16 h-auto">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
        
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="flex h-fit flex-col pt-10 lg:sticky lg:top-32 lg:col-span-5"
        >
          <div className="mb-14 flex items-center gap-3">
            <span className="inline-block h-px w-6 bg-gradient-to-r from-amber-400/80 to-transparent" />
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.45em] text-amber-400/80">
              Ato 2 — O Abismo · O Lockdown
            </span>
          </div>

          <div className="mb-12">
            <div className="flex items-end gap-2">
              <span className="font-display font-extrabold leading-none tracking-tighter tabular-nums text-white text-glow-white text-[5rem] sm:text-[7rem] lg:text-[9rem]">
                <span ref={heroNumberRef}>0.0</span>
              </span>
              <span className="mb-3 self-end pb-4 text-lg font-semibold tracking-tight text-amber-400 text-glow-amber sm:text-xl">
                % de defasagem
              </span>
            </div>
            <p className="max-w-lg text-lg leading-relaxed tracking-wide text-slate-400">
              entre a conectividade dos grandes polos e o isolamento do interior do estado.
            </p>
          </div>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
            Quando a ordem foi{" "}
            <span className="font-medium text-amber-300/90">Fique em Casa</span>,
            os centros urbanos de MT migraram para o home office.{" "}
            <span className="text-slate-300">
              O campo sofreu um apagão digital que a pandemia não criou — apenas
              tornou impossível de ignorar.
            </span>
          </p>
          
          <div className="mt-12 grid grid-cols-1 gap-px border-t border-white/[0.05] pt-8 sm:grid-cols-3">
            {MICRO_STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
                <span className="font-mono text-xl font-bold text-white">
                  {s.value}
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col justify-center pb-16 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
          >
            <SectionReveal>
              <div
                ref={chartWrapperRef}
                className="polaris-card px-6 py-10 hover:shadow-[0_20px_60px_rgba(8,145,178,0.12)]"
              >
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-8">
                Acesso e Privilégio vs Exclusão
              </div>
              <div className="h-72 w-full" role="img" aria-label="Gráfico de Abismo Urbano e Rural">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                    barSize={32}
                  >
                    <defs>
                      <linearGradient id="urban-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="rural-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#64748b" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#475569" stopOpacity={1} />
                      </linearGradient>
                      <filter id="bar-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.05)" />
                    <XAxis 
                      type="number" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748B", fontSize: 11 }} 
                      tickFormatter={(val) => `${val}%`}
                      domain={[0, 100]}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#cbd5e1", fontSize: 12, fontWeight: 500 }}
                      width={140}
                    />
                    <Tooltip 
                      cursor={{ fill: "rgba(255,255,255,0.02)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-lg backdrop-blur-md text-slate-200">
                              <p className="text-sm font-semibold text-white mb-1">{payload[0].payload.name}</p>
                              <p className="text-xs text-slate-300">
                                Métrica: <span className="font-mono text-cyan-400">{Number(payload[0].value).toFixed(1)}%</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: 20 }}
                      content={() => (
                        <div className="flex justify-end items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"></span>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">Privilégio Conectado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-slate-500 to-slate-600"></span>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">Apagão de Acesso</span>
                          </div>
                        </div>
                      )}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[0, 6, 6, 0]}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} filter={index === 0 ? "url(#bar-glow)" : undefined} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-10 rounded-2xl bg-amber-500/[0.04] border border-amber-500/10 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500/80 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                  </span>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Os dados referenciam o pico da adoção do home office nas faixas de maior renda (centros urbanos) em contraste com o total de domicílios isolados que permaneceram offline (áreas rurais e periféricas).
                  </p>
                </div>
              </div>
              </div>
            </SectionReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
