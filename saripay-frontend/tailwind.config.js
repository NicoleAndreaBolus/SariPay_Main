/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B1411",       // Obsidian dark green canvas theme preference
          card: "#12221D",     // Container matching palette
          accent: "#10B981",   // Vibrant action states
          muted: "#6B7280",    // Labels
          text: "#F3F4F6",     // Off-white text
        }
      },
    },
  },
  plugins: [],
};