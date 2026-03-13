//app/tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          primary: "var(--navy-primary)",
          edge: "var(--navy-edge)",
          shadow: "var(--navy-shadow)",
        },
        gold: {
          light: "var(--gold-light)",
          core: "var(--gold-core)",
          dark: "var(--gold-dark)",
        },
        whiteSoft: "var(--white-soft)",
      },
      fontFamily: {
        montserrat: ["Montserrat", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;