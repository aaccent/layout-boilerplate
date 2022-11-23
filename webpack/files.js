const fs = require('fs')
const path = require('node:path')

function getDirItems(dir) {
	return fs.readdirSync(dir)
}

function isDirectory(path) {
	return fs.lstatSync(path).isDirectory()
}

const pathStartRegexp = new RegExp('((\\./)|([A-Z]:))')

function convertPaths(arrPaths) {
	return arrPaths.map(path => {
		let result = path
		result = result.replaceAll('\\', '/')

		if (pathStartRegexp.test(result)) return result

		return './' + result
	})
}

function getFilesWithExt(arrPaths, ext) {
	const result = []
	arrPaths.forEach(p => {
		const regex = new RegExp(`\\.${ext}$`)
		const arrItems = getDirItems(p)

		arrItems.forEach(fileName => {
			const pathString = path.join(p, fileName)

			if (isDirectory(pathString)) return

			if (regex.test(fileName)) result.push(pathString)
		})
	})

	return convertPaths(result)
}

module.exports = { isDirectory }
module.exports = { getFilesWithExt }