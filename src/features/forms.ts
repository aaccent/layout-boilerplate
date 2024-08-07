const forms = document.querySelectorAll<HTMLFormElement>('form[data-handler]')
forms.forEach((form) => {
    form.addEventListener('submit', submitHandler)
})

const formSent = new CustomEvent('form-sent')

/**
 * После передачи события, происходит:
 * 1. Отменяет переданное событие `event`;
 * 2. Проверяет на наличие атрибута `data-handler` у формы;
 * 3. Проверяет поля через функцию {@link validateForm}
 * 4. Если проверка успешна, то отправляет запрос по пути из `data-handler`
 * 5. Если код ответа запроса `200-299`, то
 * вызывается событие ['form-sent']{@link formSent},
 * иначе выводится ошибка в консоль
 */
async function submitHandler(event: SubmitEvent) {
    event.preventDefault()

    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const handlerPath = form.dataset.handler
    if (!handlerPath) return console.error('data-handler should be not empty. Form element:\n', form)

    if (!validateForm(form)) return

    const res = await fetch(handlerPath, {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) {
        return console.error(
            'Error while submitting form\n',
            form,
            '\n',
            'FormData:\n',
            formData,
            '\n',
            'Response:\n',
            res,
        )
    }

    form.dispatchEvent(formSent)
}

/**
 * Проверяет все `required` поля в форме `form`.
 * Если есть незаполненные, то добавляет к полю класс `invalid`
 * @param form - форма, в которой необходимо провести проверку
 * @return `true` если проверка успешна, иначе `false`
 */
function validateForm(form: HTMLFormElement): Boolean {
    let valid = true

    const requiredInputs = form.querySelectorAll<HTMLInputElement>('input[required]')

    requiredInputs.forEach((input) => {
        if (input.value !== '') return

        valid = false
        input.classList.add('invalid')
        input.addEventListener('input', () => input.classList.remove('invalid'), { once: true })
    })

    return valid
}
