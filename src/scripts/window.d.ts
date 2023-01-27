export {}

interface YMapMeta {
	status: 'not_called' | 'downloading' | 'downloaded' | 'ready'
}

declare global {
	declare var yMapMeta: YMapMeta

	interface Window {
		yMapMeta: YMapMeta
	}
}