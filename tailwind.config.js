/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#fdfbf7',
          50: '#ffffff',
          100: '#fdfbf7',
          200: '#f4ede4',
          300: '#e8dbce',
          400: '#d9c5b2',
          500: '#c6a992',
          600: '#b8947b',
          700: '#9a7660',
          800: '#806454',
          900: '#675246',
        },
        charcoal: {
          DEFAULT: '#2c2925',
          light: '#423f3b',
          dark: '#1a1815'
        },
        terracotta: {
          DEFAULT: '#c25e4c',
          light: '#d47867',
          dark: '#9c4535'
        },
        sage: {
          DEFAULT: '#7a8b75',
          light: '#94a48f',
          dark: '#5d6d59'
        },
        gold: {
          DEFAULT: '#d4af37',
          muted: '#bda04a'
        },
        saffron: {
          DEFAULT: '#FF671F',
          light: '#FFA040',
          dark: '#E65100',
          50: '#FFF8F0',
          100: '#FFEDD5',
          200: '#FED7AA',
          500: '#FF671F',
          600: '#E65100',
          700: '#C2410C',
        },
        indiagreen: {
          DEFAULT: '#046A38',
          light: '#138808',
          dark: '#03542C',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#138808',
          600: '#046A38',
          700: '#03542C',
        },
        ashokablue: {
          DEFAULT: '#000080',
          light: '#1E40AF',
          dark: '#0B192C',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#1D4ED8',
          600: '#000080',
          800: '#0B192C',
          900: '#060D17',
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5EFE6',
          300: '#EFE8DF',
        },
        navy: {
          DEFAULT: '#0B192C',
          light: '#1E293B',
          dark: '#020617',
          muted: '#334155',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
