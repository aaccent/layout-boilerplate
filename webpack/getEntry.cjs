const files = require('./files.cjs')
const { foldersNames } = require('./paths.cjs')

module.exports = async (pathsArr) => {
	const result = {}
	const ext = 'pug'

	const entries = files.getFilesWithExt(pathsArr, ext, true)

	for (const filepath of entries) {
		const filename = filepath.match(new RegExp(`/([\\w_-]+)\\.${ ext }`))[1]
		result[filename] = `./src/${ filename }.pug`
	}

	return result
}