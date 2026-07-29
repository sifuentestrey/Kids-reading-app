/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Comic Neue"', '"Fredoka"', 'system-ui', 'sans-serif'],
        display: ['"Fredoka"', '"Comic Neue"', 'cursive', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      // Odd-numbered steps the room graphics size themselves with. Without
      // these, classes like w-30 / h-22 silently do nothing and the furniture
      // collapses to its intrinsic size.
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
      },
      borderWidth: {
        3: '3px',
      },
      scale: {
        102: '1.02',
        115: '1.15',
        120: '1.20',
      },
      zIndex: {
        42: '42',
        45: '45',
        60: '60',
        70: '70',
      },
      // Hard cartoon offset shadows for the neubrutalist HUD.
      boxShadow: {
        cartoon: '4px 4px 0 0 #451a03',
        'cartoon-lg': '6px 6px 0 0 #451a03',
        'cartoon-sm': '2px 2px 0 0 #451a03',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
        'bounce-subtle': 'bounce-subtle 2.4s ease-in-out infinite',
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
