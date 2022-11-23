import Swiper, { SwiperOptions } from 'swiper'

interface ISwiperObj {
	selector: string,
	options: SwiperOptions
}

interface IMqSwiperObj {
	isMqTrue: () => boolean,
	status: boolean,
	swiper: Swiper | boolean,
	createSwiper: () => void,
	destroySwiper: () => void
}

interface IMqSwiperOptions {
	mq: string,
	obj: ISwiperObj,
}

function createMqSwipers(swipers: IMqSwiperOptions[]): void {
	if (swipers.length === 0) return

	const mqSwipers: IMqSwiperObj[] = []

	swipers.forEach(swiper => mqSwipers.push(getMqSwiperObj(swiper.mq, swiper.obj)))

	window.addEventListener('load', function () {
		mqSwipers.forEach(swiper => {
			if (swiper.isMqTrue()) swiper.createSwiper()
		})
	})

	window.addEventListener('resize', function () {
		mqSwipers.forEach(function (swiper) {

			if (swiper.isMqTrue()) swiper.createSwiper()
			else swiper.destroySwiper()
		})
	})
}

function getMqSwiperObj(mq: string, swiperObj: ISwiperObj): IMqSwiperObj {
	return {
		isMqTrue: () => window.matchMedia(mq).matches,
		status: false,
		swiper: false,

		createSwiper() {
			if (this.status) return
			if (!document.querySelector(swiperObj.selector)) return

			this.swiper = new Swiper(swiperObj.selector, swiperObj.options)
			this.status = true
		},

		destroySwiper() {
			if (!this.status || typeof this.swiper === 'boolean') return

			this.swiper.destroy()
			this.status = false
		},
	}
}

export default createMqSwipers
export { IMqSwiperOptions }