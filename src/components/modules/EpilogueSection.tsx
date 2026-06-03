"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function EpilogueSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/15 via-transparent to-transparent"
    >
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <motion.div style={{ opacity, y }}>
          <h2 className="mb-8 text-4xl font-bold tracking-tight text-white md:text-6xl">
            O legado do isolamento
          </h2>
          <p className="text-lg leading-relaxed text-slate-300 md:text-xl">
            A pandemia passou, mas o salto digital ficou. Mato Grosso foi forçado a se conectar, e agora não há caminho de volta.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
