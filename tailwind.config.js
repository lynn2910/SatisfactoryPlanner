/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        noto: ['"Noto sans"', "sans-serif"]
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}