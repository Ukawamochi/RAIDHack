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
          50: '#f0f1f5',
          100: '#d9dae8',
          200: '#b3b6d1',
          300: '#8d92bb',
          400: '#676ea4',
          500: '#363a51', // メインカラー
          600: '#2d3142',
          700: '#242733',
          800: '#1b1d24',
          900: '#121315',
          DEFAULT: '#363a51',
        },
        secondary: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          DEFAULT: '#a19f9f',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'noto': ['Noto Sans JP', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0,0,0,0.1)',
        'medium': '0 4px 12px rgba(0,0,0,0.15)',
        'strong': '0 8px 24px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '15': '3.75rem', // 60px
        '18': '4.5rem',  // 72px
        '21': '5.25rem', // 84px
        '42': '10.5rem', // 168px
        '66': '16.5rem', // 264px
        '76': '19rem',   // 304px
      },
      width: {
        'sidebar': '534px',
      }
    },
  },
  plugins: [],
}