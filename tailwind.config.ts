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
        cream: "#FFF9F5",
        blush: "#FFE8EC",
        mint: "#E8F5E9",
        sand: "#FFF3E0",
        lavender: "#F3E5F5",
        sky: "#E3F2FD",
        peach: "#FFE0B2",
        accent: {
          DEFAULT: "#17937e",
          dark: "#0f6b58",
          light: "#b3e3d6",
        },
        ink: "#000000",
        muted: "#6b7280",
        brand: {
          DEFAULT: "#17937e",
          dark: "#0f6b58",
          light: "#b3e3d6",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(93, 64, 55, 0.06)",
        soft: "0 8px 30px rgba(93, 64, 55, 0.05)",
        float: "0 12px 40px rgba(93, 64, 55, 0.08)",
        phone: "0 0 30px rgba(93, 64, 55, 0.06)",
        inner: "inset 0 2px 8px rgba(93, 64, 55, 0.04)",
      },
      borderRadius: {
        xl: "18px",
        "2xl": "28px",
        "3xl": "36px",
        "4xl": "48px",
      },
    },
  },
  plugins: [],
};
export default config;
