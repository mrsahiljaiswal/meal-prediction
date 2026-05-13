/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#7b535c",
        tertiary: "#4d616d",
        "on-surface": "#1b1c1a",
        "on-surface-variant": "#424842",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3ef",
        "surface-container": "#efeeea",
        "surface-container-high": "#eae8e4",
        "surface-container-highest": "#e4e2de",
        "outline-variant": "#c2c8c0",
        background: "#fbf9f5",
        primary: "#4a654e",
        "on-primary": "#ffffff",
        "primary-container": "#8ba88e",
        "on-primary-container": "#233d29",
        "primary-fixed": "#cceace",
        "primary-fixed-dim": "#b0ceb2",
        "on-primary-fixed": "#07200f",
        "on-primary-fixed-variant": "#334d38",
        "secondary-container": "#fecad4",
        "on-secondary-container": "#7a525b",
        "tertiary-fixed": "#d0e6f4",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        serif: ["Libre Caslon Text", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(74, 101, 78, 0.16)",
        lift: "0 20px 50px -24px rgba(74, 101, 78, 0.28)",
      },
    },
  },
  plugins: [],
};
