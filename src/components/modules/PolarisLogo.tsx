import { motion } from "framer-motion";

interface PolarisLogoProps {
  className?: string;
  animate?: boolean;
}

export default function PolarisLogo({ className = "h-8 w-8", animate = true }: PolarisLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.8)" />
          <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
        </radialGradient>
      </defs>
      
      {/* Background Glow */}
      <circle cx="50" cy="50" r="40" fill="url(#star-glow)" opacity="0.3" />
      
      {/* 4-Pointed Star / North Star */}
      <motion.path
        d="M50 5 L53.5 46.5 L95 50 L53.5 53.5 L50 95 L46.5 53.5 L5 50 L46.5 46.5 Z"
        fill="currentColor"
        initial={animate ? { scale: 0.8, opacity: 0, rotate: -45 } : false}
        animate={animate ? { scale: 1, opacity: 1, rotate: 0 } : false}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Inner Diamond */}
      <motion.path
        d="M50 35 L55 50 L50 65 L45 50 Z"
        fill="#020617"
        initial={animate ? { scale: 0 } : false}
        animate={animate ? { scale: 1 } : false}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}
