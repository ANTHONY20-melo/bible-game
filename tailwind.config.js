/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faeddb',
          200: '#f4d7b6',
          300: '#edbc87',
          400: '#e49a56',
          500: '#dd7f34',
          600: '#ce6629',
          700: '#ab4e24',
          800: '#893f24',
          900: '#6f3520',
        },
      },
    },
  },
  plugins: [],
};
