/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'tag-green', 'tag-amber', 'tag-red', 'tag-blue', 'tag-teal',
    'col-span-2', 'sm:col-span-2', 'lg:col-span-2',
    'space-y-1', 'space-y-4',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        forest: {
          900: '#071912',
          800: '#0d2218',
          700: '#143827',
          600: '#1a4e37',
        },
        accentAmber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
