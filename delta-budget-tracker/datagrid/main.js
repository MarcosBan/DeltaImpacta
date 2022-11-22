//Abre Modal
const openModal = () => document.getElementById('modal')
    .classList.add('active')

document.getElementById('adicionarTransacao')
    .addEventListener('click', openModal)

//Fecha Modal
const closeModal = () => document.getElementById('modal')
    .classList.remove('active')

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('modalCancel')
    .addEventListener('click', closeModal)


//Escuta evento odo botão editar



//Cria linha da tabela
function createTableTR(transaction) {
    const tr = document.createElement('tr')
    tr.setAttribute('id', transaction.id)
    
    return tr;
}

//Insere os dados na tabela
function insertTableTD(props, set_class) {
    const td = document.createElement('td')

    if(set_class) {
        td.innerHTML = props
        td.setAttribute('class', set_class)
    } else {
        td.innerHTML = props
    }
    return td
}

//Insere os dados na última coluna, contendo os botões editar e excluir
function insertLastTableTD(props) {
    const td = document.createElement('td')
    const delete_button = deleteButton()
    const edit_button = editButton()

    td.innerHTML = formatDate(props)
    td.appendChild(delete_button)
    td.appendChild(edit_button)    

    return td
}

//Recupera nome do tipo da transação por id
function getNameFromID(transactionTypeID, endpoint) {
    let data = fazGet("http://localhost:3000/" + endpoint)
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

//Cria botão Excluir
function deleteButton() {
    const delete_button = document.createElement('button')
    delete_button.setAttribute('type', 'button')
    delete_button.setAttribute('id', 'delete_button')
    delete_button.setAttribute('class', 'button red')
    delete_button.innerHTML = '<span class="material-symbols-outlined">delete</button>'

    return delete_button
}

//Cria botão Editar
function editButton() {
    const edit_button = document.createElement('button')
    edit_button.setAttribute('type', 'button')
    edit_button.setAttribute('id', 'edit_button')
    edit_button.setAttribute('class', 'button green')
    edit_button.innerHTML = '<span class="material-symbols-outlined">edit</span></button>'

    return edit_button
}

//Adiciona elementos na tela
function addTableRows(transactions, type, endpoint) {
    const tableBody = document.getElementById('table-body');

    transactions.forEach(transaction => {
        const tr = createTableTR(transaction)
        tr.appendChild(insertTableTD(transaction.nome, endpoint))
        if (transaction.descricao) {
            tr.appendChild(insertTableTD(transaction.descricao))
        }
        tr.appendChild(insertTableTD(convertCurrency(transaction.valor)))
        tr.appendChild(insertTableTD(getNameFromID(transaction[type], endpoint)))
        tr.appendChild(insertLastTableTD(transaction.data_alteracao))
        
        tableBody.appendChild(tr)
    });
}

//Cria transação
function createTransaction() {
    return {
        tipo_transacao: form.tipo_transacao().select.options[selectedIndex].id,
        nome: form.nome().value,
        descricao: form.descricao().value,
        valor: form.valor().value,
        tipo_entrada: form.tipo_entrada().select.options[selectedIndex].id,
        data: form.data().value
    };
}

//Salva transação
function saveTransaction() {
    showLoading();
    const transaction = createTransaction();
    save(transaction)
}


//endpoints
let data_entradas = fazGet("http://localhost:3000/entradas")
let entradas = JSON.parse(data_entradas);

let data_saidas = fazGet("http://localhost:3000/saidas")
let saidas = JSON.parse(data_saidas);

let data_tiposaidas = fazGet("http://localhost:3000/tiposaidas")
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

const form = {
    tipo_transacao: () => document.getElementById("tipo_transacao"),
    nome: () => document.getElementById('nome'),
    descricao: () => document.getElementById("descricao"),
    valor: () => document.getElementById("valor"),
    tipo_entrada: () => document.getElementById('tipo_entrada'),
    data: () => document.getElementById("data"),
    saveButton: () => document.getElementById("save-button")
    
    
}




function main() {
    let data = fazGet("http://localhost:3000/entradas")
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