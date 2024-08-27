module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
  ],
  theme: {
    extend: {
      keyframes: {
        letterReveal: {
          '0%': { opacity: 0, transform: 'translateY(100%)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        letterReveal: 'letterReveal 0.5s ease forwards',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none', /* IE and Edge */
            'scrollbar-width': 'none', /* Firefox */
          },
          '.scrollbar-hide::-webkit-scrollbar': {
            display: 'none', /* Chrome, Safari, and Opera */
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
};
