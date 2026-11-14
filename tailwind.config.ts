import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mathra: {
          black: '#07040f',
          ink: '#0d0718',
          purple: '#2a0f4a',
          violet: '#7c3aed',
          blue: '#3b82f6',
          gold: '#e5b84b',
          mist: '#c8bde0',
        },
      },
      fontFamily: {
        sinhala: ['var(--font-sinhala)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '18px',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(229,184,75,0.25)' },
          '50%': { boxShadow: '0 0 48px rgba(229,184,75,0.55)' },
        },
      },
      animation: {
        'float-y': 'floatY 7s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
