export interface MapConfig {
    /**
     * Создавать метку на карте после загрузки.
     * По умолчанию метка ставится в центр карты.
     * @default true
     * */
    setPlacemark?: boolean
    /**
     * Включить возможность приближать колёсиком мыши
     * @default false
     */
    zoomByWheel?: boolean
    /**
     * Выводить интерфейс карты
     * @default true
     */
    ui: boolean
    /**
     * Масштаб карты при инициализации
     * @default 17
     */
    zoom?: number
}

export const defaultConfig: Required<MapConfig> = {
    setPlacemark: true,
    zoomByWheel: false,
    ui: true,
    zoom: 17,
}

export interface MapContainer extends HTMLElement {
    dataset: {
        key: string
        coords: string | undefined
    }
}

export function getMapContainer<TMapContainer extends MapContainer = MapContainer>(
    container: string | HTMLElement,
): TMapContainer {
    let mapEl = container instanceof HTMLElement ? container : document.querySelector<HTMLElement>(container)

    if (!mapEl) throw new Error(`Cannot find ${container} for map init`)
    if (!mapEl.dataset.key) throw new Error(`Map should have [data-key] attribute`)

    return mapEl as TMapContainer
}

export function parseCoords(str: string): [number, number] {
    const coordsRegex = /^(-?(?:[1-9]|[1-8][0-9]|90)(?:\.\d+)?(?:,| |, ))-?(?:[1-9]|1?[0-7][0-9]|180)(?:\.\d+)?$/

    if (!coordsRegex.test(str.trim())) throw new Error(`Coords not valid`)

    return str
        .trim()
        .replace(/[, ]/, '|')
        .split('|')
        .map((i) => parseFloat(i)) as [number, number]
}

export function getMapCenter(mapContainer: MapContainer): [number, number] {
    return !mapContainer.dataset.coords ? [55.796951, 49.210983] : parseCoords(mapContainer.dataset.coords)
}
