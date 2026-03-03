module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        dark: '#1f2937',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
