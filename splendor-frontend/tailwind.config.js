/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      // that is animation class
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },

      // that is actual animation
      keyframes: theme => ({
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }),
    },
  },
  plugins: [],
}

