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
        // Brand colors
        primary: {
          DEFAULT: "#1A1A1A",
          light: "#333333",
        },
        accent: "#2D4A3E",
        // Functional colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#6B7280",
        // Neutral colors
        bg: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
          tertiary: "#F3F4F6",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
        },
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.2" }],
        "h1-mobile": ["32px", { lineHeight: "1.2" }],
        h2: ["32px", { lineHeight: "1.3" }],
        "h2-mobile": ["24px", { lineHeight: "1.3" }],
        h3: ["20px", { lineHeight: "1.4" }],
        "h3-mobile": ["18px", { lineHeight: "1.4" }],
        body: ["16px", { lineHeight: "1.6" }],
        "body-mobile": ["14px", { lineHeight: "1.6" }],
        small: ["14px", { lineHeight: "1.5" }],
        "small-mobile": ["12px", { lineHeight: "1.5" }],
        caption: ["12px", { lineHeight: "1.4" }],
        "caption-mobile": ["11px", { lineHeight: "1.4" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px -1px rgba(0,0,0,0.1)",
        lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
        xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
        fast: "200ms",
        normal: "250ms",
      },
    },
  },
  plugins: [],
};
export default config;
