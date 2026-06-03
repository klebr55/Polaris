"use client";

import { useRef, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InternetAccessSeries } from "../../services/sidra";

const formatNumber = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

function formatPercent(value: number): string {
  return `${formatNumber.format(value)}%`;
}

function ActiveDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={8}
      fill="#22D3EE"
      stroke="#E0F2FE"
      strokeWidth={2}
      filter="url(#polaris-glow)"
    />
  );
}

export default function InternetAccessCard({
  series,
}: {
  series: InternetAccessSeries;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 18 });
  const [hoveredData, setHoveredData] = useState<{ label: string; value: number } | null>(null);

  const chartData = series.points.slice(-7).map((point) => ({
    period: point.period,
    value: point.value,
  }));

  const latest = series.points[series.points.length - 1];
  const first = series.points[0];
  const peak = series.points.reduce((best, current) =>
    current.value > best.value ? current : best,
  );
  const delta = latest.value - first.value;
  const deltaLabel = `${delta >= 0 ? "+" : ""}${formatNumber.format(delta)}%`;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      if (!chartRef.current) return;

      const path = chartRef.current.querySelector(
        ".recharts-area-area",
      ) as SVGPathElement;

      if (!path) return;

      if (prefersReducedMotion) {
        gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, 750);

    return () => clearTimeout(timer);
  }, [series]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
        <span>Sinal de crescimento</span>
        <span>
          {series.territory.name} {series.territory.code}
        </span>
      </div>

      <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
        {series.indicator}
      </div>

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredData(null)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 ease-out hover:border-white/[0.16] hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(34,211,238,0.1)]"
      >
        <div ref={chartRef} className="h-56 w-full relative z-10" role="img" aria-label={`Grafico de ${series.indicator}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              onMouseMove={(data) => {
                if (data.isTooltipActive && data.activePayload && data.activePayload.length) {
                  setHoveredData({
                    label: String(data.activeLabel),
                    value: Number(data.activePayload[0].value),
                  });
                } else {
                  setHoveredData(null);
                }
              }}
            >
              <defs>
                <linearGradient id="polaris-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
                <filter id="polaris-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
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
              <XAxis
                dataKey="period"
                axisLine={{ strokeOpacity: 0.2, stroke: "#64748B" }}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11, letterSpacing: "0.05em" }}
                tickMargin={8}
                minTickGap={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11, letterSpacing: "0.05em" }}
                tickFormatter={(value) => `${formatNumber.format(Number(value))}%`}
                width={40}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Acesso à internet"
                stroke="#22D3EE"
                strokeWidth={2}
                fill="url(#polaris-area-gradient)"
                dot={false}
                activeDot={<ActiveDot />}
                isAnimationActive={false}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 8 }}
                formatter={(value: string) => (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#94A3B8",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {hoveredData && (
          <motion.div
            style={{ x: springX, y: springY }}
            className="pointer-events-none absolute left-0 top-0 z-50 rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transform -translate-x-1/2 -translate-y-[120%]"
          >
            <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
              Ano
            </div>
            <div className="text-sm font-semibold text-white">
              {hoveredData.label}
            </div>
            <div className="mt-1 text-xs text-slate-300">
              Acesso {formatPercent(hoveredData.value)}
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Último ano",
            value: latest.period,
            detail: `Acesso ${formatPercent(latest.value)}`,
            accent: false,
          },
          {
            label: "Pico",
            value: formatPercent(peak.value),
            detail: `em ${peak.period}`,
            accent: true,
          },
          {
            label: "Evolução",
            value: deltaLabel,
            detail: `desde ${first.period}`,
            accent: true,
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: i * 0.08 }}
            className="group relative flex flex-col gap-1 rounded-2xl border border-white/[0.03] bg-white/[0.015] px-4 py-3 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04] hover:shadow-[0_14px_32px_rgba(15,23,42,0.45)]"
            tabIndex={0}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </span>
            <span className={`text-lg font-semibold tracking-tight text-white ${item.accent ? "text-glow-cyan" : ""}`}>
              {item.value}
            </span>
            <span className="text-xs text-slate-400/80">{item.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
