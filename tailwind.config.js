/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          550: '#ef4444',
          500: '#dc2626', // Premium Red Accent
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
          950: '#3b0707',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald accent
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        dark: {
          950: '#0b0f19', // Deep dark-blue backgrounds
          900: '#0f172a', // Slate backgrounds
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
        }
      },
      fontFamily: {
        sans: ['"Google Sans Flex"', 'Poppins', 'Inter', 'sans-serif'],
        display: ['"Google Sans Flex"', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.2), 0 0 10px rgba(220, 38, 38, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.6), 0 0 35px rgba(220, 38, 38, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
