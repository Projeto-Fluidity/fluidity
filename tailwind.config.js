import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        colors: {
          primary: "#4f46e5",

          /**
           * ========================================================
           * FLUIDITY BRAND
           * ========================================================
           *
           * Tokens oficiais da identidade visual.
           */
          brand: "#008236",
          brandLight: "#DCFCE7",
          brandSurface: "#F0FDF4",

          background: "#f8fafc",
          surface: "#ffffff",
          text: "#1e293b",

          error: "#FB2C36",
          success: "#008236",
        },

      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [forms],
};
