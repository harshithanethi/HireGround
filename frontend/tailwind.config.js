/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dc2626', // Red
          hover: '#b91c1c',
        },
        secondary: {
          DEFAULT: '#d97706', // Amber
          hover: '#b45309',
        },
        positive: '#059669', // Emerald
        navy: '#04050f', // Legacy just in case
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}