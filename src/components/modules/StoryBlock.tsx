"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EYEBROW_DURATION = 0.6;
const HEADLINE_DURATION = 0.7;
const HEADLINE_DELAY = 0.08;
const BODY_DURATION = 0.7;
const BODY_DELAY = 0.15;

export const STORY_BLOCK_REVEAL_MS =
  (BODY_DELAY + BODY_DURATION) * 1000;

interface StoryBlockProps {
  eyebrow: string;
  headline: string;
  body: string;
  align?: "left" | "center";
  onBodyVisible?: () => void;
}

export default function StoryBlock({
  eyebrow,
  headline,
  body,
  align = "left",
  onBodyVisible,
}: StoryBlockProps) {
  const isCenter = align === "center";
  const blockRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!blockRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: blockRef.current,
        start: "top 30%",
        end: "bottom center",
        pinSpacing: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="px-6 h-[150vh] relative"
      aria-label={eyebrow}
    >
      <div
        ref={blockRef}
        className={`mx-auto flex max-w-4xl flex-col gap-6 ${
          isCenter ? "items-center text-center" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: EYEBROW_DURATION, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-15%" }}
          className="flex items-center gap-3"
        >
          <span className="inline-block h-px w-6 bg-gradient-to-r from-cyan-400/80 to-transparent" />
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.5em] text-cyan-400/70">
            {eyebrow}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: HEADLINE_DURATION,
            ease: [0.22, 1, 0.36, 1],
            delay: HEADLINE_DELAY,
          }}
          viewport={{ once: true, margin: "-15%" }}
          className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl"
        >
          {headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: BODY_DURATION,
            ease: [0.22, 1, 0.36, 1],
            delay: BODY_DELAY,
          }}
          viewport={{ once: true, margin: "-15%" }}
          onAnimationComplete={() => onBodyVisible?.()}
          className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          viewport={{ once: true, margin: "-15%" }}
          className="mt-2 h-px w-full max-w-xs origin-left bg-gradient-to-r from-cyan-500/30 via-slate-700/30 to-transparent"
        />
      </div>
    </section>
  );
}
