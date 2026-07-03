import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        blush: "#FFE8EC",
        mint: "#E8F5E9",
        sand: "#FFF3E0",
        lavender: "#F3E5F5",
        sky: "#E3F2FD",
        peach: "#FFE0B2",
        accent: {
          DEFAULT: "#D9534F",
          dark: "#B43E3A",
          light: "#FADBD8",
        },
        ink: "#2D1F1F",
        muted: "#6B5E5E",
        brand: {
          DEFAULT: "#D9534F",
          dark: "#B43E3A",
          light: "#FADBD8",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(45, 31, 31, 0.05), 0 1px 2px rgba(45, 31, 31, 0.04)",
        soft: "0 4px 12px rgba(45, 31, 31, 0.05)",
        float: "0 8px 24px rgba(45, 31, 31, 0.06)",
        phone: "0 0 30px rgba(45, 31, 31, 0.05)",
        inner: "inset 0 2px 4px rgba(45, 31, 31, 0.03)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
        "4xl": "40px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        "site": "1120px",
      },
    },
  },
  plugins: [],
};
export default config;
