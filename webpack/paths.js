const path = require('path')

const filesNames = {
	mainStyle: 'style',
	mainJS: 'main'
}

const foldersNames = {
	src: 'src',
	dist: 'dist',
	fonts: 'fonts',
	img: 'media',
	css: 'css',
	js: 'js',
	styles: 'styles',
	scripts: 'scripts',
	layout: 'layout',
	assets: 'assets',
	components: 'components',
	features: 'features',
	ui: 'ui',
	pages: 'pages',
	global: 'global',
}

const rootPaths = {
	src: path.join(process.cwd(), foldersNames.src),
	dist: path.join(process.cwd(), foldersNames.dist),
}

const paths = {
	src: {
		/** Path of 'src' folder */
		_: rootPaths.src,
		img: path.join(rootPaths.src, foldersNames.assets, foldersNames.img),
		fonts: path.join(rootPaths.src, foldersNames.assets, foldersNames.fonts),
		global: path.join(rootPaths.src, foldersNames.global),
		components: path.join(rootPaths.src, foldersNames.global, foldersNames.components),
		features: path.join(rootPaths.src, foldersNames.global, foldersNames.features),
		layout: path.join(rootPaths.src, foldersNames.global, foldersNames.layout),
		ui: path.join(rootPaths.src, foldersNames.global, foldersNames.ui),
		pages: path.join(rootPaths.src, foldersNames.pages),
		scripts: path.join(rootPaths.src, foldersNames.scripts),
		styles: path.join(rootPaths.src, foldersNames.styles),
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