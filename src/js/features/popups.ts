const popupBtns = document.querySelectorAll<HTMLButtonElement>('button[data-action="popup"]')
const popups = document.querySelectorAll('.popup')

popups.forEach(i => {
	i.addEventListener('click', function(e) {
		if (e.currentTarget !== e.target) return

		closeActivePopup()
	})
})

popupBtns.forEach(btn => {
	btn.addEventListener('click', (e) => {
		try {
			popupBtnHandler(e)
		} catch (err) {
			console.error(err, '\n Button: \n', btn)
		}
	})
})

const closePopupBtns = document.querySelectorAll('button[data-action="close-popup"]')
closePopupBtns.forEach(btn => {
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

export function openPopup(name: string) {
	const targetPopup = document.querySelector<HTMLDivElement>(`.popup[data-popup="${ name }"]`)

	if (!targetPopup) throw new Error(`Cant find .popup with data-popup="${ name }"`)

	closeActivePopup()
	targetPopup.classList.add('opened')
	targetPopup.dispatchEvent(openedPopupEvent)

	document.body.addEventListener('keydown', escKeyHandler)
}

function escKeyHandler(e: KeyboardEvent) {
	if (e.key !== 'Escape') return

	closeActivePopup()
	document.body.removeEventListener('keydown', escKeyHandler)
}

export function closeActivePopup() {
	const activePopup = document.querySelector('.popup.opened')
	if (!activePopup) return

	activePopup.classList.remove('opened')
	activePopup.dispatchEvent(closedPopupEvent)
}