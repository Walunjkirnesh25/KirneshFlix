/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#e50914',
        'netflix-dark': '#141414',
        'netflix-gray': '#808080',
      },
      fontFamily: {
        'netflix': ['Netflix Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #e50914, 0 0 10px #e50914, 0 0 15px #e50914' },
          '100%': { textShadow: '0 0 10px #e50914, 0 0 20px #e50914, 0 0 30px #e50914' },
        },
      },
    },
  },
  plugins: [],
}
