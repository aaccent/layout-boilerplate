import IMask from 'imask'
import type { FactoryArg } from 'imask/masked/factory'

const telInputs = document.querySelectorAll<HTMLElement>('input[type="tel"]')

const maskOptions: FactoryArg = {
    mask: '+{7}(000)000-00-00',
}
telInputs.forEach((input) => IMask(input, maskOptions))
