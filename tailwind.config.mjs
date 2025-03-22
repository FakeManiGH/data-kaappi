/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        linear: "var(--linear)",
        contrast: "var(--contrast)",
        navlink: "var(--navlink)",
        primary: "#006ecf",
        secondary: "var(--secondary)",
        success: "#399c39",

      },
      backgroundColor: {
        primary: "#006ecf",
        linear: "linear-gradient(90deg, var(--background) 0%, var(--foreground) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};