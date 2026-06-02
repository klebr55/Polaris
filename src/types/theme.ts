export interface TailwindV4Colors {
  polarisBlue: string;
  polarisCyan: string;
  polarisDeep: string;
  navy950: string;
  slate100: string;
  slate300: string;
  slate400: string;
  slate800: string;
  slate900: string;
  glass: string;
  glassBorder: string;
  glassHighlight: string;
}

export interface TailwindV4Tokens {
  colors: TailwindV4Colors;
  fontFamily: {
    sans: string[];
  };
  fontSize: Record<string, [string, { lineHeight: string }]>;
  backdropBlur: Record<string, string>;
  boxShadow: {
    glass: string;
  };
}

export interface FramerMotionConfig {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: {
    duration: number;
    ease: number[] | string;
    delay?: number;
  };
}

export interface GsapAnimationConfig {
  duration: number;
  ease: string;
  scaleX?: number;
  x?: number;
  opacity?: number;
}
