const html = document.documentElement

/**
 * Включает/выключает возможность пролистывать страницу с помощью `overflow`.
 * Добавляет `padding-right` чтобы не "прыгала" страница из-за пропажи полосы.
 * */
export function toggleScroll() {
    html.classList.toggle('disable-scroll')

    html.classList.contains('disable-scroll') ? disableScroll() : enableScroll()
}

/**
 * Включает возможность пролистывать страницу.
 * Убирает класс `disable-scroll` с `body`
 * */
export function enableScroll() {
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    document.body.style.paddingRight = `0`
    html.classList.remove('disable-scroll')
}

/**
 * Отключает возможность пролистывать страницу с помощью `overflow`.
 * Добавляет `padding-right` чтобы не "прыгала" страница из-за пропажи полосы.
 * Добавляет класс `disable-scroll` на `body`
 * */
export function disableScroll() {
    document.documentElement.style.overflow = 'clip'
    document.body.style.overflow = 'clip'
    document.body.style.paddingRight = `${window.innerWidth - html.offsetWidth}px`
    html.classList.add('disable-scroll')
}
