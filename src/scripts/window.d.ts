export {}

interface MapMeta {
	status: 'not_called' | 'downloading' | 'downloaded' | 'ready'
}

declare global {
	declare var mapMeta: MapMeta

	interface Window {
		mapMeta: MapMeta,
	}
}