/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

function asFontFamily(theme, key) {
  const v = theme(key);
  return Array.isArray(v) ? v.join(',') : String(v || '');
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4343E8",
        accent: "#8D79FF",
        secondary: "#ECAB64",
        neutral: {
          900: "#1E1D2A",
          800: "#19213D",
          700: "#2C2C3A",
          600: "#3A3A4F",
          500: "#7A7A8C",
          400: "#A3A3B9",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        dmsans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        h1: ['48px', { lineHeight: '120%', fontWeight: '600' }],
        h2: ['36px', { lineHeight: '130%', fontWeight: '500' }],
        h3: ['28px', { lineHeight: '130%', fontWeight: '500' }],
        body: ['16px', { lineHeight: '150%', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '140%', fontWeight: '400' }],
        button: ['16px', { lineHeight: '120%', fontWeight: '500' }],
        label: ['12px', { lineHeight: '120%', fontWeight: '500' }],
      },
      boxShadow: {
        card: "0 6px 24px rgba(0,0,0,0.08)",
        button: "0 8px 20px rgba(67,67,232,0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [
    typography,
    plugin(function ({ addBase, addComponents, theme }) {
      const ffInter = asFontFamily(theme, 'fontFamily.inter');
      const ffDMSans = asFontFamily(theme, 'fontFamily.dmsans');

      /* ---------- Base ---------- */
      addBase({
        'html, body, #root': { height: '100%' },
        body: {
          backgroundColor: theme('colors.neutral.900'),
          color: theme('colors.neutral.100'),
          fontFamily: ffInter,
          fontSize: theme('fontSize.body')[0],
          lineHeight: theme('fontSize.body')[1].lineHeight,
          fontWeight: theme('fontSize.body')[1].fontWeight,
        },
        h1: {
          fontFamily: ffDMSans,
          fontSize: theme('fontSize.h1')[0],
          lineHeight: theme('fontSize.h1')[1].lineHeight,
          fontWeight: theme('fontSize.h1')[1].fontWeight,
        },
        h2: {
          fontFamily: ffDMSans,
          fontSize: theme('fontSize.h2')[0],
          lineHeight: theme('fontSize.h2')[1].lineHeight,
          fontWeight: theme('fontSize.h2')[1].fontWeight,
        },
        h3: {
          fontFamily: ffDMSans,
          fontSize: theme('fontSize.h3')[0],
          lineHeight: theme('fontSize.h3')[1].lineHeight,
          fontWeight: theme('fontSize.h3')[1].fontWeight,
        },
        p: {
          fontSize: theme('fontSize.body')[0],
          lineHeight: theme('fontSize.body')[1].lineHeight,
          color: theme('colors.neutral.100'),
        },
      });

      /* ---------- Components ---------- */
      addComponents({
        /* Type helpers */
        '.caption': {
          fontFamily: ffInter,
          fontSize: theme('fontSize.caption')[0],
          lineHeight: theme('fontSize.caption')[1].lineHeight,
          fontWeight: theme('fontSize.caption')[1].fontWeight,
          color: theme('colors.neutral.300'),
        },
        '.label': {
          fontFamily: ffInter,
          fontSize: theme('fontSize.label')[0],
          lineHeight: theme('fontSize.label')[1].lineHeight,
          fontWeight: theme('fontSize.label')[1].fontWeight,
          letterSpacing: '0.02em',
          color: theme('colors.neutral.300'),
        },
        '.btn-text': {
          fontFamily: ffInter,
          fontSize: theme('fontSize.button')[0],
          lineHeight: theme('fontSize.button')[1].lineHeight,
          fontWeight: theme('fontSize.button')[1].fontWeight,
        },

        /* Buttons */
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          transition: 'all .2s ease',
          borderRadius: theme('borderRadius.2xl'),
          padding: '0.5rem 1rem',
          fontFamily: ffInter,
          fontSize: theme('fontSize.button')[0],
          lineHeight: theme('fontSize.button')[1].lineHeight,
          fontWeight: theme('fontSize.button')[1].fontWeight,
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary'),
          color: '#fff',
          boxShadow: theme('boxShadow.button'),
          transition: 'filter .2s ease',
        },
        '.btn-primary:hover': { filter: 'brightness(1.10)' },
        '.btn-primary:active': { filter: 'brightness(0.95)' },

        '.btn-secondary': {
          backgroundColor: theme('colors.secondary'),
          color: theme('colors.neutral.900'),
          boxShadow: '0 6px 16px rgba(236,171,100,0.25)',
          transition: 'filter .2s ease',
        },
        '.btn-secondary:hover': { filter: 'brightness(1.10)' },
        '.btn-secondary:active': { filter: 'brightness(0.95)' },

        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.primary'),
          transition: 'background-color .2s ease',
        },
        '.btn-ghost:hover': {
          backgroundColor: 'rgba(67,67,232,0.10)',
        },

        '.grad-cta': {
          backgroundImage: `linear-gradient(135deg, ${theme('colors.primary')} 0%, ${theme('colors.accent')} 100%)`,
          color: '#fff',
          boxShadow: theme('boxShadow.button'),
        },

        /* Inputs */
        '.input': {
          width: '100%',
          borderRadius: theme('borderRadius.xl'),
          background: theme('colors.neutral.800'),
          color: theme('colors.neutral.100'),
          border: `1px solid ${theme('colors.neutral.800')}`,
          padding: '0.5rem 0.75rem',
          outline: 'none',
        },
        '.input::placeholder': { color: theme('colors.neutral.300') },
        '.input:focus': {
          borderColor: theme('colors.primary'),
          boxShadow: `0 0 0 2px ${theme('colors.primary')}30`,
        },
        '.textarea': {
          width: '100%',
          borderRadius: theme('borderRadius.xl'),
          background: theme('colors.neutral.800'),
          color: theme('colors.neutral.100'),
          border: `1px solid ${theme('colors.neutral.800')}`,
          padding: '0.5rem 0.75rem',
          outline: 'none',
          minHeight: '120px',
        },
        '.select': {
          width: '100%',
          borderRadius: theme('borderRadius.xl'),
          background: theme('colors.neutral.800'),
          color: theme('colors.neutral.100'),
          border: `1px solid ${theme('colors.neutral.800')}`,
          padding: '0.5rem 0.75rem',
          outline: 'none',
          appearance: 'none',
        },

        /* Cards */
        '.card': {
          borderRadius: theme('borderRadius.2xl'),
          background: `${theme('colors.neutral.800')}99`,
          border: `1px solid ${theme('colors.neutral.800')}`,
          boxShadow: theme('boxShadow.card'),
        },
        '.card-body': { padding: '1.25rem' },
        '.card-title': {
          fontFamily: ffDMSans,
          fontWeight: 600,
          fontSize: '1.25rem',
          color: theme('colors.neutral.100'),
        },
        '.card-subtitle': {
          fontSize: '0.875rem',
          color: theme('colors.neutral.300'),
        },

        /* Tags / Labels */
        '.tag': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          borderRadius: '9999px',
          background: `${theme('colors.primary')}1A`,
          color: theme('colors.primary'),
          padding: '0.25rem 0.75rem',
          fontSize: theme('fontSize.label')[0],
          lineHeight: theme('fontSize.label')[1].lineHeight,
          fontWeight: theme('fontSize.label')[1].fontWeight,
        },

        /* Alerts */
        '.alert': {
          borderRadius: theme('borderRadius.xl'),
          padding: '1rem',
          border: `1px solid ${theme('colors.neutral.800')}`,
          background: theme('colors.neutral.900'),
        },
        '.alert-info': {
          borderColor: `${theme('colors.primary')}66`,
          background: `${theme('colors.primary')}1A`,
          color: theme('colors.primary'),
        },
        '.alert-warn': {
          borderColor: `${theme('colors.secondary')}66`,
          background: `${theme('colors.secondary')}1A`,
          color: theme('colors.secondary'),
        },
      });
    }),
  ],
};
