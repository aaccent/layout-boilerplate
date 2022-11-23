const popup = document.querySelector('.popup')
const popupBody = document.querySelector('.popup__body')
const closePopupBtns = document.querySelectorAll('.popup__content .close-btn')

function initPopups() {
	if (!popupBody) return

	popupBody.addEventListener('click', e => {
		if (e.currentTarget !== e.target) return

		closeAllPopups()
	})

	closePopupBtns.forEach(btn => {
		btn.addEventListener('click', closeAllPopups)
	})
}

function togglePopup(selector: string) {
	const targetPopup = document.querySelector(`.popup__content${ selector }`)
	if (!popup || !targetPopup) return

	popup.classList.toggle('opened')
	document.documentElement.classList.toggle('disable-scroll')

	targetPopup.classList.toggle('opened')
}

function closeAllPopups() {
	const targetPopup = document.querySelector(`.popup__content.opened`)
	if (!popup || !targetPopup) return

	popup.classList.remove('opened')
	document.documentElement.classList.remove('disable-scroll')

	targetPopup.classList.remove('opened')
}

export { initPopups, togglePopup }