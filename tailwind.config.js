import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,vue,ts}"],
  theme: {
    extend: {}
  },
  plugins: [forms({ strategy: "class" })]
};
