// tailwind.config.js
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your file structure
  ],
  theme: {
    extend: {
      colors: {
        background:'#F4F7FE',
        hover:'#8A33FD',
        navtext:'#9197B3',
        lightBg: '#F4F7FE',
        cards :'#252525',
        blue: {
          600: '#7B76F1',
          200:'#5954E4', // Replace the default blue-600 color
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sans: ['Plus Jakarta Sans', 'sans-serif'] // Add Poppins font
      },
    },
  },
  plugins: [],
};

