/** Design tokens: Guerrero night, Monad violet, orchard mango. */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#160B26", // Guerrero night sky: the base
        plum: "#2A1840", // raised surfaces
        violet: "#836EF9", // Monad
        mango: "#F2A541", // orchard fruit: the one warm accent
        bone: "#F3ECE2", // primary text
        mist: "#B9A9CF", // secondary text
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
