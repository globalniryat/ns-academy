import type { Config } from "tailwindcss";

// Tailwind v4 — colors are configured via @theme in globals.css
// This file only specifies content paths
const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
