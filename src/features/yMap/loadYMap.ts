export async function loadYMap(apikey: string): Promise<void> {
	if (window.yMapMeta === undefined) window.yMapMeta = { status: 'not_called' }
	if (window.ymaps !== undefined) return
	if (window.yMapMeta.status !== 'not_called') return

	window.yMapMeta.status = 'downloading'
	await loadScript(`https://api-maps.yandex.ru/2.1/?apikey=${ apikey }&lang=ru_RU`)
	window.yMapMeta.status = 'downloaded'

	await ymaps.ready()
	window.yMapMeta.status = 'ready'
}

function loadScript(src: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const scriptEl = document.createElement('script')
		scriptEl.onload = resolve
		scriptEl.onerror = reject
		scriptEl.type = 'text/javascript'
		scriptEl.src = src

		document.body.appendChild(scriptEl)
	})
}