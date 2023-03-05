import { IPlacemarkOptions } from 'yandex-maps'
import { loadYMap } from 'features/maps/loadMap'

export interface MapConfig {
	setPlacemark?: boolean,
	disableScroll?: boolean,
	zoom?: number,
}

export interface YMapConfig extends MapConfig{
	placemarkOptions?: IPlacemarkOptions,
}

const defaultConfig: Required<MapConfig> = {
	setPlacemark: true,
	disableScroll: true,
	zoom: 17,
}

const defaultYConfig: Required<YMapConfig> = {
	...defaultConfig,
	placemarkOptions: {
		preset: 'islands#redIcon',
	},
}

export async function createYMap(container: string | HTMLElement, props?: YMapConfig) {
	const config = Object.assign(defaultYConfig, props)

	let mapEl = getMapContainer(container)
	const mapCenter = getMapCenter(mapEl)

	await loadYMap(mapEl.dataset.key)

	const map = new ymaps.Map(mapEl, {
		center: mapCenter,
		zoom: config.zoom,
	})

	if (config.disableScroll) map.behaviors.disable('scrollZoom')

	if (config.setPlacemark) {
		const placemark = new ymaps.Placemark(map.getCenter(), {}, config.placemarkOptions)

		map.geoObjects.add(placemark)
	}

	return map
}

interface MapContainer extends HTMLElement {
	dataset: {
		key: string,
		coords: string | undefined
	}
}

function getMapContainer(container: string | HTMLElement): MapContainer {
	let mapEl = container instanceof HTMLElement
	  ? container
	  : document.querySelector<HTMLElement>(container)
	if (!mapEl) throw new Error(`Cannot find ${ container } for map init`)
	if (!mapEl.dataset.key) throw new Error(`Map should have [data-key] attribute`)

	return mapEl as MapContainer
}

function getMapCenter(mapContainer: MapContainer): [ number, number ] {
	if (!mapContainer.dataset.coords) return [ 55.796951, 49.210983 ]

	const customCoords = mapContainer.dataset.coords
	  .replace(' ', '')
	  .split(',')
	  .map(i => parseFloat(i))

	if (customCoords.length === 2) return customCoords as [ number, number ]
	else throw new Error('Map coords should be of the form "13, 13"')
}