const defaultOptions: MutationObserverInit = {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false,
}

type ElementList = Element[] | NodeListOf<Element>
type MutationCallback = (mutation: MutationRecord) => void

export function createMutationObserver(
    elements: Element | ElementList,
    callback: MutationCallback,
    options: MutationObserverInit = {},
) {
    options = Object.assign(defaultOptions, options)

    const observer = new MutationObserver((mutations) => mutations.forEach(callback))

    if (elements instanceof Element) observer.observe(elements, options)
    else elements.forEach((el) => observer.observe(el, options))
}
