/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #2563eb)',
        'primary-dark': 'var(--color-primary-dark, #1d4ed8)',
        secondary: 'var(--color-secondary, #64748b)',
        accent: 'var(--color-accent, #f59e0b)',
      },
    },
  },
  plugins: [],
};
