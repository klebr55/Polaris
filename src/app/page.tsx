"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export default function HomePage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollY } = useScroll();

  const x = useTransform(mouseX, [-50, 50], [-16, 16]);
  const yFromMouse = useTransform(mouseY, [-50, 50], [-12, 12]);
  const yFromScroll = useTransform(scrollY, [0, 320], [0, -14]);
  const y = useTransform([yFromMouse, yFromScroll], ([my, sy]) => my + sy);

  const xSmooth = useSpring(x, { stiffness: 90, damping: 20, mass: 0.4 });
  const ySmooth = useSpring(y, { stiffness: 90, damping: 20, mass: 0.4 });

  return (
    <main
      className="flex min-h-screen items-center px-6 py-20"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = event.clientX - rect.left - rect.width / 2;
        const relativeY = event.clientY - rect.top - rect.height / 2;
        mouseX.set(Math.max(-50, Math.min(50, relativeX / 6)));
        mouseY.set(Math.max(-50, Math.min(50, relativeY / 6)));
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <motion.div
          style={{ x: xSmooth, y: ySmooth }}
          className="flex flex-col gap-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Polaris transforma dados publicos em arte viva.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="max-w-2xl text-lg text-slate-300 sm:text-xl"
          >
            Uma experiencia de data storytelling que revela o crescimento
            tecnologico de Mato Grosso com rigor analitico e sensibilidade
            visual.
          </motion.p>
        </motion.div>

        <motion.figure
          style={{ x: xSmooth, y: ySmooth }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl border border-glass-border bg-glass px-6 py-8 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400">
            <span>Growth signal</span>
            <span>MT 51</span>
          </div>
          <svg
            viewBox="0 0 700 260"
            className="mt-8 h-56 w-full"
            role="img"
            aria-label="Grafico de crescimento tecnologico"
          >
            <defs>
              <linearGradient id="polaris-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <motion.path
              d="M20 210 L120 180 L220 190 L320 120 L420 145 L520 80 L640 40"
              fill="none"
              stroke="url(#polaris-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.path
              d="M20 210 L120 180 L220 190 L320 120 L420 145 L520 80 L640 40 L640 260 L20 260 Z"
              fill="url(#polaris-gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
            />
            {[
              [120, 180],
              [320, 120],
              [520, 80],
              [640, 40],
            ].map(([cx, cy], index) => (
              <motion.circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={index === 3 ? 6 : 4}
                fill="#38BDF8"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              />
            ))}
          </svg>
        </motion.figure>
      </div>
    </main>
  );
}
