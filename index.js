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
	lifeInsurance: null,
	taxe: null,
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
const saveDataInputs = (input) => {
	let value = input.value.replace(/,/g, '')

	if (input.name === 'check') user[input.id] = input.checked ? 0.07 : 0
	else if (!isNaN(value)) user[input.id] = parseInt(value)
	else user[input.id] = input.value

	if (user.loanDestination === 'Gastos Personales') user.taxe = 20
	if (user.loanDestination === 'Inversión') user.taxe = 15
	if (user.loanDestination === 'Vacaciones') user.taxe = 25
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
		else saveDataInputs(input)
	})

	if (validation) {
		if (generateResults()) {
			generateTable()
			event.target.reset()
		} else {
			alert('No cumple con los requisitos necesarios para el prestamo')
		}
	} else {
		alert('Complete el formulario')
	}
}
// -------------------------------------------------------

let results = {
	loan: null,
	taxes: null,
	lifeInsurance: null,
	payment: null,
	paymentLifeInsure: null,
	total: null,
}

// -------------------------------------------------------
//  generate results scripts
const generateResults = () => {
	results.loan = user.loan
	results.lifeInsurance = parseInt((user.loan * user.lifeInsurance) / 100)
	results.payment = parseInt(user.loan / user.term)
	results.paymentLifeInsure = results.payment + results.lifeInsurance
	results.taxes = parseInt((results.payment * user.taxe) / 100)
	results.total = results.taxes + results.paymentLifeInsure

	if ((user.incomes + user.anotherIncomes) / 2 <= results.payment) return true
	else return false
}

// -------------------------------------------------------
//  show results scripts

const generateTable = () => {
	let fields = document.querySelectorAll('.result')
	//Declare and print the results
	let result = {
		nameR: user.name,
		emailR: user.email,
		loanR: formatNumber(user.loan),
		termR: user.term,
		loanDestinationR: user.loanDestination,
		taxesR: user.taxe,
		lifeInsuranceR: formatNumber(results.lifeInsurance),
	}
	fields.forEach((field) => {
		field.children[0].innerHTML = result[field.id]
	})

	//generate table
	let tableData = [
		'',
		results.payment,
		results.taxes,
		results.paymentLifeInsure,
		results.loan,
		results.total,
	]

	//delete and create a tbody tag
	table.removeChild(table.children[1])
	let tbody = document.createElement('tbody')
	table.appendChild(tbody)
	let restante = 0

	for (let i = 0; i < user.term; i++) {
		let tr = document.createElement('tr')

		// changes the values of the last payment if is neccesary
		if (i === user.term - 1) {
			tableData[1] += restante
			tableData[5] = tableData[1] + results.lifeInsurance + tableData[2]
		}
		// decrement the loan
		tableData[4] -= tableData[1]

		// conditional for check that the last payment close in zero
		// and save the value in restante
		if (i === user.term - 2) {
			if (tableData[4] - tableData[1] !== 0)
				restante = tableData[4] - tableData[1]
		}

		// Generate the tr and push the data
		tableData.forEach((data, index) => {
			let td = document.createElement('td')
			let text = document.createTextNode(
				index === 0 ? `${i + 1}` : `$${formatNumber(data)}`
			)

			td.appendChild(text)
			tr.appendChild(td)
		})

		table.children[1].appendChild(tr)
	}
}
// ------------------------------------------------------
// function for show numbers with comma
const formatNumber = (number) => {
	number = String(number).replace(/\D/g, '')
	return number === '' ? number : Number(number).toLocaleString()
}
