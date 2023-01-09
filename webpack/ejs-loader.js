const loaderUtils = require('loader-utils')
const ejs = require('ejs')
const UglifyJS = require('uglify-js')
const path = require('path')

function throwError(message) {
	const error = new Error()
	error.name = 'ejs-loader'
	error.message = error.name + '\n\n' + message + '\n'
	error.stack = false
	console.error(error)
}

module.exports = function (source) {
	const options = loaderUtils.getOptions(this) || {}

	if (!this.webpack) {
		throwError('This loader is only usable with webpack')
	}

	this.cacheable(true)

	options.client = true
	options.filename = path.relative(process.cwd(), this.resourcePath)

	let template = ejs.compile(source, options)

	return 'module.exports = ' + template
}