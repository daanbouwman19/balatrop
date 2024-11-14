/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
    colors: {
      "text-color": "#FFFFFF",
      "background": "#000000",
      "ai-console-background": "#FF0000",
      "canvas-background": "#FF0000",
      "score-board-background": "#FFFF00",
      "score-board-background-dark": "#FFFFFFF",
      "score-board-enemy-background": "#000000",
      "score-board-current-score-background": "#000000",
      "score-board-current-multi-background": "#000000",
    },
    fontSize: {
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
    },
  },
  plugins: [],
}

