"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ComparisonSectionProps {
  urbanPercent?: number;
  ruralPercent?: number;
}

const DEFAULT_URBAN = 82.4;
const DEFAULT_RURAL = 58.1;

export default function ComparisonSection({
  urbanPercent = DEFAULT_URBAN,
  ruralPercent = DEFAULT_RURAL,
}: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const urbanBarRef = useRef<HTMLDivElement | null>(null);
  const ruralBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !urbanBarRef.current || !ruralBarRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const maxValue = Math.max(urbanPercent, ruralPercent, 1);
    const urbanScale = urbanPercent / maxValue;
    const ruralScale = ruralPercent / maxValue;

    const ctx = gsap.context(() => {
      gsap.set([urbanBarRef.current, ruralBarRef.current], {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.to(urbanBarRef.current, {
        scaleX: urbanScale,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.to(ruralBarRef.current, {
        scaleX: ruralScale,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [urbanPercent, ruralPercent]);

  return (
    <section ref={sectionRef} className="px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-20%" }}
        className="mx-auto w-full max-w-6xl rounded-4xl border border-glass-border bg-glass/50 px-8 py-12 shadow-glass backdrop-blur-xl"
      >
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.5em] text-slate-400">
            Ato 2
          </span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Urbano vs Rural
          </h2>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            O contraste entre centros urbanos e zonas rurais desenha o ritmo de
            acesso digital em Mato Grosso. As barras revelam a distancia
            estrutural que ainda molda o territorio.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {[
            { label: "Urbanas", value: urbanPercent, ref: urbanBarRef },
            { label: "Rurais", value: ruralPercent, ref: ruralBarRef },
          ].map((entry) => (
            <div key={entry.label} className="space-y-3">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-slate-300">
                <span>{entry.label}</span>
                <span className="text-base font-semibold text-polaris-blue">
                  {entry.value.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  ref={entry.ref}
                  className="h-full w-full rounded-full bg-linear-to-r from-(--color-polaris-blue) via-cyan-200/80 to-white/80 shadow-[0_0_18px_rgba(56,189,248,0.55)]"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
