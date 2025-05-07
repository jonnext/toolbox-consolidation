/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        suisse: ["Suisse Neue", "sans-serif"],
        fk: ["FK Grotesk Neue", "sans-serif"],
      },
      keyframes: {
        spring: {
          "0%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        spring: "spring 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
