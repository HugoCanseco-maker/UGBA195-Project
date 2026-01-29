import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bloomberg: {
          black: "#0d0d0d",
          dark: "#1a1a1a",
          panel: "#242424",
          border: "#333333",
          muted: "#666666",
          green: "#00ff88",
          red: "#ff4444",
          amber: "#ffaa00",
          blue: "#00aaff",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
