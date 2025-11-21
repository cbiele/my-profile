/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdfcfb',
          100: '#f5f2eb', // Main Background
          200: '#e7e2d5', // Secondary / Borders
          900: '#44403c', // Text
        },
        terracotta: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#c2410c', // Muted Rust
          600: '#9a3412', // Darker Rust
          900: '#7c2d12'
        },
        turquoise: {
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          500: '#0d9488', // Muted Teal
          600: '#0f766e',
          700: '#0f766e'
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}