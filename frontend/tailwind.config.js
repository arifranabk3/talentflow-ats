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
        navy: {
          950: '#070D18',
          900: '#0A1424',
          850: '#0E1C33',
          800: '#14284B',
          700: '#1D3B6C',
          600: '#2A5294',
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          elevated: '#F1F5F9',
          border: '#E2E8F0',
          dark: '#0F1A2E',
          darkCard: '#15243E',
          darkBorder: '#233757',
        },
        brand: {
          orange: '#F97316',
          orangeHover: '#EA580C',
          orangeLight: '#FFF7ED',
          orangeBorder: '#FDBA74',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          darkPrimary: '#F8FAFC',
          darkSecondary: '#94A3B8',
          darkMuted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'soft-md': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'soft-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        'glow-orange': '0 0 20px -3px rgba(249, 115, 22, 0.25)',
      }
    },
  },
  plugins: [],
};
