"use client";

import { motion, type Variants } from "framer-motion";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export default function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
}: SplitTextRevealProps) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 16,
        stiffness: 100,
        duration: duration,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(12px)",
    },
  };

  return (
    <motion.span
      className="inline-block"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={`inline-block whitespace-pre ${className}`}
          variants={child}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.span>
  );
}
