export default {
	apikey: 'To load Y.Map, you need apikey, see https://yandex.ru/dev/maps/jsapi/doc/2.1/quick-start/index.html?from=jsapi#get-api-key',
	dataPosition: 'The item has wrong data-pos value. Make sure it follow pattern /[\\d.]+[, ]+[\\d.]/',
}

export class MapError extends Error {
	data: any
	message: string

	constructor(message: string, data?: any) {
		super(message)
		this.message = message
		if (data) this.data = data
	}
}