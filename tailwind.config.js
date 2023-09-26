/** @type {import('tailwindcss').Config} */

import forms from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{html,js,vue,ts}"],
  theme: {
    extend: {}
  },
  plugins: [forms({ strategy: "class" })]
};
