/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paradiso': {
          '50': '#f3faf8',
          '100': '#d7f0eb',
          '200': '#afe0d8',
          '300': '#7fc9bf',
          '400': '#54ada4',
          '500': '#3b948c',
          '600': '#2c756f',
          '700': '#275e5b',
          '800': '#234c4a',
          '900': '#21403f',
          '950': '#0e2524',
        },
      }
    },
  },
  plugins: [],
}
