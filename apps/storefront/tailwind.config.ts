import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include admin-next store theme components so their classes are detected
    '../../admin-next/src/components/store/**/*.{js,ts,jsx,tsx}',
    '../../admin-next/src/views/StoreHome.tsx',
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

export default config;
