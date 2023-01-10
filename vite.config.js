import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	root: './src/',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			input: {
				index: resolve(__dirname, './src/index.html'),
				catalog: resolve(__dirname, './src/catalog.html'),
			},
			output: {
				manualChunks: (id) => {
					console.log(id)

					const match = id.match(/.+\/(?<name>.+)\.(?<ext>\w+)$/)

					if (match && match.groups && match.groups.ext && match.groups.name) {
						let { name, ext } = match.groups
						let pass = false

						if (/ts|js/i.test(ext) && name.includes('main')) {
							pass = true
						}


						if (pass) return `${ name }`
					}
				},
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1)
					let nameAdd = '.styles'

					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						extType = 'images'
						nameAdd = ''
					}

					if (assetInfo.name === 'styles.css') {
						nameAdd = ''
					}

					return `${ extType }/[name]${ nameAdd }[extname]`
				},
				chunkFileNames: 'js/[name].js',
				entryFileNames: 'js/[name].js',
			},
		},
	},
})