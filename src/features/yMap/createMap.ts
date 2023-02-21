import { IPlacemarkOptions } from 'yandex-maps'

export interface MapConfig {
	setPlacemark?: boolean,
	placemarkOptions?: IPlacemarkOptions,
	disableScroll?: boolean,
	zoom?: number,
}

const defaultConfig: Required<MapConfig> = {
	setPlacemark: true,
	placemarkOptions: {
		preset: 'islands#redIcon',
	},
	disableScroll: true,
	zoom: 17,
}

export async function createYMap(container: string | HTMLElement, props?: MapConfig) {
	const config = Object.assign(defaultConfig, props)

	let mapEl = container instanceof HTMLElement
	  ? container
	  : document.querySelector<HTMLElement>(container)
	if (!mapEl) throw new Error(`Cannot find ${ container } for map init`)

	const mapCenter = mapEl.dataset.coord && mapEl.dataset.coord
		.replace(' ', '')
		.split(',')
		.map(i => parseFloat(i))
	  || [ 55.796951, 49.210983 ]

	const map = new ymaps.Map(mapEl, {
		center: mapCenter,
		zoom: config.zoom,
	})

	if (config.disableScroll) map.behaviors.disable('scrollZoom');

	if (config.setPlacemark) {
		const placemark = new ymaps.Placemark(map.getCenter(), {}, config.placemarkOptions)

		map.geoObjects.add(placemark)
	}

	return map
}