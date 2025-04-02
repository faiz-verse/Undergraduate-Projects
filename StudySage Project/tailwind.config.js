/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*",
  './public/**/*.html',
  './views/**/*.ejs',
  './semesters/**/*.ejs'
],
  theme: {
    extend: {
      fontFamily: {
        quickSand : ['Quicksand'],
        satisfy : ['Satisfy'],
        lobster : ['Lobster'],
        ysabeausc : ['Ysabeau SC'],
        roboto : ['Roboto']
      }
    },
  },
  plugins: [],
}

