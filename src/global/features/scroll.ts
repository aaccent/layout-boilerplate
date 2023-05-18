const html = document.documentElement

export function toggleScroll() {
	html.classList.toggle('scroll-off')

	if (window.matchMedia('(max-width: 1200px)').matches) {
		html.classList.toggle('disable-scroll')
		return
	}

	html.classList.contains('scroll-off')
	  ? disableScrollEvent()
	  : enableScrollEvent()
}

export function enableScroll() {
	enableScrollEvent()
	html.classList.remove('disable-scroll')
	html.classList.remove('scroll-off')
}

export function disableScroll() {
	if (window.matchMedia('(min-width: 1200px)').matches) {
		disableScrollEvent()
	} else {
		html.classList.add('disable-scroll')
		html.classList.add('scroll-off')
	}
}

const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

function disableScrollEvent() {
	window.addEventListener(wheelEvent, preventDefault, { passive: false })
	window.addEventListener('keydown', preventDefaultForScrollKeys, false)
}

function enableScrollEvent() {
	window.removeEventListener(wheelEvent, preventDefault)
	window.removeEventListener('keydown', preventDefaultForScrollKeys)
}

const keys: string[] = [ 'pagedown', 'pageup', 'end', 'home', 'space', 'arrowup', 'arrowright', 'arrowdown', 'arrowleft' ]

const ignoreDisableScrollEls = document.querySelectorAll('*[data-ignore-disable-scroll]')

function isIgnoringDisabling(target: Element) {
	return Boolean(Array.from(ignoreDisableScrollEls).find(el => el.contains(target)))
}

function preventDefault(e: Event) {
	if (isIgnoringDisabling(e.target as Element)) return

	e.preventDefault()
}

function preventDefaultForScrollKeys(e: KeyboardEvent) {
	if (isIgnoringDisabling(e.target as Element)) return

	if (keys.includes(e.code)) preventDefault(e)
}