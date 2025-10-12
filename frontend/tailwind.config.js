/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#717171',
          500: '#1c1a1b', // Couleur principale
          600: '#171516',
          700: '#121011',
          800: '#0d0b0c',
          900: '#080607',
        },
        secondary: {
          50: '#f6fff4',
          100: '#e8ffe3',
          200: '#d4ffc9',
          300: '#a8ff99', // Couleur secondaire/bouton
          400: '#8fff77',
          500: '#70ff55',
          600: '#4fcc33',
          700: '#3d9926',
          800: '#2d6619',
          900: '#1d330f',
        },
      },
    },
  },
  plugins: [],
}

