"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX = useSpring(mx, { stiffness: 900, damping: 28, mass: 0.08 });
  const dotY = useSpring(my, { stiffness: 900, damping: 28, mass: 0.08 });
  const ringX = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 140, damping: 18, mass: 0.6 });

  useEffect(() => {
    setMounted(true);

    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setIsVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor='hover'], input, textarea, select, label"
      );
      setIsHovering(!!el);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
    };
  }, [mx, my]);

  if (!mounted || isTouch) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.12 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/50"
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? 48 : 30,
          height: isHovering ? 48 : 30,
          borderColor: isHovering
            ? "rgba(34,211,238,0.9)"
            : "rgba(34,211,238,0.45)",
          boxShadow: isHovering
            ? "0 0 14px rgba(34,211,238,0.35), inset 0 0 8px rgba(34,211,238,0.08)"
            : "none",
          backgroundColor: isHovering
            ? "rgba(34,211,238,0.06)"
            : "transparent",
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
