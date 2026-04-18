import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211d',
        mint: '#2f9e7e',
        coral: '#e76652',
        paper: '#f7f7f2',
      },
      boxShadow: {
        soft: '0 12px 32px rgba(23, 33, 29, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
