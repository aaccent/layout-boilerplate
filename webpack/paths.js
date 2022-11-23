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
}

const rootPaths = {
	src: path.join(process.cwd(), foldersNames.src),
	dist: path.join(process.cwd(), foldersNames.dist),
}

const paths = {
	src: {
		img: path.join(rootPaths.src, foldersNames.img),
		fonts: path.join(rootPaths.src, 'fonts'),
		js: path.join(rootPaths.src, 'js'),
		htmlParts: path.join(rootPaths.src, 'layout'),
	},
	dist: {
		img: path.join(rootPaths.dist, foldersNames.img),
		fonts: path.join(rootPaths.dist, 'fonts'),
		js: path.join(rootPaths.dist, 'js'),
	},
}

module.exports = { paths, rootPaths, filesNames, foldersNames }