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
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }, // Adjust this value to match the total width of your content
        },
      },
      animation: {
        letterReveal: 'letterReveal 0.5s ease forwards',
        scroll: 'scroll 20s linear infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          // Hexagon shape utility
          '.hexagon': {
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          },
          // Hide scrollbar utility
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
