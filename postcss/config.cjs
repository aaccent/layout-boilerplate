/**  @type {Array<keyof import('CSS').StandardShorthandProperties>}*/
const shorthandProps = [
  'padding',
  'margin',
  'inset',
  'border-radius',
  'border-width',
  'gap',
  'grid-template-columns',
]

/**  @type {Array<keyof import('CSS').StandardLonghandProperties>}*/
const longHandProps = [
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'top',
  'right',
  'bottom',
  'left',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  '-moz-column-gap',
  'column-gap',
  'row-gap',
]

const targetProps = [ ...shorthandProps, ...longHandProps, 'font', 'font-size' ]

const allowedUnits = [ 'rem', 'px' ]

/** @typedef {'startsWith' | 'includes'} RuleCheckType */

/** @typedef {{type: RuleCheckType, value: string}} RuleCheck */

/**
 * @typedef InitWidthItem
 * @type {object}
 * @property {number} width
 * @property {string} [mediaQuery]
 * */

/**
 * @typedef PluginParams
 * @type {object}
 * @property {Array<RuleCheck>} [dodgeSelectors=[]] - selectors for exclude from processing
 * @property {number} [fontSizeMod=4] - modification value for font sizes
 * @property {number} [defaultMod=1] - modification value for other properties
 * @property {number} [maxMedia=9999] - max media value for include in processing
 * @property {number} [minMedia=0] - min media value for include in processing
 * @property {boolean} [skipMedia=false] - skip declarations in media queries
 * @property {number} [limitMediaWidth] - limit media for styles without own media
 * @property {Array<InitWidthItem>} [initWidth=[{width:1920}]] - array with init width values
 * */

/** @type {PluginParams} */
let defaultOpts = {
  dodgeSelectors: [],
  fontSizeMod: 4,
  defaultMod: 1,
  maxMedia: 9999,
  minMedia: 0,
  initWidth: [
    { width: 1920 },
  ],
}

module.exports = {
  shorthandProps,
  longHandProps,
  targetProps,
  allowedUnits,
  defaultOpts,
}