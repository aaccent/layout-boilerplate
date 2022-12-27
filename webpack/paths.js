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
	js: 'js',
	styles: 'styles',
	scripts: 'scripts',
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
		scripts: path.join(rootPaths.src, foldersNames.scripts),
		htmlParts: path.join(rootPaths.src, foldersNames.htmlParts),
		styles: path.join(rootPaths.src, foldersNames.styles)
	},
	dist: {
		/** Path of 'dist' folder */
		_: rootPaths.dist,
		img: path.join(rootPaths.dist, foldersNames.img),
		fonts: path.join(rootPaths.dist, foldersNames.fonts),
		scripts: path.join(rootPaths.dist, foldersNames.js),
		styles: path.join(rootPaths.dist, foldersNames.css),
	},
}

module.exports = { paths, filesNames, foldersNames }