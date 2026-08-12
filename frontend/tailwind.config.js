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
          DEFAULT: '#1A6B4A',
          hover: '#228C61',
          light: '#E8F5F0',
        },
        accent: {
          DEFAULT: '#F9A825',
          light: '#FFF8E1',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#EFF6FF',
        },
        border: '#E5E7EB',
        surface: '#FFFFFF',
        pagebg: '#F4F6F8',
        textprimary: '#1A1A1A',
        textsecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}