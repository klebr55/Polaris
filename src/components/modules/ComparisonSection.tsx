"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { GsapAnimationConfig } from "../../types/theme";

interface ComparisonSectionProps {
  urbanPercent?: number;
  ruralPercent?: number;
}

const DEFAULT_URBAN = 82.4;
const DEFAULT_RURAL = 58.1;

const MICRO_STATS = [
  { value: "1 em 4", label: "produtores rurais sem acesso" },
  { value: "58,1%", label: "das famílias rurais conectadas" },
  { value: "2020", label: "quando o gap virou crise" },
];

export default function ComparisonSection({
  urbanPercent = DEFAULT_URBAN,
  ruralPercent = DEFAULT_RURAL,
}: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const urbanBarRef = useRef<HTMLDivElement | null>(null);
  const ruralBarRef = useRef<HTMLDivElement | null>(null);
  const gapBarRef = useRef<HTMLDivElement | null>(null);
  const heroNumberRef = useRef<HTMLSpanElement | null>(null);
  const urbanCounterRef = useRef<HTMLSpanElement | null>(null);
  const ruralCounterRef = useRef<HTMLSpanElement | null>(null);

  const gap = urbanPercent - ruralPercent;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Stagger entrance
      gsap.from(sectionRef.current.children[0].children, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      const heroObj = { val: 0 };
      gsap.to(heroObj, {
        val: gap,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        onUpdate() {
          if (heroNumberRef.current) {
            heroNumberRef.current.textContent = heroObj.val.toFixed(1);
          }
        },
      });

      const urbanObj = { val: 0 };
      gsap.to(urbanObj, {
        val: urbanPercent,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        onUpdate() {
          if (urbanCounterRef.current) {
            urbanCounterRef.current.textContent =
              urbanObj.val.toFixed(1) + "%";
          }
        },
      });

      const ruralObj = { val: 0 };
      gsap.to(ruralObj, {
        val: ruralPercent,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        onUpdate() {
          if (ruralCounterRef.current) {
            ruralCounterRef.current.textContent =
              ruralObj.val.toFixed(1) + "%";
          }
        },
      });

      const barConfig: GsapAnimationConfig = {
        duration: 1.4,
        ease: "power3.out",
      };

      gsap.set([urbanBarRef.current, ruralBarRef.current], {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.to(urbanBarRef.current, {
        scaleX: urbanPercent / 100,
        ...barConfig,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.to(ruralBarRef.current, {
        scaleX: ruralPercent / 100,
        ...barConfig,
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.set(gapBarRef.current, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "left center",
      });

      gsap.to(gapBarRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.9,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [urbanPercent, ruralPercent, gap]);

  return (
    <section ref={sectionRef} className="px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-14 flex items-center gap-3">
          <span className="inline-block h-px w-6 bg-gradient-to-r from-amber-400/80 to-transparent" />
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.45em] text-amber-400/80">
            Ato 2 — O Abismo&nbsp;·&nbsp;Desigualdade de acesso em 2020
          </span>
        </div>

        <div className="mb-16">
          <div className="flex items-end gap-2">
            <span className="font-extrabold leading-none tracking-[-0.05em] tabular-nums text-white text-[6rem] sm:text-[9rem] lg:text-[12rem]">
              <span ref={heroNumberRef}>0.0</span>
            </span>
            <span className="mb-3 text-3xl font-bold tracking-tight text-amber-400 sm:mb-5 sm:text-5xl">
              pp
            </span>
          </div>
          <p className="text-lg tracking-wide text-slate-400">
            de vantagem das cidades sobre o campo
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-white/[0.07] bg-white/[0.025] px-8 py-10 backdrop-blur-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-sm uppercase tracking-[0.3em] text-slate-300">
                  Áreas Urbanas
                </span>
              </div>
              <span
                ref={urbanCounterRef}
                className="font-mono text-base font-semibold tabular-nums text-cyan-400"
              >
                0.0%
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                ref={urbanBarRef}
                className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-slate-500" />
                <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Áreas Rurais
                </span>
              </div>
              <span
                ref={ruralCounterRef}
                className="font-mono text-base font-semibold tabular-nums text-slate-400"
              >
                0.0%
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                ref={ruralBarRef}
                className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-slate-500 to-slate-600"
              />
            </div>
          </div>

          <div className="relative h-8">
            <div className="absolute inset-y-0 left-0 w-full">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.04]" />
              <div
                ref={gapBarRef}
                className="absolute inset-y-0"
                style={{
                  left: `${ruralPercent}%`,
                  width: `${gap}%`,
                }}
              >
                <div className="relative flex h-full items-center">
                  <div className="absolute inset-x-0 inset-y-[9px] rounded-full bg-amber-500/25 shadow-[0_0_14px_rgba(245,158,11,0.35)]" />
                  <div className="absolute inset-y-0 left-0 w-px bg-amber-400/50" />
                  <div className="absolute inset-y-0 right-0 w-px bg-amber-400/50" />
                  <span className="absolute left-1/2 -top-5 -translate-x-1/2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.3em] text-amber-400/90">
                    Gap&nbsp;{gap.toFixed(1)}pp
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-px border-t border-white/[0.05] pt-8 sm:grid-cols-3">
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
        </div>

        <p className="mt-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          A pandemia não criou esse abismo.{" "}
          <span className="text-slate-300">
            Ela o tornou impossível de ignorar.
          </span>
        </p>
      </div>
    </section>
  );
}
