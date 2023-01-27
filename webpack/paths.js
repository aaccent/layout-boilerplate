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
	htmlParts: 'layout',
	static: 'static',
	components: 'components',
	features: 'features',
	ui: 'ui',
	pages: 'pages',
}

const rootPaths = {
	src: path.join(process.cwd(), foldersNames.src),
	dist: path.join(process.cwd(), foldersNames.dist),
}

const paths = {
	src: {
		/** Path of 'src' folder */
		_: rootPaths.src,
		img: path.join(rootPaths.src, foldersNames.static, foldersNames.img),
		fonts: path.join(rootPaths.src, foldersNames.static, foldersNames.fonts),
		scripts: path.join(rootPaths.src, foldersNames.scripts),
		htmlParts: path.join(rootPaths.src, foldersNames.htmlParts),
		styles: path.join(rootPaths.src, foldersNames.styles),
		features: path.join(rootPaths.src, foldersNames.features),
		components: path.join(rootPaths.src, foldersNames.features),
		pages: path.join(rootPaths.src, foldersNames.pages),
		ui: path.join(rootPaths.src, foldersNames.ui),
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