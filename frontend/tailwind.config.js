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
          DEFAULT: '#4f46e5',
          hover: '#4338ca'
        },
        secondary: {
          DEFAULT: '#64748b',
          hover: '#475569'
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626'
        },
        background: '#f8fafc',
        card: '#ffffff',
        text: {
          DEFAULT: '#334155',
          muted: '#94a3b8'
        },
        border: '#e2e8f0',
      }
    },
  },
  plugins: [],
}
