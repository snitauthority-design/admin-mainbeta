import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xxs: '350px',
        xs: '480px',
      },
      colors: {
        primary: 'var(--color-primary, #4F46E5)',
        'primary-dark': 'var(--color-primary-dark, #4338CA)',
        secondary: 'var(--color-secondary, #7C3AED)',
        accent: 'var(--color-accent, #F59E0B)',
      },
      fontFamily: {
        sans: ['var(--font-family, "Inter")', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
