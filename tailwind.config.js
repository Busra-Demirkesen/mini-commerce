/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // dark mode class-based kontrol için
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
