const files = require('./files')
const { foldersNames } = require('./paths')

module.exports = async (pathsArr) => {
	const result = {}
	const ext = 'pug'

	const entries = files.getFilesWithExt(pathsArr, ext)

	for (const filepath of entries) {
		const filename = filepath.match(new RegExp(`${ foldersNames.src }/(.*)\.${ ext }`))[1]
		result[filename] = `./src/${ filename }.pug`
	}

	return result
}