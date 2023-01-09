const path = require('path')

const getEntry = require('./webpack/getEntry')
const { foldersNames, paths } = require('./webpack/paths.js')

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const sourcePath = path.join(__dirname, 'src')

const keepFolderStructure = (pathData) => {
	const sourceFile = pathData.filename
	const relativeFile = path.relative(sourcePath, sourceFile)
	const { dir, name } = path.parse(relativeFile)
	return `${ dir }/${ name }[ext]`
}

module.exports = async (env) => {
	const entry = await getEntry([ paths.src._ ])

	return {
		mode: env.WEBPACK_SERVE ? 'development' : 'production',
		entry: {
			index: './src/index.ejs',
		},
		output: {
			path: paths.dist._,
			filename: ({ chunk }) => {
				return `${ foldersNames.js }/${ chunk.name.split('.')[0] }.bundle.js`
			},
			clean: true,
		},
		devtool: 'source-map',
		devServer: {
			static: {
				directory: paths.src._,
			},
			client: { progress: true },
		},
		resolve: {
			extensions: [ '.js', '.ts' ],
			alias: {
				npm: path.resolve(process.cwd(), 'node_modules'),
				src: paths.src._,
				images: paths.src.img,
				scripts: paths.src.scripts,
				layout: paths.src.htmlParts,
				styles: paths.src.styles,
				fonts: paths.src.fonts,
			},
		},
		module: {
			rules: [
				{
					test: /\.ejs$/,
					use: [
						{ loader: 'html-loader' },
						{ loader: path.resolve('./webpack/ejs-loader-test.js') },
					],
				},
				{
					test: /\.css$/i,
					use: env.WEBPACK_SERVE ? [ 'css-loader', 'postcss-loader' ] : [ 'postcss-loader' ],
					type: 'asset/resource',
					generator: { filename: 'css/style[ext]' },
				},
				{ test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
				{
					test: /\.(png|jpg|jpeg|ico|svg)/,
					type: 'asset/resource',
					generator: { filename: keepFolderStructure },
				},
				{
					test: /\.(woff|woff2)$/i,
					type: 'asset/resource',
					generator: { filename: keepFolderStructure },
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: `!!${ path.resolve('./webpack/ejs-loader.js') }!./src/index.ejs`,
				filename: 'index.html',
				minify: false,
			}),
		],
		optimization: {
			minimizer: [
				new ImageMinimizerPlugin({
					generator: [
						{
							preset: 'webp',
							implementation: ImageMinimizerPlugin.sharpGenerate,
							options: {
								encodeOptions: {
									webp: {
										quality: 65,
									},
								},
							},
						},
					],
				}),
			],
		},
	}
}