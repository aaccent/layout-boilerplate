async function loadMap(script: string): Promise<void> {
	if (window.mapMeta === undefined) window.mapMeta = { status: 'not_called' }
	if (window.mapMeta.status !== 'not_called') return

	window.mapMeta.status = 'downloading'
	await loadScript(script)
	window.mapMeta.status = 'downloaded'
}

export async function loadYMap(apikey: string): Promise<void> {
	if (window.ymaps !== undefined) return

	const script = `https://api-maps.yandex.ru/2.1/?apikey=${ apikey }&lang=ru_RU`
	await loadMap(script)

	await ymaps.ready()
	window.mapMeta.status = 'ready'
}

export async function loadGMap(apikey: string): Promise<void> {
	if (window.google?.maps?.Map !== undefined) return

	const script = `https://maps.googleapis.com/maps/api/js?key=${ apikey }&callback=initMap`
	await loadMap(script)
}

function loadScript(src: string, async = true): Promise<any> {
	return new Promise((resolve, reject) => {
		const scriptEl = document.createElement('script')
		scriptEl.onload = resolve
		scriptEl.onerror = reject
		scriptEl.type = 'text/javascript'
		scriptEl.async = async
		scriptEl.src = src

		document.body.appendChild(scriptEl)
	})
}