/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      screens: {
        'xs': '414px' // Add your custom breakpoint
      }
    },
  plugins: [],
}

