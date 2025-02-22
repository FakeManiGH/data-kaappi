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
        contrast: "var(--contrast)",
        navlink: "var(--navlink)",
        primary: "#0084ff",
        secondary: "var(--secondary)",
        success: "#399c39",

      },
      backgroundColor: {
        primary: "#0084ff",
        linear: "linear-gradient(90deg, var(--background) 0%, var(--foreground) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};