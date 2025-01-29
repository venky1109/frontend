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
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fallBounce: {
          "0%": {
            transform: "translateY(-100%) rotateY(0deg) scale(0.8)",
            opacity: "1",
          },
          "50%": {
            transform: "translateY(calc(var(--banner-height, 100px) - 50px)) rotateY(180deg) scale(1.1)",
            opacity: "1",
          },
          "80%": {
            transform: "translateY(calc(var(--banner-height, 100px) - 10px)) rotateY(360deg) scale(1)",
            opacity: "1",
          },
          "90%": {
            transform: "translateY(calc(var(--banner-height, 100px) - 40px)) rotateY(270deg) scale(1.05)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(calc(var(--banner-height, 100px) - 10px)) rotateY(360deg) scale(1)",
            opacity: "0",
          },
        
        },
        flashZoom: {
          "0%, 100%": { opacity: 0, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1)" },
        },
      },
    
      animation: {
        letterReveal: 'letterReveal 0.5s ease forwards',
        scroll: 'scroll 20s linear infinite',
        shine: "shine 2s linear infinite",
        "fall-bounce": "fallBounce 8s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
        flashZoom: "flashZoom 5s ease-in-out infinite",
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
