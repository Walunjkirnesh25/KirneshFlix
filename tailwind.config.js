/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dusk: {
          950: '#080614',
          900: '#0f0a24',
          800: '#180e3c',
          700: '#22145a',
          600: '#2e1e78',
        },
        parchment: {
          50:  '#fffdf5',
          100: '#f7ead5',
          200: '#e0c89a',
          300: '#c4a462',
          400: '#8a7245',
        },
        lantern: {
          100: '#fff4d9',
          300: '#ffd166',
          500: '#f4a261',
          700: '#e76f51',
        },
        coral: '#ff6b6b',
        lagoon: {
          300: '#48cae4',
          500: '#06d6a0',
        },
      },
      fontFamily: {
        display: ['"Nunito"', '"Nunito Sans"', 'system-ui', 'sans-serif'],
        text:    ['"Nunito Sans"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glass:  '0 30px 80px -20px rgba(8,6,20,0.7), 0 0 0 1px rgba(255,255,255,0.07) inset',
        lift:   '0 20px 60px -15px rgba(8,6,20,0.8), 0 8px 24px -8px rgba(244,162,97,0.15)',
        glow:   '0 0 50px rgba(255,209,102,0.35)',
        lantern:'0 0 80px rgba(255,209,102,0.2), 0 0 30px rgba(244,162,97,0.15)',
        warm:   '0 25px 60px -12px rgba(231,111,81,0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite',
        'breathe':    'breathe 9s ease-in-out infinite',
        'rise':       'rise 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'bounce-in':  'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'twinkle':    'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%':     { transform: 'translate3d(0,-14px,0) scale(1.02)' },
        },
        breathe: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        rise: {
          '0%':   { opacity: '0', transform: 'translate3d(0,30px,0) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0) scale(1)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.2' },
          '50%':     { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
