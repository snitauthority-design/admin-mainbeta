/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include admin-next store theme components so their Tailwind classes are generated
    '../../admin-next/src/components/store/**/*.{js,ts,jsx,tsx}',
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
