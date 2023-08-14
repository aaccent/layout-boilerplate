const autoScales = require('./postcss/auto-scales.cjs')

module.exports = {
  plugins: [
    autoScales({
      dodgeSelectors: [
        { type: 'startsWith', value: '.swiper' },
        { type: 'startsWith', value: '.carousel' },
        { type: 'includes', value: 'fancybox' },
        { type: 'includes', value: 'aos' },
      ],
      minMedia: 1201,
      limitMediaWidth: 1200,
      initWidth: [
        { width: 1700 },
        { width: 1440, mediaQuery: 'only screen and (max-width: 1700px)' },
      ],
    }),
  ],
}