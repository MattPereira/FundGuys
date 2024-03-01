/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#3b2e2a",
          "primary-content": "#EDF2F7",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#2b79a2",
          "accent-content": "#fff",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#ffffff",
          "base-300": "#e0e0da",
          "base-content": "#3b2e2a",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#EDF2F7",
          "primary-content": "#040407",
          secondary: "#323f61",
          "secondary-content": "#F9FBFF",
          accent: "#16a34a",
          "accent-content": "#EDF2F7",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#1f1f1f",
          "base-200": "#1c1c1d",
          "base-300": "#040407",
          "base-content": "#F9FBFF",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "hsl(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["didact gothic", "sans-serif"], // changes default font to didact gothic
        cubano: ["cubano", "sans-serif"],
        gothic: ["didact gothic", "sans-serif"],
        inter: ["inter", "sans-serif"],
        chewy: ["chewy", "sans-serif"],
        madimi: ["Madimi One", "sans-serif"],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
