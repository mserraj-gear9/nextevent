import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#059467',
        secondary: {
          blue: '#2563EB',
          purple: '#7C3AED',
          amber: '#D97706',
          red: '#DC2626',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#08090E',
        },
        bg: {
          light: '#F4F5F8',
          dark: '#050709',
        },
      },
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['42px', { lineHeight: '1.2' }],
        h1: ['28px', { lineHeight: '1.3' }],
        h2: ['20px', { lineHeight: '1.4' }],
        h3: ['16px', { lineHeight: '1.4' }],
        body: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
