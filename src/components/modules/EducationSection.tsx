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

interface EducationSectionProps {
  data: MatoGrossoDigitalDivideData;
}

export default function EducationSection({ data }: EducationSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  const equipData = data.realidadeInfraestrutura.equipamentosUtilizados.slice(0, 4).map(e => ({
    name: e.equipamento.includes("Telefone") || e.equipamento.includes("Celular") ? "Celular" :
          e.equipamento.includes("Microcomputador") ? "Computador" :
          e.equipamento.includes("Tablet") ? "Tablet" :
          e.equipamento.includes("Televisão") ? "TV" : e.equipamento,
    value: e.percentualUsuarios
  }));

  const mainBarrier = data.resumoNarrativo.principalBarreiraAcesso;

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !chartWrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(chartWrapperRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: chartWrapperRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="educacao" ref={containerRef} className="relative px-6 py-16 h-auto">
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
            <span className="inline-block h-px w-6 bg-gradient-to-r from-cyan-400/80 to-transparent" />
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.45em] text-cyan-400/80">
              Ato 3 — A Urgência · Barreiras da Educação
            </span>
          </div>

          <div className="mb-12">
            <h2 className="font-display max-w-3xl text-3xl font-bold leading-tight tracking-tighter sm:text-4xl lg:text-5xl text-slate-200">
              O celular virou <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent text-glow-cyan">
                a única porta de entrada.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
            Com as escolas de portas fechadas, o computador era luxo inacessível para a base da pirâmide. 
            Estudantes precisaram improvisar, e a conectividade móvel tornou-se a barreira final 
            entre estudar ou abandonar o ano letivo.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.15 }}
            className="mt-8 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/10 p-5 transition-all duration-500 ease-out hover:border-cyan-400/20 hover:bg-cyan-500/[0.07]"
          >
            <p className="text-sm text-cyan-400/90 leading-relaxed font-medium">
              Principal obstáculo relatado pelas famílias:
            </p>
            <p className="text-base text-slate-300 mt-1 capitalize font-semibold">
              {mainBarrier.toLowerCase()}
            </p>
          </motion.div>
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
                className="polaris-card px-6 py-10 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]"
              >
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-12">
                Equipamentos de Acesso Durante a Pandemia
              </div>
              
              <div className="h-80 w-full" role="img" aria-label="Gráfico de equipamentos utilizados">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={equipData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="edu-equip-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      </linearGradient>
                      <filter id="edu-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                      cursor={{ fill: "rgba(56,189,248,0.03)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-lg backdrop-blur-md">
                              <p className="text-sm font-semibold text-white mb-1">{payload[0].payload.name}</p>
                              <p className="text-xs text-slate-300">
                                Uso: <span className="font-mono text-cyan-400">{Number(payload[0].value).toFixed(1)}%</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1300}
                      animationEasing="ease-out"
                      animationBegin={600}
                    >
                      {equipData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? "url(#edu-equip-gradient)" : "#1e293b"} 
                          filter={index === 0 ? "url(#edu-glow)" : undefined}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="mt-6 border-t border-white/5 pt-4 text-center"
              >
                <p className="text-xs leading-relaxed text-slate-500">
                  <strong className="font-semibold text-slate-300">Sobrevivência Móvel:</strong> Os dados evidenciam uma assimetria gritante na infraestrutura de acesso. Enquanto o celular — sujeito a pacotes limitados e telas pequenas — foi o pilar de quase 100% das casas, equipamentos essenciais para o ensino remoto como computadores e tablets estiveram ausentes na maioria absoluta dos lares mais vulneráveis.
                </p>
              </motion.div>
              
              </div>
            </SectionReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
