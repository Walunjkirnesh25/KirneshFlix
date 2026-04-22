/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0a0a0c',
          800: '#0e1014',
          700: '#14161c',
          600: '#1b1e27',
        },
        frost: {
          50:  '#f5f5f7',
          100: '#e8e8ed',
          200: '#c7c7cc',
          300: '#a1a1a6',
          400: '#6e6e73',
        },
        alpine: {
          100: '#dbeaff',
          300: '#9ec8ff',
          500: '#5fb4ff',
          700: '#2a7bd1',
        },
        ember: '#ff7a4d',
      },
      fontFamily: {
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        text:    ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
      boxShadow: {
        glass: '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset',
        lift:  '0 20px 50px -20px rgba(0,0,0,0.7)',
        glow:  '0 0 40px rgba(95,180,255,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite',
        'breathe':    'breathe 9s ease-in-out infinite',
        'rise':       'rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%':     { transform: 'translate3d(0,-12px,0) scale(1.02)' },
        },
        breathe: {
          '0%,100%': { opacity: '0.55' },
          '50%':     { opacity: '0.9' },
        },
        rise: {
          '0%':   { opacity: '0', transform: 'translate3d(0,24px,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
      },
    },
  },
  plugins: [],
}
