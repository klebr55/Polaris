"use client";

import { motion } from "framer-motion";

interface StoryBlockProps {
  eyebrow: string;
  headline: string;
  body: string;
  align?: "left" | "center";
}

export default function StoryBlock({
  eyebrow,
  headline,
  body,
  align = "left",
}: StoryBlockProps) {
  const isCenter = align === "center";

  return (
    <section className="px-6">
      <div
        className={`mx-auto flex max-w-4xl flex-col gap-6 ${
          isCenter ? "items-center text-center" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          viewport={{ once: true, margin: "-15%" }}
          className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl"
        >
          {headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          viewport={{ once: true, margin: "-15%" }}
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
