/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#64FFDA',
        dark: '#0A0E1A',
        card: '#111827',
        border: '#1F2937',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #64FFDA33' },
          to: { boxShadow: '0 0 25px #64FFDA66' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark'],
  },
}
