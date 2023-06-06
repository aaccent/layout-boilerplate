const path = require('path')
const PugPlugin = require('pug-plugin')

const getEntry = require('./webpack/getEntry')
const { foldersNames, paths } = require('./webpack/paths.js')

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const sourcePath = path.join(__dirname, 'src')

const keepPugFolderStructure = (pathData) => {
	const sourceFile = pathData.filename
	const relativeFile = path.relative(sourcePath, sourceFile)
	const { dir, name } = path.parse(relativeFile)
	return `${ dir.replace('assets\\', '') }/${ name }[ext]`
}

module.exports = async (env) => {
	const entry = await getEntry([ paths.src.pages ])

	return {
		mode: env.WEBPACK_SERVE ? 'development' : 'production',
		entry: { ...entry },
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
				src: paths.src._,
				npm: path.resolve(process.cwd(), 'node_modules'),
				media: paths.src.img,
				fonts: paths.src.fonts,
				global: paths.src.global,
				components: paths.src.components,
				features: paths.src.features,
				layout: paths.src.layout,
				ui: paths.src.ui,
				styles: paths.src.styles,
				scripts: paths.src.scripts,
				pages: paths.src.pages,
			},
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
				{
					test: /\.(webm|mp4)$/i,
					type: 'asset/resource',
					generator: { filename: keepPugFolderStructure },
				}
			],
		},
		plugins: [
			new PugPlugin({
				pretty: true,
				css: {
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
										quality: 80,
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