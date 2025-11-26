export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        "transparent": "#00000000",
        "text-color": "#FFFFFF",
        "money-color": "#FFFF00",
        "offset-yellow": "#FFFFFF",
        "background": "#DDDDDD",
        "score-board-enemy-header-background": "#000000",
        "score-board-enemy-card-background": "#FFFF00",
        "score-board-background": "#DB092C",
        "score-board-background-dark": "transparent",
        "score-board-enemy-background": "#000000",
        "score-board-current-score-background": "#000000",
        "score-board-current-multi-background": "#000000",
      },
      // backgroundImage: {
      //   'pixel-background': "url('/images/pixel_background.jpg')",
      // }
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

