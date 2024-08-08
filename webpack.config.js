import path from 'path'
import PugPlugin from 'pug-plugin'
import { getEntry } from './webpack/getEntry.js'
import { FOLDER_NAMES, PATHS } from './webpack/paths.js'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import sharp from 'sharp'

const sourcePath = path.join(process.cwd(), 'src')

const keepPugFolderStructure = (pathData, replacer = '') => {
    const sourceFile = pathData.filename
    const relativeFile = path.relative(sourcePath, sourceFile)
    const { dir, name } = path.parse(relativeFile)

    return `${dir.replace('assets', replacer)}/${name}[ext]`
}

const keepPugFolderStructureForMedia = (pathData) => keepPugFolderStructure(pathData, 'media')
const keepPugFolderStructureForFonts = (pathData) => keepPugFolderStructure(pathData, '')

const pagesRegex = /[\\/]pages[\\/]([\w_-]+)[\\/]/

export default async function () {
    const entry = await getEntry(PATHS.SRC.PAGES)
    const isDev = process.env.NODE_ENV === 'development'

    return {
        mode: isDev ? 'development' : 'production',
        entry: { ...entry },
        output: {
            path: PATHS.BUILD._,
            filename: (pathData) => {
                if (pagesRegex.test(pathData.filename)) {
                    const pageName = pathData.filename.match(pagesRegex)[1]
                    return `${FOLDER_NAMES.SCRIPTS.BUILD}/${pageName}.bundle.js`
                }

                const { chunk } = pathData
                return `${FOLDER_NAMES.SCRIPTS.BUILD}/${chunk.name.split('.')[0]}.bundle.js`
            },
            clean: true,
        },
        devtool: 'source-map',
        devServer: {
            static: {
                directory: PATHS.SRC._,
            },
            client: { progress: true },
        },
        resolve: {
            extensions: ['.js', '.ts'],
            alias: {
                '@': PATHS.SRC._,
                npm: path.resolve(process.cwd(), 'node_modules'),
                assets: PATHS.SRC.ASSETS,
                globals: PATHS.SRC.GLOBALS,
                components: PATHS.SRC.COMPONENTS,
                features: PATHS.SRC.FEATURES,
                layout: PATHS.SRC.LAYOUT,
                ui: PATHS.SRC.UI,
                styles: PATHS.SRC.STYLES,
                scripts: PATHS.SRC.SCRIPTS,
                pages: PATHS.SRC.PAGES,
            },
        },
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    loader: PugPlugin.loader,
                    options: { data: { isDev } },
                },
                {
                    test: /\.(css|scss|sass)$/,
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                },
                { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
                {
                    test: /\.(png|jpg|jpeg|ico|svg|webp)/,
                    type: 'asset/resource',
                    generator: { filename: keepPugFolderStructureForMedia },
                },
                {
                    test: /\.(woff|woff2|ttf)$/i,
                    type: 'asset/resource',
                    generator: { filename: keepPugFolderStructureForFonts },
                },
                {
                    test: /\.(webm|mp4)$/i,
                    type: 'asset/resource',
                    generator: { filename: keepPugFolderStructureForMedia },
                },
            ],
        },
        plugins: [
            new PugPlugin({
                pretty: true,
                css: {
                    filename: (pathData) => {
                        if (pagesRegex.test(pathData.filename)) {
                            const pageName = pathData.filename.match(pagesRegex)[1]
                            return `${FOLDER_NAMES.STYLES.BUILD}/${pageName}.styles.css`
                        }

                        return `${FOLDER_NAMES.STYLES.BUILD}/[name].css`
                    },
                },
            }),
        ],
        optimization: {
            minimizer: [
                '...',
                new ImageMinimizerPlugin({
                    minimizer: {
                        async implementation(original) {
                            const inputExt = path.extname(original.filename).toLowerCase()

                            if (['webp', 'jpg', 'jpeg', 'png'].includes(inputExt)) {
                                return null
                            }

                            let result
                            try {
                                result = await sharp(original.data).webp({ quality: 90 }).toBuffer()
                            } catch (error) {
                                original.errors.push(error)
                                return null
                            }

                            return {
                                filename: original.filename.replace(inputExt, '.webp'),
                                data: result,
                                warnings: [...original.warnings],
                                errors: [...original.errors],
                                info: {
                                    ...original.info,
                                    minimized: true,
                                },
                            }
                        },
                    },
                    generator: [
                        {
                            preset: 'webp',
                            implementation: ImageMinimizerPlugin.sharpGenerate,
                            options: {
                                encodeOptions: {
                                    webp: {
                                        quality: 95,
                                    },
                                },
                            },
                        },
                        {
                            preset: 'webp-full',
                            implementation: ImageMinimizerPlugin.sharpGenerate,
                            options: {
                                encodeOptions: {
                                    webp: {
                                        quality: 100,
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
