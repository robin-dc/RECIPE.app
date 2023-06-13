/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container:{
      center: true
    },
    extend: {
      colors:{
        brown: "#23180d",
        lightBrown: "#2d2013",
        navyBlue: "#152238"
      },
      spacing: {
        "1": "1rem",
        "1.5": "1.5rem",
        "2": "2rem",
        "2.5": "2.5rem",
        "3": "3rem",
        "3.5": "3.5rem",
        "4": "4rem",
        "4.5": "4.5rem",
        "5": "5rem",
        "5.5": "5.5rem",
        "6": "6rem",
        "7": "7rem",
        "8": "8rem",
        "9": "9rem",
        "10": "10rem",
        "11": "11rem",
        "12": "12rem",
        "13": "13rem",
        "14": "14rem",
        "15": "15rem",
        "16": "16rem",
        "17": "17rem",
        "18": "18rem",
        "19": "19rem",
        "20": "20rem",
      },
      fontSize:{
        xs: "0.6rem",
        sm: "0.8rem",
        base: "1rem",
        "2xl": "2rem",
        "3xl": "3rem",
        "4xl": "4rem",
        "5xl": "5rem",
        "6xl": "6rem",
        "7xl": "7rem",
        "8xl": "8rem",
        "9xl": "9rem",
        "10xl": "10rem",
        "11xl": "11rem",
        "12xl": "12rem",
        "13xl": "13rem",
        "14xl": "14rem",
        "15xl": "15rem",
      }
    },
  },
  plugins: [],
}
