import { disableScroll, enableScroll } from '@/features/scroll'

const popupBtns = document.querySelectorAll<HTMLButtonElement>('button[data-action="popup"]')
const popups = document.querySelectorAll('.popup')

popups.forEach((i) => {
    i.addEventListener('click', function (e) {
        if (e.currentTarget !== e.target) return

        closeActivePopup()
    })
})

popupBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        try {
            popupBtnHandler(e)
        } catch (err) {
            console.error(err, '\n Button: \n', btn)
        }
    })
})

const closePopupBtns = document.querySelectorAll('button[data-action="close-popup"]')
closePopupBtns.forEach((btn) => {
    btn.addEventListener('click', closeActivePopup)
})

const openedPopupEvent = new CustomEvent('opened')
const closedPopupEvent = new CustomEvent('closed')

function popupBtnHandler(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement
    const popupName = target.dataset.popup

    if (!popupName) throw new Error('button with data-action="popup" doesnt have data-popup')

    openPopup(popupName)
}

function escKeyHandler(e: KeyboardEvent) {
    if (e.key !== 'Escape') return

    closeActivePopup()
    document.body.removeEventListener('keydown', escKeyHandler)
}

/**
 * Открывает попап с `name` в атрибуте `data-popup` и вызывает на нём
 * пользовательское событие [`opened`]{@link openedPopupEvent}.
 *
 * Если есть открытый попап, то закрывает его.
 * */
export function openPopup(name: string) {
    const activeHeader = document.querySelector('.header.active')
    const targetPopup = document.querySelector<HTMLDivElement>(`.popup[data-popup="${name}"]`)

    if (!targetPopup) throw new Error(`Cant find .popup with data-popup="${name}"`)

    // process нужен для того, чтобы при закрытии и
    // открытии попапа пользователь не мог лишний раз скролить
    closeActivePopup('process')
    targetPopup.classList.add('opened')
    targetPopup.dispatchEvent(openedPopupEvent)

    if (!activeHeader) disableScroll()
    document.body.addEventListener('keydown', escKeyHandler)
}

/**
 * Закрывает текущий активный попап и вызывает на нём
 * пользовательское событие [`closed`]{@link closedPopupEvent}.
 * @param code - Системный код для сторонних эффектов во время закрытия.
 * Если передать `process`, то не будет возвращать возможность прокрутки страницы.
 */
export function closeActivePopup(code?: any | 'process') {
    const activePopup = document.querySelector('.popup.opened')
    if (!activePopup) return

    if (code !== 'process') enableScroll()
    activePopup.classList.remove('opened')
    activePopup.dispatchEvent(closedPopupEvent)
}
