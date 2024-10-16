/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
    color: {
      'lightIIM': '#FF571A',
      'IIM': '#FF6934',
      'darkIIM': '#FF8F67',
    },
  },
  plugins: [],
}

