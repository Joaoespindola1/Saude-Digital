/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg_bege: '#F4F2EE',
        bg_azul_escuro: '#0073B1'
      },
    },
  },
  plugins: [],
}

