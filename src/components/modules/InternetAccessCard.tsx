"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import type { TooltipProps } from "recharts";
import type { InternetAccessSeries } from "../../services/sidra";

const formatNumber = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

function formatPercent(value: number): string {
  return `${formatNumber.format(value)}%`;
}

function ActiveDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={9}
      fill="#22D3EE"
      stroke="#E0F2FE"
      strokeWidth={2}
      filter="url(#polaris-glow)"
    />
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const rawValue = payload[0]?.value;
  const numericValue =
    typeof rawValue === "number" ? rawValue : Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-200 shadow-lg backdrop-blur-md">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
        Ano
      </div>
      <div className="text-sm font-semibold text-white">
        {label ? String(label) : "-"}
      </div>
      <div className="mt-1 text-xs text-slate-300">
        Acesso {formatPercent(numericValue)}
      </div>
    </div>
  );
}

export default function InternetAccessCard({
  series,
}: {
  series: InternetAccessSeries;
}) {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
        <span>Growth signal</span>
        <span>
          {series.territory.name} {series.territory.code}
        </span>
      </div>

      <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
        {series.indicator}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div
          className="h-56 w-full"
          role="img"
          aria-label={`Grafico de ${series.indicator}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="polaris-area-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
                <filter
                  id="polaris-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
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
                strokeOpacity={0.1}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickMargin={8}
                minTickGap={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) =>
                  `${formatNumber.format(Number(value))}%`
                }
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#22d3ee",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22D3EE"
                strokeWidth={3}
                fill="url(#polaris-area-gradient)"
                dot={false}
                activeDot={<ActiveDot />}
                isAnimationActive={chartData.length > 0}
                animationBegin={150}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Ultimo ano",
            value: latest.period,
            detail: `Acesso ${formatPercent(latest.value)}`,
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
        ].map((item) => (
          <div
            key={item.label}
            className="group relative flex flex-col gap-1 rounded-2xl border border-glass-border bg-white/5 px-4 py-3 text-sm transition-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_14px_32px_rgba(15,23,42,0.45)]"
            tabIndex={0}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </span>
            <span className="text-lg font-semibold text-white">
              {item.value}
            </span>
            <span className="text-xs text-slate-300">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
