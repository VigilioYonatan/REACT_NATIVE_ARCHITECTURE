/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: configure the path to all of your files
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
