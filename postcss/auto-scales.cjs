const {
  shorthandProps,
  longHandProps,
  allowedUnits,
  defaultOpts,
  targetProps,
} = require('./config.cjs')
const { AtRule, Container, Rule, Declaration } = require('postcss')

const targetPropsRegex = new RegExp(`(${targetProps.join('|')})`)

let globalOpts = { ...defaultOpts }

/** @type {{[index: string]: string}} */
const allVariablesValues = {}

/** @type {string[]} */
const fontVars = []

/**
 * @param {string} rawValue
 * @param {number} mod
 * @return {string}
 * */
function convertValue(rawValue, mod = 1) {
  const valueMatch = rawValue.match(/([\d.-]+)(\w+)/)
  if (!valueMatch) return rawValue

  const [ , value, unit ] = valueMatch
  if (value === '0' || value === '9999' || !value || !allowedUnits.includes(unit)) {
    return rawValue
  }

  return `calc(${value} * ${mod} * var(--screen-delta) + ${value}${unit})`
}

const cssVariableRegex = /var\((--[\w_-]+)\)/

/**
 * @param {import('postcss').Declaration} decl
 * @return {string | void}
 * */
function declHandler(decl) {
  if (!targetProps.includes(decl.prop)) return

  if (shorthandProps.includes(decl.prop)) {
    if (decl.value.startsWith('calc(')) return

    return decl.value.split(' ')
      .map((i) => convertValue(i, 1))
      .join(' ')
  }

  if (longHandProps.includes(decl.prop)) {
    return convertValue(decl.value, globalOpts.defaultMod)
  }

  if (decl.prop === 'font') {
    if (!cssVariableRegex.test(decl.value)) return
    const fontVariableName = decl.value.match(cssVariableRegex)[1]
    const fontSizeVariableName = allVariablesValues[fontVariableName]?.match(
      cssVariableRegex)[1]

    if (fontSizeVariableName && !fontVars.includes(fontSizeVariableName)) {
      fontVars.push(fontSizeVariableName)
    }
  }

  if (decl.prop === 'font-size') {
    if (cssVariableRegex.test(decl.value)) {
      fontVars.push(decl.value.match(cssVariableRegex)[1])
    } else {
      return convertValue(decl.value, globalOpts.fontSizeMod)
    }
  }
}

/**
 * @param {string} selector
 * */
function needDodgeSelector(selector) {
  return globalOpts.dodgeSelectors.some(rule => {
    switch (rule.type) {
      case 'includes':
        return selector.includes(rule.value)
      case 'startsWith':
        return selector.startsWith(rule.value)
    }
  })
}

/**
 * @param {string} media
 * @return {boolean}
 * */
function checkMediaRule(media) {
  const match = [ ...media.matchAll(/(?:max|min)-width:? (\d+)px/g) ]

  for (const matchItem of match) {
    if (
      Number(matchItem[1]) >= globalOpts.minMedia
      && Number(matchItem[1]) <= globalOpts.maxMedia
    ) {
      return true
    }
  }

  return false
}

/**
 * @property {Container} parent
 * @return {boolean}
 * */
function parentIsMedia(parent) {
  if (!(parent instanceof AtRule)) return false

  return (parent.type === 'atrule' && parent.name === 'media')
}

/** @property {Container} parent */
function checkParent(parent) {
  if (!globalOpts.skipMedia && 'maxMedia' in globalOpts || 'minMedia' in globalOpts) {
    return parentIsMedia(parent)
      ? checkMediaRule(parent.params)
      : true
  }

  return true
}

function createMedia() {
  return new AtRule({
    name: 'media',
    params: `only screen and (min-width: ${globalOpts.limitMediaWidth}px)`,
  })
}

/**
 * @property {Rule} rule
 * @property {import('postcss').root} root
 * @property {RegExp} declRegex
 * @return {void}
 * */
function limitRule(rule, root, declRegex) {
  const media = createMedia()

  const copyRule = new Rule({ selector: rule.selector })
  media.append(copyRule)

  rule.walkDecls(declRegex, (decl) => {
    if (decl.prev()?.type === 'comment' && decl.prev()?.text.includes('@skip-scaling')) {
      return decl.prev().remove()
    }

    const value = declHandler(decl)
    if (!value) return

    const declCopy = decl.clone()
    declCopy.value = value
    copyRule.append(declCopy)
  })

  if (copyRule.nodes?.length > 0) root.insertAfter(rule, media)
}

/**
 * @param {import('postcss').root} root
 * */
function pluginMain(root) {
  root.walkDecls(/^--/, decl => {
    allVariablesValues[decl.prop] = decl.value
  })

  const initRule = new Rule({ selector: ':root' })

  const initWidthUnitsDecl = new Declaration({
    prop: '--init-width_units',
    value: 'calc(var(--init-width) * 1px)',
  })

  const screenDeltaDecl = new Declaration({
    prop: '--screen-delta',
    value: 'calc((100vw - var(--init-width_units)) / (var(--init-width) / 100) / 100)',
  })

  const initWidthDecl = new Declaration({
    prop: '--init-width',
    value: `${globalOpts.initWidth[0].width}`,
  })

  initRule.append(initWidthDecl, initWidthUnitsDecl, screenDeltaDecl)
  root.prepend(initRule)

  globalOpts.initWidth.forEach(item => {
    const decl = new Declaration({
      prop: '--init-width',
      value: `${item.width}`,
    })

    if ('mediaQuery' in item) {
      const media = new AtRule({
        name: 'media',
        params: item.mediaQuery,
      })

      const rule = new Rule({ selector: ':root' })
      rule.append(decl)
      media.append(rule)
      root.insertAfter(initRule, media)
    }
  })

  root.walkRules(rule => {
    if (rule.prev()?.type === 'comment' && rule.prev()?.text.includes('@skip-scaling')) {
      return rule.prev().remove()
    }

    if (needDodgeSelector(rule.selector)) return
    if (!checkParent(rule.parent)) return

    if (globalOpts.limitMediaWidth && !parentIsMedia(rule.parent)) {
      return limitRule(rule, root, targetPropsRegex)
    }

    rule.walkDecls(targetPropsRegex, (decl) => {
      if (decl.prev()?.type === 'comment' && decl.prev()?.text.includes('@skip-scaling')) {
        return decl.prev().remove()
      }

      const value = declHandler(decl)
      if (value) decl.value = value
    })
  })

  if (fontVars.length === 0) return

  const media = createMedia()
  const rootRule = new Rule({ selector: ':root' })
  media.append(rootRule)

  root.walkDecls(new RegExp(`(${fontVars.join('|')})`), (decl) => {
    if (decl.prev()?.type === 'comment' && decl.prev()?.text.includes('@skip-scaling')) {
      return decl.prev().remove()
    }

    const rootParent = decl.parent.parent
    if (!checkParent(rootParent)) return

    decl.value = convertValue(decl.value, globalOpts.fontSizeMod)

    if (globalOpts.limitMediaWidth && !parentIsMedia(rootParent)) {
      rootRule.append(decl)
    }
  })

  if (rootRule.nodes?.length > 0) root.append(media)
}

/**
 * @type {import('postcss').PluginCreator<PluginParams>}
 * @param {PluginParams} opts
 * */
module.exports = (opts = {}) => {
  globalOpts = Object.assign(globalOpts, opts)

  return {
    postcssPlugin: 'auto-scales',
    Root(root) {
      pluginMain(root)
    },
  }
}

module.exports.postcss = true
