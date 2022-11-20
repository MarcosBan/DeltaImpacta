//Open Modal
const openModal = () => document.getElementById('modal')
    .classList.add('active')

document.getElementById('adicionarTransacao')
    .addEventListener('click', openModal)

//Close Modal
const closeModal = () => document.getElementById('modal')
    .classList.remove('active')

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('modalCancel')
    .addEventListener('click', closeModal)


//Cria linha da tabela
function createTableTR(transaction) {
    const tr = document.createElement('tr')
    tr.setAttribute('id', transaction.id)
    
    return tr;
}

//Insere os dados na tabela
function insertTableTD(props, set_classe) {
    const td = document.createElement('td')

    if(set_classe) {
        td.innerHTML = props
        td.setAttribute('class', set_classe)
    } else {
        td.innerHTML = props
    }
    return td
}

//Recupera nome do tipo da transação por id
function getNameFromID(transactionTypeID, endpoint) {
    let data = fazGet("https://apibudgettracker.azurewebsites.net/" + endpoint)
    let transactionType = JSON.parse(data);
    let nome = 'vazio'
        
    transactionType.forEach(type => {
        if (transactionTypeID == type.id) {
            nome = type.nome;
        }
}); return nome;
}

//Formata para o valor monetário BR
function convertCurrency(value) {
    return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

//Formata o campo data para o padrão BR
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

//Adiciona elementos na tela
function addTableRows(transactions, type, endpoint) {
    const tableBody = document.getElementById('table-body');

    transactions.forEach(transaction => {
        const tr = createTableTR(transaction)
        tr.appendChild(insertTableTD(transaction.nome, endpoint))
        tr.appendChild(insertTableTD(transaction.descricao))
        tr.appendChild(insertTableTD(convertCurrency(transaction.valor)))
        tr.appendChild(insertTableTD(getNameFromID(transaction[type], endpoint)))
        tr.appendChild(insertTableTD(formatDate(transaction.data_alteracao)))
        
        tableBody.appendChild(tr)
    });
}


//endpoints
let data_entradas = fazGet("https://apibudgettracker.azurewebsites.net/entradas")
let entradas = JSON.parse(data_entradas);

let data_saidas = fazGet("https://apibudgettracker.azurewebsites.net/saidas")
let saidas = JSON.parse(data_saidas);

let data_tiposaidas = fazGet("https://apibudgettracker.azurewebsites.net/tiposaidas")
let tipo_saidas = JSON.parse(data_tiposaidas);

addTableRows(entradas, 'tipo_entrada_id','tipoentradas')
addTableRows(saidas, 'tipo_saida_id', 'tiposaidas')

function fazGet(url) {
    let request = new XMLHttpRequest()
    request.open("GET", url, false)
    request.send()
    return request.responseText
}

function criaLinha(element) {
    const linha = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdNome = document.createElement("td");

    tdId.innerHTML = element.id
    tdNome.innerHTML = element.nome

    linha.appendChild(tdId);
    linha.appendChild(tdNome);

    return linha;
}

function main() {
    let data = fazGet("https://apibudgettracker.azurewebsites.net/entradas")
    let entradas = JSON.parse(data);
    let tabela = document.getElementById("tabela")

    entradas.forEach(element => {
        let linha = criaLinha(element);
        tabela.appendChild(linha);
    });
    // Para cada usuário
    // Criar uma linha
    //adicionar na tabela

}
    //main()