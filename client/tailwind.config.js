module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'custom-bg': 'hsla(0, 0%, 0%, 0.3)',
        'custom-border': 'hsla(0, 0%, 0%, 0.2)',
        'custom-text': 'hsla(0, 0%, 100%, 0.5)',
        'button-bg': 'hsla(0, 0%, 80%, 1)',
        'button-text': 'hsla(0, 0%, 0%, 0.8)',
      },
      fontFamily: {
        roboto: ['"Roboto Mono"', '"Source Code Pro"', 'Menlo', 'Courier', 'monospace'],
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
