import IMask from 'imask'

const telInputs =  document.querySelectorAll<HTMLElement>('input[type="tel"]')

const maskOptions: IMask.AnyMaskedOptions = {
	mask: '+{7}(000)000-00-00'
}
telInputs.forEach(input => IMask(input, maskOptions))