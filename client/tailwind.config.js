/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        "primary-dull": "#4A8DFF",

        borderColor: "#E5E7EB",
        light: "#F9FAFB",
        grey: "#F3F4F6",
        "border-color": "#d1d5db",
      },
    },
  },
  plugins: [],
  extend: {
  colors: {
    // example
  },
}

};
