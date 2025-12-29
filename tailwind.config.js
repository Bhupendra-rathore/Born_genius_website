/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E88E5',
          orange: '#FF9800',
          red: '#FF5252',
          green: '#4CAF50',
          sky: '#42A5F5',
          coral: '#FF6B6B',
        },
      },
    },
  },
  plugins: [],
};
