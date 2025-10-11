// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        snaque: {
          blue: "#1800ad",
          beige: "#f4f5d3",
        },
      },
      boxShadow: {
        snaque: "0 10px 30px -12px rgba(24,0,173,0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
