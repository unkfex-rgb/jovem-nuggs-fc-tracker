import type { Config } from "tailwindcss";

// Design tokens — Jovem Nuggs FC
// Conceito: "club terminal" — dashboard como se fosse um painel de dev/gamer,
// dark mode, tipografia mono pra dados, verde-menta como assinatura (puxa da
// identidade que o clube já usa nos prints do app da EA).

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070B0C", // fundo base
          900: "#0B1112",
          800: "#121A1B", // superfície de card
          700: "#1B2426",
          600: "#283335",
        },
        mint: {
          400: "#5BF4C0",
          500: "#00E5A0", // acento primário
          600: "#00B885",
        },
        violet: {
          400: "#9B8CFF",
          500: "#7C5CFC", // acento secundário (destaque raro)
        },
        coral: {
          400: "#FF7A90",
          500: "#FF5470", // derrota / erro
        },
        amber: {
          400: "#FFC65B", // empate
        },
        paper: {
          100: "#F4F1EA", // usado com moderação, ecoa o painel oficial da EA
        },
        fog: {
          300: "#9FB0AD",
          500: "#6B7876", // texto secundário
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,229,160,0.15), 0 0 24px -6px rgba(0,229,160,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(0,229,160,0.06), transparent 60%), radial-gradient(60% 60% at 50% 0%, rgba(0,229,160,0.08), transparent)",
      },
      animation: {
        blink: "blink 1.1s steps(2, start) infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
