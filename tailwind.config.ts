/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0a',
          darker: '#050505',
          accent: '#e63946',
          gold: '#d4a843',
          gray: '#1a1a2e',
          light: '#f0f0f0',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
