import Swiper from 'swiper'
import { SwiperOptions } from 'swiper/types'

export interface ISwiperObj {
    selector: string
    options: SwiperOptions
    callback?: (ctx: IMqSwiperObj) => any
    callbackOnDestroy?: (ctx: IMqSwiperObj) => any
}

export interface IMqSwiperObj {
    isMqTrue: () => boolean
    status: boolean
    swiper: Swiper | boolean
    createSwiper: () => void
    destroySwiper: () => void
    additional?: any
}

interface IMqSwiperOptions {
    mq: string
    obj: ISwiperObj
}

const mqSwipers: IMqSwiperObj[] = []

function createMqSwiper(swiper: IMqSwiperOptions): void {
    mqSwipers.push(getMqSwiperObj(swiper.mq, swiper.obj))

    window.addEventListener('load', function () {
        mqSwipers.forEach((swiper) => {
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

            if (swiperObj.callback) swiperObj.callback(this)
        },

        destroySwiper() {
            if (!this.status || typeof this.swiper === 'boolean') return

            this.swiper.destroy()
            this.status = false

            if (swiperObj.callbackOnDestroy) swiperObj.callbackOnDestroy(this)
        },
    }
}

export default createMqSwiper
export { IMqSwiperOptions }
