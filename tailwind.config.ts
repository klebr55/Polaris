import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "polaris-blue": "rgb(var(--color-polaris-blue) / <alpha-value>)",
        navy: {
          950: "#0A192F",
        },
        slate: {
          100: "#F1F5F9",
          300: "#CBD5E1",
          400: "#94A3B8",
          800: "#1E293B",
          900: "#0F172A",
        },
        glass: {
          DEFAULT: "rgb(15 23 42 / 0.55)",
          border: "rgb(148 163 184 / 0.2)",
          highlight: "rgb(255 255 255 / 0.08)",
        },
      },
      fontFamily: {
        sans: [
          "Geist Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.25rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "2rem" }],
        xl: ["1.25rem", { lineHeight: "2.25rem" }],
        "2xl": ["1.5rem", { lineHeight: "2.5rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.75rem" }],
        "4xl": ["2.25rem", { lineHeight: "3.25rem" }],
        "5xl": ["3rem", { lineHeight: "3.75rem" }],
        "6xl": ["3.75rem", { lineHeight: "4.5rem" }],
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        glass: "0 12px 48px 0 rgb(2 6 23 / 0.45)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".transition-soft": {
          transitionProperty:
            "color, background-color, border-color, box-shadow, transform, filter, opacity",
          transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          transitionDuration: "300ms",
        },
      });
    }),
  ],
};

export default config;
