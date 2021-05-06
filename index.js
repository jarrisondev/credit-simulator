let user = {
  name: null,
  address: null,
  phoneNumber: null,
  email: null,
  incomes: null,
  anotherIncomes: null,
  expenses: null,
  loan: null,
  loanDestination: null,
  term: null,
  lifeInsurance: 0,
}

// Inputs scripts
// -------------------------------------------------------

const expressions = {
  text: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
  number: /^[0-9]+(,[0-9]+)+(,[0-9]+)?$/,
  phone: /^\d{1,12}$/,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}
let inputs = document.querySelectorAll('.input')

// Reducer that filter the inputs type
const checkForm = (event) => {
  switch (event.target.name) {
    case 'text':
      checkInput(expressions.text, event.target)
      break
    case 'number':
      event.target.value = formatNumber(event.target.value)
      checkInput(expressions.number, event.target)
      break
    case 'phone':
      checkInput(expressions.phone, event.target)
      break
    case 'email':
      checkInput(expressions.email, event.target)
      break
  }
}
//check inputs
const checkInput = (expr, input) => {
  let validation = expr.test(input.value)

  if (validation) {
    input.classList.remove('bg-danger')
  } else {
    input.classList.add('bg-danger')
  }
}
// Add listeners to the inputs
inputs.forEach((input) => {
  input.addEventListener('keyup', checkForm)
  input.addEventListener('blur', checkForm)
})
//save the data inputs in the user object
const saveData = (input) => {
  //
  if (input.name === 'number') {
    let number = input.value.replace(/,/g, '')
    user[input.id] = parseInt(number)
  } else if (input.id === 'term') {
    user[input.id] = parseInt(input.value)
  } else if (input.name === 'check') {
    if (input.checked) {
      user[input.id] = parseInt(input.value)
    }
  } else {
    user[input.id] = input.value
  }
}
// check and send the form
function sendForm(event) {
  event.preventDefault()
  let validation = true

  inputs.forEach((input) => {
    if (
      input.classList.value === 'form-control input bg-danger' ||
      input.value.length === 0 ||
      input.value === 'seleccione opción'
    )
      validation = false
    else saveData(input)
  })

  if (validation) {
    result()
    // let incomes = (user.incomes + user.anotherIncomes) / 2
    // if (user.loan < incomes) {
    // }else{
    //   alert('la cuota es ')
    // event.target.reset()
    // }
  } else {
    alert('Complete el formulario')
  }
}
// -------------------------------------------------------
//  results scripts

const result = () => {
  let fields = document.querySelectorAll('.result')
  let result = {
    nameR: user.name,
    emailR: user.email,
    loanR: user.loan,
    loanDestinationR: user.loanDestination,
    termR: user.term,
    lifeInsuranceR: user.lifeInsurance,
  }
  fields.forEach((field) => {
    field.children[0].innerHTML = result[field.id]
  })
}

const formatNumber = (number) => {
  number = String(number).replace(/\D/g, '')
  return number === '' ? number : Number(number).toLocaleString()
}

// string = string.replace(/,/g, '')
