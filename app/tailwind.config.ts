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
          primary: "#0A1628",
          mid: "#1B3A6B",
          edge: "var(--navy-edge)",
          shadow: "var(--navy-shadow)",
        },
        gold: {
          light: "#FFD700",
          core: "#DAA520",
          dark: "#B8860B",
        },
        whiteSoft: "var(--white-soft)",
      },
      fontFamily: {
        montserrat: ["Montserrat", "Arial", "sans-serif"],
        opensans: ["Open Sans", "Arial", "sans-serif"],
        lato: ["Lato", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)",
      },
    },
  },
  plugins: [],
};

export default config;