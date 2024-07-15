const forms = document.querySelectorAll<HTMLFormElement>('form[data-handler]')
forms.forEach((form) => {
    form.addEventListener('submit', submitHandler)
})

const formSent = new CustomEvent('formSent')

function submitHandler(e: SubmitEvent) {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const handlerPath = form.dataset.handler
    if (!handlerPath) return console.error('data-handler should be not empty. Form element:\n', form)

    if (!validateForm(form)) return

    fetch(handlerPath, {
        method: 'POST',
        body: formData,
    }).then((res) => {
        if (!res.ok) {
            return console.error('Error while submitting form\n', 'FormData:\n', formData, '\n', ' Response:\n', res)
        }

        form.dispatchEvent(formSent)
    })
}

function validateForm(form: HTMLFormElement): Boolean {
    let valid = true

    const requiredInputs = form.querySelectorAll<HTMLInputElement>('input[required]')

    requiredInputs.forEach((i) => {
        if (i.value !== '') return

        valid = false
        i.classList.add('invalid')
        i.addEventListener('input', () => i.classList.remove('invalid'), { once: true })
    })

    return valid
}
