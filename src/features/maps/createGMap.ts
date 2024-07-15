import { loadScript, waitScriptStatus } from '@/features/loadScript'
import { defaultConfig, getMapCenter, getMapContainer, MapConfig, MapContainer } from '@/features/maps/mapGeneral'

export async function loadGMap(apikey: string): Promise<void> {
    if (window.google?.maps?.Map !== undefined) return

    const script = `https://maps.googleapis.com/maps/api/js?key=${apikey}&callback=initMap`
    await loadScript(script, 'gMap')
}

interface GMapContainer extends MapContainer {
    dataset: MapContainer['dataset'] & {
        styles?: string
    }
}

export async function createGMap(container: string | HTMLElement, props?: MapConfig): Promise<google.maps.Map> {
    const config = Object.assign(defaultConfig, props)

    let map: google.maps.Map | null = null

    let mapEl = getMapContainer<GMapContainer>(container)
    const mapCenter = getMapCenter(mapEl)

    async function initMap(): Promise<void> {
        map = new google.maps.Map(mapEl, {
            center: { lat: mapCenter[0], lng: mapCenter[1] },
            zoom: config.zoom,
            disableDefaultUI: !config.ui,
            gestureHandling: config.zoomByWheel ? 'greedy' : 'cooperative',
        })

        window.globalScripts.gMap = 'created'

        await setGMapStyles(mapEl, map)
    }

    window.initMap = initMap

    await loadGMap(mapEl.dataset.key)

    await waitScriptStatus('gMap', 'created')
    if (map !== null) return map

    throw new Error('Unexpected error while creating google maps')
}

const jsonErrorText = 'By specified path with json styles for GMap should valid JSON. mapContainer:\n'

async function setGMapStyles(mapContainer: GMapContainer, map: google.maps.Map): Promise<void> {
    const stylesPath = mapContainer.dataset.styles

    if (!stylesPath) return

    await fetch(stylesPath)
        .then((res) => res.json())
        .catch(() => console.error(jsonErrorText, mapContainer))
        .then((styles) => map.setOptions({ styles }))
        .catch(console.error)
}
