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
        contrast2: "var(--contrast2)",
        navlink: "var(--navlink)",
        primary: "#0084ff",
        secondary: "#777777",
        success: "#399c39",
      },
      backgroundColor: {
        primary: "#0084ff",
        secondary: "#777777",
        success: "#399c39",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};