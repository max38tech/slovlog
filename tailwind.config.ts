import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slovenia: {
          blue: {
            DEFAULT: "#005DA4",
            dark: "#003A66",
            light: "#B3D7F1",
            50: "#F0F7FC",
            100: "#D9ECF8",
            200: "#B3D7F1",
            500: "#005DA4",
            600: "#004B85",
            700: "#003A66",
            900: "#002447",
          },
          green: {
            DEFAULT: "#2D6A4F",
            leaf: "#78A22F",
            lime: "#88B04B",
            50: "#F4F8F0",
            100: "#E5F0DA",
            500: "#78A22F",
            700: "#2D6A4F",
            800: "#1B4332",
          },
          red: {
            DEFAULT: "#C8102E",
            50: "#FEF2F2",
            500: "#C8102E",
            600: "#A80D26",
          },
          canvas: "#F8FAFC",
        },
      },
      fontFamily: {
        universa: ["var(--font-universa)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
