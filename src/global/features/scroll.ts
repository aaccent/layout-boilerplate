const html = document.documentElement

export function toggleScroll() {
    html.classList.toggle('disable-scroll')

    html.classList.contains('disable-scroll')
        ? disableScroll()
        : enableScroll()
}

export function enableScroll() {
    document.body.style.paddingRight = `0`
    html.classList.remove('disable-scroll')
    html.classList.remove('scroll-off')
}

export function disableScroll() {
    document.body.style.paddingRight = `${window.innerWidth - html.offsetWidth}px`
    html.classList.add('disable-scroll')
}