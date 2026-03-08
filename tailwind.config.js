import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /**
       * Tokens temporários de design.
       * Estes valores podem ser ajustados após a
       * definição oficial do design pelo time de UX.
       */
      colors: {
        primary: "#4f46e5",
        background: "#f8fafc",
        surface: "#ffffff",
        text: "#1e293b",
      },

      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [forms],
};
