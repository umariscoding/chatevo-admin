/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },

        accent: {
          50: "#faf6f0",
          100: "#f0e6d4",
          200: "#e2ceaa",
          300: "#d4b888",
          400: "#c4a882",
          500: "#b0926a",
          600: "#9a7d56",
          700: "#7d6544",
          800: "#5e4c34",
          900: "#3e3222",
        },

        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },

        text: {
          primary: "#0f172a",
          secondary: "#475569",
          tertiary: "#94a3b8",
          placeholder: "#cbd5e1",
          white: "#ffffff",
          muted: "#64748b",
        },

        bg: {
          primary: "#ffffff",
          secondary: "#f8fafa",
          tertiary: "#f0f5f4",
          dark: "#0E1515",
          darker: "#080e0e",
        },

        border: {
          light: "#e2e8f0",
          medium: "#cbd5e1",
          dark: "#94a3b8",
        },

        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },

        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },

        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },

        sidebar: {
          bg: "#0E1515",
          hover: "#1A2424",
          active: "#253333",
          border: "#1A2424",
          text: "#b8ccc8",
          "text-hover": "#e0edea",
          "text-active": "#ffffff",
          "text-muted": "#5e7a74",
        },

        chart: {
          grid: "#e2e8f0",
          axis: "#64748b",
          tooltip: "#ffffff",
          tooltipText: "#0f172a",
          shadow: "rgba(13, 148, 136, 0.1)",
          primary: "#0d9488",
          accent: "#c4a882",
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(13, 148, 136, 0.15)',
        'glow-lg': '0 0 40px rgba(13, 148, 136, 0.2)',
      },
    },
  },
  plugins: [],
};
