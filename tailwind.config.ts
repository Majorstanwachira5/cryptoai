import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0E11",
        surface: "#181A20",
        surfaceElevated: "#1E2329",
        surfaceHover: "#2B313A",
        borderDark: "#2B313A",
        borderSubtle: "#23272E",
        bull: {
          DEFAULT: "#0ECB81",
          hover: "#03A66D",
          dim: "rgba(14, 203, 129, 0.12)",
        },
        bear: {
          DEFAULT: "#F6465D",
          hover: "#CF304A",
          dim: "rgba(246, 70, 93, 0.12)",
        },
        gold: {
          DEFAULT: "#F0B90B",
          hover: "#FCD535",
          dim: "rgba(240, 185, 11, 0.15)",
        },
        cryptoText: {
          primary: "#EAECEF",
          secondary: "#848E9C",
          muted: "#5E6673",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "Consolas",
          '"Liberation Mono"',
          "Menlo",
          "Courier",
          "monospace",
        ],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      boxShadow: {
        dropdown: "0 8px 24px rgba(0, 0, 0, 0.5)",
        card: "0 2px 10px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
