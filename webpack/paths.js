const path = require('path')

const filesNames = {
	mainStyle: 'style',
	mainJS: 'main'
}

const foldersNames = {
	fonts: 'fonts',
	img: 'images',
	src: 'src',
	dist: 'dist',
	css: 'css',
	scss: 'scss',
	js: 'js',
	htmlParts: 'layout'
}

const rootPaths = {
	src: path.join(process.cwd(), foldersNames.src),
	dist: path.join(process.cwd(), foldersNames.dist),
}

const paths = {
	src: {
		/** Path of 'src' folder */
		_: rootPaths.src,
		img: path.join(rootPaths.src, foldersNames.img),
		fonts: path.join(rootPaths.src, foldersNames.fonts),
		js: path.join(rootPaths.src, foldersNames.js),
		htmlParts: path.join(rootPaths.src, foldersNames.htmlParts),
		scss: path.join(rootPaths.src, foldersNames.scss)
	},
	dist: {
		/** Path of 'dist' folder */
		_: rootPaths.dist,
		img: path.join(rootPaths.dist, foldersNames.img),
		fonts: path.join(rootPaths.dist, foldersNames.fonts),
		js: path.join(rootPaths.dist, foldersNames.js),
	},
}

module.exports = { paths, filesNames, foldersNames }