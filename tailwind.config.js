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
        brand: {
          50: '#fef2f2',
          100: '#ffe1e2',
          200: '#ffc8cb',
          300: '#ffa1a6',
          400: '#fa6871',
          500: '#f23742',
          600: '#ec1e28', // Official Al Fouad Pharmacies signature red
          700: '#c8101a',
          800: '#a51119',
          900: '#89131a',
          950: '#0d1114', // Official Al Fouad charcoal black
        },
        fouad: {
          red: '#ec1e28',
          dark: '#0d1114',
          gray: '#2b3035',
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
      }
    },
  },
  plugins: [],
}
