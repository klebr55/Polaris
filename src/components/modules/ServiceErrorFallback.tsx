"use client";

import { motion } from "framer-motion";

interface ServiceErrorFallbackProps {
  title: string;
  message: string;
}

export default function ServiceErrorFallback({
  title,
  message,
}: ServiceErrorFallbackProps) {
  return (
    <section className="px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" as const }}
        className="mx-auto w-full max-w-6xl rounded-4xl border border-amber-500/20 bg-amber-500/5 px-8 py-12 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-amber-400"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="max-w-md text-sm text-slate-400">{message}</p>
        </div>
      </motion.div>
    </section>
  );
}
