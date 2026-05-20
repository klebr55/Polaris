"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { EducationAccessSeries } from "../../services/sidra";

const formatNumber = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

function formatPercent(value: number): string {
  return `${formatNumber.format(value)}%`;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const rawValue = payload[0]?.value;
  const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-200 shadow-lg backdrop-blur-md">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Ano</div>
      <div className="text-sm font-semibold text-white">{label ? String(label) : "-"}</div>
      <div className="mt-1 text-xs text-slate-300">Estudantes {formatPercent(numericValue)}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  index: number;
}

function StatCard({ label, value, detail, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * index }}
      viewport={{ once: true, margin: "-10%" }}
      className="group relative flex flex-col gap-1 rounded-2xl border border-glass-border bg-white/5 px-4 py-3 text-sm transition-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_14px_32px_rgba(15,23,42,0.45)]"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-glass-highlight opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-xs text-slate-300">{detail}</span>
    </motion.div>
  );
}

export default function EducationSection({ series }: { series: EducationAccessSeries }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  const chartData = series.points.slice(-8).map((point) => ({
    period: point.period,
    value: point.value,
  }));

  const latest = series.points[series.points.length - 1];
  const first = series.points[0];
  const peak = series.points.reduce((best, cur) => (cur.value > best.value ? cur : best));
  const delta = latest.value - first.value;
  const deltaLabel = `${delta >= 0 ? "+" : ""}${formatNumber.format(delta)}%`;

  useEffect(() => {
    if (!sectionRef.current || !chartWrapperRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(chartWrapperRef.current, {
        opacity: 0,
        x: 40,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: "easeOut" }}
        viewport={{ once: true, margin: "-18%" }}
        className="mx-auto w-full max-w-6xl rounded-4xl border border-glass-border bg-glass/50 px-8 py-12 shadow-glass backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0 rounded-4xl bg-linear-to-br from-cyan-500/5 via-transparent to-transparent" />

        <div className="relative flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.5em] text-slate-400">Ato 3</span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            O Impacto na Educação
          </h2>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            O acesso à internet entre estudantes de Mato Grosso revela como a
            conectividade digital se tornou pilar essencial para a equidade
            educacional no estado.
          </p>
        </div>

        <div ref={chartWrapperRef} className="relative mt-10">
          <div
            className="relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
            role="img"
            aria-label={`Grafico de barras: ${series.indicator}`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-cyan-500/8 via-transparent to-transparent" />

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    <linearGradient id="edu-bar-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="edu-bar-gradient-hover" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7DD3FC" stopOpacity={1} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.85} />
                    </linearGradient>
                    <filter id="edu-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="rgb(148 163 184)"
                    strokeOpacity={0.1}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="period"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickMargin={8}
                    minTickGap={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickFormatter={(v) => `${formatNumber.format(Number(v))}%`}
                    width={44}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(56,189,248,0.06)", radius: 6 }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#edu-bar-gradient)"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={chartData.length > 0}
                    animationBegin={100}
                    animationDuration={1100}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="url(#edu-bar-gradient)"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => {
                          (e.target as SVGElement).setAttribute(
                            "fill",
                            "url(#edu-bar-gradient-hover)",
                          );
                          (e.target as SVGElement).setAttribute(
                            "filter",
                            "url(#edu-glow)",
                          );
                        }}
                        onMouseLeave={(e) => {
                          (e.target as SVGElement).setAttribute(
                            "fill",
                            "url(#edu-bar-gradient)",
                          );
                          (e.target as SVGElement).removeAttribute("filter");
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Ultimo ano",
              value: latest.period,
              detail: `Estudantes ${formatPercent(latest.value)}`,
            },
            {
              label: "Pico",
              value: formatPercent(peak.value),
              detail: `em ${peak.period}`,
            },
            {
              label: "Evolucao",
              value: deltaLabel,
              detail: `desde ${first.period}`,
            },
          ].map((item, i) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              detail={item.detail}
              index={i}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
