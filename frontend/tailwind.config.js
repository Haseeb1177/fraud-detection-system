/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        card: "rgba(20, 20, 30, 0.6)",
        primary: "#00E5FF", // Neon cyan
        secondary: "#B026FF", // Purple accent
        danger: "#FF2A2A", // Red alert
        safe: "#00FF66", // Green safe
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
