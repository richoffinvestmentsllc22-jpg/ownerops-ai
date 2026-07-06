import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        field: "#f4f6f8",
        line: "#d8e0e3",
        moss: "#26685c",
        clay: "#b45f43",
        gold: "#d4a52f",
        sky: "#2d8aa5",
        navy: "#102a43"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(23, 33, 43, 0.08)",
        lift: "0 18px 46px rgba(16, 42, 67, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
