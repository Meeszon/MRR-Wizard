/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3D5AF2',
        'primary-dark': '#2d47d9',
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8F8F8',
        title: '#23262F',
        body: '#5A5A5A',
        negative: '#E0515F',
        positive: '#67D7A3',
        highlight: '#FFC107',
        border: '#E0E0E0',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        display: ['24px', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['20px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['17px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['15px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['11px', { lineHeight: '1.4', fontWeight: '700', letterSpacing: '1.5px' }],
      },
      borderRadius: {
        btn: '5px',
        card: '10px',
      },
    },
  },
  plugins: [],
}
