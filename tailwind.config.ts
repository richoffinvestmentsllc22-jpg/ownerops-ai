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
        field: "#f6f7f2",
        line: "#d8ded5",
        moss: "#52715e",
        clay: "#b46b4e",
        gold: "#d3a84f",
        sky: "#6d99aa"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(23, 33, 43, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
