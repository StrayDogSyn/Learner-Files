/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './projects/**/*.{html,js}',
    './html/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'hunter': '#3A3F',
        'background': 'hsla(140, 85%, 2.75%, .7)',
      },
      fontFamily: {
        'sans': ['Verdana', 'Arial', 'Helvetica', 'sans-serif'],
        'serif': ['Hoefler Text', 'Baskerville', 'Palatino Linotype', 'serif'],
        'mono': ['Fira Mono', 'Liberation Mono', 'Monaco', 'monospace'],
        'fancy': ['Papyrus', 'Herculanum', 'Party LET', 'fantasy']
      },
      boxShadow: {
        'custom': '10px 5px 5px hsla(120, 100%, 0%, 1)'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}