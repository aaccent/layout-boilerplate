import errors, { MapError } from '@/features/y-maps/errors'

interface ILink {
	/**
	 * Protocol for custom link api call
	 * @default https
	 * */
	readonly protocol?: 'http' | 'https',
	/**
	 * Domain for custom link api call. Adding after the protocol
	 * @default api-maps.yandex.ru
	 * */
	readonly domain?: 'api-maps.yandex.ru' | 'enterprise.api-maps.yandex.ru' | string,
	/**
	 * Path for custom link api call. Adding after the domain
	 * @default /2.1/
	 * */
	readonly path?: string,
	/**
	 * Full link for api call. If set, the other parameters from 'link' are will be ignoring
	 * */
	readonly fullLink?: string,
}

type Lang = 'ru_RU' | 'en_US' | 'en_RU' | 'ru_UA' | 'uk_UA' | 'tr_TR'
type LoadType = 'release' | 'debug'
type CoordOrder = 'latlong' | 'longlat'

interface ILoadOptions {
	/** Your apikey for yandex y-maps */
	readonly apikey: string
	/**
	 * Composite or full link to the api call,
	 * @example
	 * {
	 *     protocol: 'https',
	 *     domain: 'api-maps.yandex.ru',
	 *     path: '/2.1/',
	 * }
	 *
	 * @example
	 * {
	 *     fullLink: 'https://api-maps.yandex.ru/2.1/'
	 * }
	 * */
	readonly link?: ILink,
	/**
	 * Lang for get param in call api link
	 * @default ru_RU
	 *  */
	readonly lang?: Lang,
	/**
	 * Load type of api
	 * @default release
	 * */
	readonly mode?: LoadType,
	/** @default latlong */
	readonly coordorder?: CoordOrder,
}

const defaultLoadParameters: Partial<ILoadOptions> = {
	link: {
		protocol: 'https',
		domain: 'api-maps.yandex.ru',
		path: '/2.1/',
	},
	lang: 'ru_RU',
}

/** @see https://yandex.ru/dev/maps/jsapi/doc/2.1/dg/concepts/load.html#load__param */
export async function loadYMap(parameters: ILoadOptions): Promise<void>
export async function loadYMap(apikey: string, parameters?: Omit<ILoadOptions, 'apikey'>): Promise<void>
export async function loadYMap(apikeyOrParams: string | ILoadOptions, parameters?: Omit<ILoadOptions, 'apikey'>): Promise<void> {
	const params = typeof apikeyOrParams !== 'string'
	  ? <ILoadOptions>Object.assign(defaultLoadParameters, apikeyOrParams)
	  : <ILoadOptions>Object.assign(defaultLoadParameters, { apikey: apikeyOrParams }, parameters)

	if (!params.apikey) throw new MapError(errors.apikey, params)

	await loadScript(getSrc(params))

	await ymaps.ready()
}

function getSrc(params: ILoadOptions): string {
	const composedLink =
	  params.link?.protocol + '://' +
	  params.link?.domain +
	  params.link?.path + '?'

	const getParams = new URLSearchParams('')
	getParams.set('apikey', params.apikey)
	getParams.set('lang', params.lang as string)

	if (params.mode)
		getParams.set('mode', params.mode)

	if (params.coordorder)
		getParams.set('coordorder', params.coordorder)

	return params.link?.fullLink || composedLink + getParams.toString()
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