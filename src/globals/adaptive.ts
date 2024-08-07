/**
 * Выявляет мобильное ли устройство или нет с помощью {@link matchMedia}
 * @return `true` если мобильное, иначе `false`
 * */
export const isMobile = matchMedia('(max-width: 1000px)').matches
/**
 * Выявляет десктоп или нет с помощью {@link matchMedia}
 * @return `true` если десктоп, иначе `false`
 * */
export const isDesktop = matchMedia('(min-width: 1200px)').matches
