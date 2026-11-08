/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Cairo',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Al Fouad Pharmacies - Signature Medical Crimson & Charcoal Palette
        brand: {
          50: '#fff5f5',
          100: '#ffe2e4',
          200: '#ffc9cc',
          300: '#ffa1a6',
          400: '#f8666f',
          500: '#f02d37',
          600: '#ec1e28', // Official Al Fouad Pharmacies primary crimson red
          700: '#c7141e',
          800: '#a1141c',
          900: '#7f1319',
          950: '#0d1114', // Official Al Fouad charcoal black
        },
        fouad: {
          red: '#ec1e28',
          dark: '#0d1114',
          surface: '#151b21',
          slate: '#242d35',
        },
        whatsapp: {
          light: '#dcf8c6',
          green: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          bg: '#EFEAE2',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 15px -3px rgba(236, 30, 40, 0.25)',
      }
    },
  },
  plugins: [],
}
