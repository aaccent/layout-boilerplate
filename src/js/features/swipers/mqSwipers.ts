import createMqSwipers, { IMqSwiperOptions } from './createMqSwipers'

//new Swiper('.hero .swiper', {
//	slidesPerView: 1,
//	effect: 'fade',
//	loop: true,
//	autoplay: true,
//	pagination: {
//		el: '.hero .swiper-pagination',
//	},
//	navigation: {
//		nextEl: '.hero .swiper-next-btn',
//		prevEl: '.hero .swiper-prev-btn',
//	},
//})

const mqSwipers: IMqSwiperOptions[] = [
	{
		mq: '(max-width: 900px)',
		obj: {
			selector: '.team .swiper',
			options: {
				spaceBetween: 0,
				slidesPerView: 'auto',
			},
		},
	},
]

createMqSwipers(mqSwipers)