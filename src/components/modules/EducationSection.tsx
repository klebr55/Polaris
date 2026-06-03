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
  ReferenceLine,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { EducationAccessSeries } from "../../services/sidra";
import type { GsapAnimationConfig } from "../../types/theme";

const formatNumber = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

function formatPercent(value: number): string {
  return `${formatNumber.format(value)}%`;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const rawValue = payload[0]?.value;
  const numericValue =
    typeof rawValue === "number" ? rawValue : Number(rawValue);

  if (!Number.isFinite(numericValue)) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-200 shadow-lg backdrop-blur-md">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
        Ano
      </div>
      <div className="text-sm font-semibold text-white">
        {label ? String(label) : "-"}
      </div>
      <div className="mt-1 text-xs text-slate-300">
        Estudantes {formatPercent(numericValue)}
      </div>
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * index }}
      viewport={{ once: true, margin: "-10%" }}
      className="group relative flex flex-col gap-1 rounded-2xl border border-glass-border bg-white/5 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/[0.05] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/20 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <span className="relative z-10 text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="relative z-10 text-lg font-semibold text-white">
        {value}
      </span>
      <span className="relative z-10 text-xs text-slate-300">{detail}</span>
    </motion.div>
  );
}

const HEADLINE_LINES = [
  { text: "Estudante sem internet em 2020", accent: false },
  { text: "era estudante sem escola.", accent: false },
  { text: "Sem futuro.", accent: true },
];

export default function EducationSection({
  series,
}: {
  series: EducationAccessSeries;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  const chartData = series.points.slice(-8).map((point) => ({
    period: point.period,
    value: point.value,
  }));

  const latest = series.points[series.points.length - 1];
  const first = series.points[0];
  const peak = series.points.reduce((best, cur) =>
    cur.value > best.value ? cur : best,
  );
  const delta = latest.value - first.value;
  const deltaLabel = `${delta >= 0 ? "+" : ""}${formatNumber.format(delta)}%`;

  useEffect(() => {
    if (!sectionRef.current || !chartWrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const animationConfig: GsapAnimationConfig = {
        opacity: 0,
        x: 40,
        duration: 1.0,
        ease: "power3.out",
      };

      gsap.from(chartWrapperRef.current, {
        ...animationConfig,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-15%" }}
          className="mb-12 flex items-center gap-3"
        >
          <span className="inline-block h-px w-6 bg-gradient-to-r from-cyan-400/80 to-transparent" />
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.45em] text-cyan-400/80">
            Ato 3 — A Urgência&nbsp;·&nbsp;Acesso à internet na educação
          </span>
        </motion.div>

        <div className="mb-14">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {HEADLINE_LINES.map((line, i) => (
              <motion.span
                key={line.text}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.14,
                }}
                viewport={{ once: true, margin: "-15%" }}
                className={`block ${
                  line.accent
                    ? "bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
                    : "text-slate-200"
                }`}
              >
                {line.text}
              </motion.span>
            ))}
          </h2>
        </div>

        <div
          ref={chartWrapperRef}
          className="rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-8 backdrop-blur-xl"
        >
          <div
            className="relative h-72 w-full"
            role="img"
            aria-label={`Gráfico de barras: ${series.indicator}`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-transparent" />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 32, right: 8, left: 0, bottom: 0 }}
                barCategoryGap="28%"
              >
                <defs>
                  <linearGradient
                    id="edu-bar-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.95} />
                    <stop
                      offset="100%"
                      stopColor="#0EA5E9"
                      stopOpacity={0.65}
                    />
                  </linearGradient>
                  <linearGradient
                    id="edu-bar-gradient-hover"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7DD3FC" stopOpacity={1} />
                    <stop
                      offset="100%"
                      stopColor="#38BDF8"
                      stopOpacity={0.85}
                    />
                  </linearGradient>
                  <filter
                    id="edu-glow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
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
                  strokeOpacity={0.04}
                  strokeDasharray="3 3"
                />

                <ReferenceLine
                  x="2020"
                  stroke="#F59E0B"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  label={{
                    value: "Pandemia",
                    fill: "#F59E0B",
                    fontSize: 10,
                    position: "top",
                  }}
                />

                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  tickMargin={10}
                  minTickGap={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  tickFormatter={(v) =>
                    `${formatNumber.format(Number(v))}%`
                  }
                  width={44}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(56,189,248,0.05)", radius: 6 }}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={chartData.length > 0}
                  animationBegin={100}
                  animationDuration={1100}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        Number(entry.period) < 2020
                          ? "#1e293b"
                          : "url(#edu-bar-gradient)"
                      }
                      fillOpacity={Number(entry.period) < 2020 ? 0.7 : 1}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        if (Number(entry.period) >= 2020) {
                          (e.target as SVGElement).setAttribute(
                            "fill",
                            "url(#edu-bar-gradient-hover)",
                          );
                          (e.target as SVGElement).setAttribute(
                            "filter",
                            "url(#edu-glow)",
                          );
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (Number(entry.period) >= 2020) {
                          (e.target as SVGElement).setAttribute(
                            "fill",
                            "url(#edu-bar-gradient)",
                          );
                          (e.target as SVGElement).removeAttribute("filter");
                        }
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Último ano",
              value: latest.period,
              detail: `Estudantes ${formatPercent(latest.value)}`,
            },
            {
              label: "Pico",
              value: formatPercent(peak.value),
              detail: `em ${peak.period}`,
            },
            {
              label: "Evolução",
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

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          viewport={{ once: true, margin: "-10%" }}
          className="mt-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Os dados provam. Mato Grosso não só sobreviveu ao apagão —{" "}
          <span className="font-medium text-slate-200">
            acelerou além dele.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
