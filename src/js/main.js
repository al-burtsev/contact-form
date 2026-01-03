const form = document.querySelector('.form')
const inputList = Array.from(form.querySelectorAll('input, textarea'))
const checkboxElement = form.querySelector('.form__checkbox')
const buttonElement = form.querySelector('.form__submit')
const toast = document.getElementById('toast')

function startValidation() {
  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (hasInvalidInput()) {
      toggleButton()
      inputList.forEach((inputElement) => {
        checkInputValidity(inputElement)
        toggleInputError(inputElement)
      })
      toggleInputError(checkboxElement)
      return
    }

    toast.showPopover()
    form.reset()

    setTimeout(() => {
      if (toast.matches(':popover-open')) {
        toast.hidePopover();
      }
    }, 3000);
  })

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(inputElement)
      toggleButton()
    })

    inputElement.addEventListener('blur', () => {
      checkInputValidity(inputElement)
      toggleInputError(inputElement)
    })

    inputElement.addEventListener('focus', () => {
      toggleErrorSpan(inputElement)
    })

    checkboxElement.addEventListener('change', () => {
      checkInputValidity(inputElement)
      toggleInputError(checkboxElement)
    })
  })
}

function checkInputValidity(inputElement) {
  inputElement.setCustomValidity('')

  if (inputElement.validity.valueMissing) {
    let message = ''
    if (inputElement.type === 'checkbox') {
      message = 'Please provide your consent to be contacted'
    } else if (inputElement.type === 'radio') {
      message = 'Please select a query type'
    } else {
      message = 'This field is required'
    }

    inputElement.setCustomValidity(message);
    return;
  }

  if (inputElement.type === 'email' && inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity('Please enter a valid email address')
    return
  }
}

function toggleInputError(inputElement) {
  if (!inputElement.validity.valid) {
    toggleErrorSpan(inputElement, inputElement.validationMessage)
  } else {
    toggleErrorSpan(inputElement)
  }
}

function hasInvalidInput() {
  return (
    inputList.some(inputElement => !inputElement.validity.valid) || !checkboxElement.validity.valid
  )
}

function toggleErrorSpan(inputElement, errorMessage) {
  const errorElement = document.querySelector(`#${inputElement['name']}-error`)
  if (errorMessage) {
    inputElement.classList.add('form__type-input-error')
    errorElement.textContent = errorMessage
    errorElement.classList.add('form__error--active')
  } else {
    inputElement.classList.remove('form__type-input-error')
    errorElement.textContent = ''
    errorElement.classList.remove('form__error--active')
  }
}

function toggleButton() {
  if (hasInvalidInput()) {
    buttonElement.classList.add('form__submit--inactive')
    buttonElement.setAttribute('aria-disabled', 'true')
  } else {
    buttonElement.classList.remove('form__submit--inactive')
    buttonElement.setAttribute('aria-disabled', 'false')
  }
}

startValidation()