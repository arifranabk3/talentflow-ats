/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // TalentFlow Corporate Identity: Warm White, Deep Teal & Muted Emerald
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        // Deep Teal Executive Palette
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Muted Emerald & Sage Accents for Positive Talent Pipeline
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        // Corporate Brand Primary: Deep Teal / Forest & Warm Ivory Surfaces
        brand: {
          teal: '#0F766E',
          tealDark: '#134E4A',
          tealLight: '#F0FDFA',
          emerald: '#059669',
          emeraldLight: '#ECFDF5',
          accent: '#0D9488',
          warmWhite: '#FCFCFB',
          warmCard: '#FFFFFF',
          warmMuted: '#F4F5F2',
          border: '#E3E6DF',
          navy: '#0F172A',
          orange: '#0D9488', // Re-routed former orange classes to deep corporate teal
        },
        // Re-routed legacy navy classes to deep professional enterprise teal/slate
        navy: {
          950: '#042F2E',
          900: '#0B2625',
          850: '#0F3332',
          800: '#134E4A',
          700: '#115E59',
          600: '#0F766E',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(19, 78, 74, 0.04), 0 1px 2px -1px rgba(19, 78, 74, 0.04)',
        'soft-md': '0 4px 6px -1px rgba(19, 78, 74, 0.06), 0 2px 4px -2px rgba(19, 78, 74, 0.04)',
        'soft-lg': '0 10px 15px -3px rgba(19, 78, 74, 0.08), 0 4px 6px -4px rgba(19, 78, 74, 0.03)',
        'soft-xl': '0 20px 25px -5px rgba(19, 78, 74, 0.08), 0 8px 10px -6px rgba(19, 78, 74, 0.03)',
        'teal-glow': '0 0 20px -3px rgba(13, 148, 136, 0.25)',
      }
    },
  },
  plugins: [],
};
