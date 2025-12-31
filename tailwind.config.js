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
      // ✅ ADD: Animations for install banner
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
