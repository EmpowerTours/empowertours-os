/** Design tokens: black, bone and gold (the claudia.gallery look, with Earvin as the character). */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0A0908", // ink: the base
        plum: "#1A1815", // raised surfaces
        violet: "#B8862E", // deep gold: secondary accent
        mango: "#D9A441", // gold: the one accent
        gold2: "#F0C76A", // light gold for text on dark
        bone: "#F2ECE1", // primary text
        mist: "#A39C90", // secondary text
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
