module.exports = {
  content: [
    "./pages/.{js,ts,jsx,tsx}",
    "./components/.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        muli: ["muli.regular", "sans-serif"],
        
      },
    },
  },
  plugins: [],
  purge: {
    enabled: true,
    content: [
      "./pages/.{js,ts,jsx,tsx}",
      "./components/.{js,ts,jsx,tsx}",
    ]
}
};