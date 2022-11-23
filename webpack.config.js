const path = require('path')
const PugPlugin = require('pug-plugin')

const getEntry = require('./webpack/getEntry')
const { rootPaths, foldersNames } = require('./webpack/paths.js')

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const sourcePath = path.join(__dirname, 'src')

const keepPugFolderStructure = (pathData) => {
	const sourceFile = pathData.filename
	const relativeFile = path.relative(sourcePath, sourceFile)
	const { dir, name } = path.parse(relativeFile)
	return `${ dir }/${ name }[ext]`
}

module.exports = async (env) => {
	const entry = await getEntry([ rootPaths.src ])

	return {
		mode: env.WEBPACK_SERVE ? 'development' : 'production',
		entry: { ...entry },
		output: {
			path: rootPaths.dist,
			filename: ({ chunk }) => {
				return `${ foldersNames.js }/${ chunk.name.split('.')[0] }.bundle.js`
			},
			clean: true,
		},
		devtool: 'source-map',
		devServer: {
			static: {
				directory: rootPaths.src,
			},
			client: { progress: true },
		},
		resolve: {
			extensions: [ '.js', '.ts' ],
		},
		module: {
			rules: [
				{ test: /\.pug$/, loader: PugPlugin.loader },
				{ test: /\.(css|scss|sass)$/, use: [ 'css-loader', 'sass-loader' ] },
				{ test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
				{
					test: /\.(png|jpg|jpeg|ico|svg)/,
					type: 'asset/resource',
					generator: { filename: keepPugFolderStructure },
				},
				{
					test: /\.(woff|woff2)$/i,
					type: 'asset/resource',
					generator: { filename: keepPugFolderStructure },
				},
			],
		},
		plugins: [
			new PugPlugin({
				pretty: true,
				extractCss: {
					filename: `${ foldersNames.css }/[name].css`,
				},
			}),
		],
		optimization: {
			minimizer: [
				'...',
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