//Paths
function toHome() {
    window.location.href = "../home/home.html";
}

function toIncome() {
    window.location.href = "../income/income.html";
}

function toExpenses() {
    window.location.href = "../expenses/expenses.html";
}

function toOutcome() {
    window.location.href = "../outcome/outcome.html";
}

function toUser() {
    window.location.href = "./user.html";
}

function delayed_home() {
    setTimeout(toHome, 600)
}

function delayed_income() {
    setTimeout(toIncome, 600)
}

function delayed_expenses() {
    setTimeout(toExpenses, 600)
}

function delayed_outcome() {
    setTimeout(toOutcome, 600)
}

function delayed_user() {
    setTimeout(toUser, 600)
}

function goBack() {
    window.history.go(-1); return false;
}

function fillForm() {
    transactionServiceDevelop.findById('1', 'usuarios')
    .then((user) => {
        form.nome().value = user.nome
        form.email().value = user.email
        form.data_nasc().value = user.nascimento

        //data_string = JSON.stringify(user.nascimento)
        //ano = data_string.substring(4, 8)
        //mes = data_string.substring(2, 4)
        //dia = data_string.substring(0, 2)

        //form.data_nasc().value = ano + '-' + mes + '-' + dia
    })
}

function updateUser () {
    dados = {
        id: 1,
        nome: form.nome().value,
        email: form.email().value,
        nascimento: form.data_nasc().value,
        senha: document.getElementById('password').value
    }

    transactionServiceDevelop.update(dados, 'usuarios')
}

window.onload = function () {
    fillForm()
}

const form = {
    nome: () => document.getElementById('nome-usuario'),
    email: () => document.getElementById('email-usuario'),
    data_nasc: () => document.getElementById('dataNasc-usuario')
}