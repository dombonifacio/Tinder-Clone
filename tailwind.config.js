/** @type {import('tailwindcss').Config} */


export default {
  content: [
   "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        electric: {
          pink: "#FD2978"
        },
        fiery: {
          rose: "#FF5864"
        },
        pastel: {
          red: "#FF655B"
        }
      }
    },
    fontFamily: {
      signature: ["Lobster"]
    }
  },
  plugins: [],
}

