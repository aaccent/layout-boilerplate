import { loadScript } from '@/features/loadScript'
import { IPlacemarkOptions } from 'yandex-maps'
import { defaultConfig, getMapCenter, getMapContainer, MapConfig } from '@/features/maps/mapGeneral'

export interface YMapConfig extends MapConfig {
    placemarkOptions?: IPlacemarkOptions
}

const defaultYConfig: Required<YMapConfig> = {
    ...defaultConfig,
    placemarkOptions: {
        preset: 'islands#redIcon',
    },
}

export async function loadYMap(apikey: string): Promise<void> {
    if (window.ymaps !== undefined) return

    const script = `https://api-maps.yandex.ru/2.1/?apikey=${apikey}&lang=ru_RU`
    await loadScript(script, 'yaMap')

    await ymaps.ready()
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

    if (!config.zoomByWheel) map.behaviors.disable('scrollZoom')

    if (config.setPlacemark) {
        const placemark = new ymaps.Placemark(map.getCenter(), {}, config.placemarkOptions)

        map.geoObjects.add(placemark)
    }

    window.globalScripts.yaMap = 'created'

    return map
}
