//Paths
function toHome() {
    window.location.href = "../home/home.html";
}

function toIncome() {
    window.location.href = "../income/income.html";
}

function toExpenses() {
    window.location.href = "./expenses.html";
}

function toOutcome() {
    window.location.href = "../outcome/outcome.html";
}

function toUser() {
    window.location.href = "../user/user.html";
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

//Eventos
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


    //Abre Modal de edição
const openModalEdit = () => document.getElementById('modal-edit')
.classList.add('active')

    //Fecha Modal de edição
const closeModalEdit = () => document.getElementById('modal-edit')
    .classList.remove('active')

document.getElementById('modalClose-edit')
    .addEventListener('click', closeModalEdit)

document.getElementById('modalCancel-edit')
    .addEventListener('click', closeModalEdit)

//Cria linha da tabela
function createTableTR(transaction) {
    const tr = document.createElement('tr')
    tr.setAttribute('id', transaction.id)

    return tr;
}

//Insere os dados na tabela
function insertTableTD(props, set_class) {
    const td = document.createElement('td')

    if (set_class) {
        td.innerHTML = props
        td.setAttribute('class', set_class)
        td.setAttribute('id', set_class)
    } else {
        td.innerHTML = props
    }
    return td
}

//Insere os dados na última coluna, contendo os botões editar e excluir
function insertLastTableTD(transaction) {
    const td = document.createElement('td')
    const delete_button = deleteButton(transaction)
    const edit_button = editButton(transaction)

    td.innerHTML = formatDate(transaction.data_alteracao)
    td.appendChild(delete_button)
    td.appendChild(edit_button)

    return td
}

//Recupera nome do tipo da transação por id
function getNameFromID(transactionTypeID, endpoint) {
    let data = transactionServiceDevelop.getAll(endpoint)
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
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

//Formata o campo data para o padrão BR
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

//Cria botão Editar
function editButton(transaction) {
    const edit_button = document.createElement('button')
    edit_button.setAttribute('type', 'button')
    edit_button.setAttribute('id', 'edit_button')
    edit_button.setAttribute('class', 'button green')
    edit_button.setAttribute('data-action', 'edit')
    edit_button.innerHTML = '<span class="material-symbols-outlined">edit</span></button>'

    if (transaction.tipo_entrada) {
        const endpoint = 'entradas'
        edit_button.addEventListener("click", event => {
            event.stopPropagation();
            getTransactionByID(transaction.id, endpoint);
            })
    } else {
        const endpoint = 'saidas'
        edit_button.addEventListener("click", event => {
            event.stopPropagation();
                getTransactionByID(transaction.id, endpoint);
            })
    }
    return edit_button
}

//Localiza transação por ID, e abre o modal para edição
function getTransactionByID(id, endpoint) {
    
    transactionServiceDevelop.findById(id, endpoint)
        .then(transaction => {
            if (transaction) {
                fillTransactionToEdit(transaction, endpoint);
                openModalEdit()
            } else {
                alert("Registro não encontrado")
            }
        })
    }

//Preenche o Modal para edição
function fillTransactionToEdit(transaction, endpoint) {
    if (endpoint == 'entradas') {
        id = transaction.id
        document.getElementById('tipo_transacao-edit').value = 'tipoentradas'
        document.getElementById('nome-edit').value = transaction.nome
        document.getElementById('valor-edit').value = transaction.valor
        document.getElementById('tipo_entrada-edit').value = transaction.tipo_entrada
        
        if (transaction.descricao) {
            document.getElementById('descricao-edit').value = transaction.descricao
        }

        const data_string = JSON.stringify(transaction.data_alteracao)
        const data_field = data_string.substring(1, 11)
        
        document.getElementById('data-edit').value = data_field

    } else {
        id = transaction.id
        document.getElementById('tipo_transacao-edit').value = 'tiposaidas'
        document.getElementById('nome-edit').value = transaction.nome
        document.getElementById('valor-edit').value = transaction.valor
        document.getElementById('tipo_entrada-edit').value = transaction.tipo_saida
        
        if (transaction.descricao) {
            document.getElementById('descricao-edit').value = transaction.descricao
        }

        const data_string = JSON.stringify(transaction.data_alteracao)
        const data_field = data_string.substring(1, 11)
        
        document.getElementById('data-edit').value = data_field
    }
}

//Cria botão Excluir
function deleteButton(transaction) {
    const delete_button = document.createElement('button')
    delete_button.setAttribute('type', 'button')
    delete_button.setAttribute('id', 'delete_button')
    delete_button.setAttribute('class', 'button red')
    delete_button.innerHTML = '<span class="material-symbols-outlined">delete</button>'

    if (transaction.tipo_entrada) {
        const endpoint = 'entradas'
        delete_button.addEventListener("click", event => {
            event.stopPropagation();
            askRemoveTransaction(transaction, endpoint);
        })
    } else {
        const endpoint = 'saidas'
        delete_button.addEventListener("click", event => {
            event.stopPropagation();
            askRemoveTransaction(transaction, endpoint);
        })
    }
    return delete_button
}

//Cria notificação de confirmação de deleção
function askRemoveTransaction(transaction, endpoint) {
    const shouldRemove = confirm('Deseja remover a transação?');
    if (shouldRemove) {
        removeTransaction(transaction, endpoint);
    }
}

//Remove a transação
function removeTransaction(transaction, endpoint) {
    transactionServiceDevelop.remove(transaction.id, endpoint)
    document.getElementById(transaction.id).remove();
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
        tr.appendChild(insertLastTableTD(transaction))

        tableBody.appendChild(tr)
    });
}

//Cria transação
function createTransaction() {
    const tipo_transacao = form.tipo_transacao().value

    if (tipo_transacao == 'tipoentradas') {
        const endpoint = 'entradas'
        const entradas = {
            nome: form.nome().value,
            valor: parseFloat(form.valor().value),
            tipo_entrada: form.tipo_entrada().value,
            usuario_id: 1,
            descricao: form.descricao().value,
            data_criacao: form.data().value,
            data_alteracao: form.data().value,
            ativo: 1
        }
        return [entradas, endpoint]
    }
    if (tipo_transacao == 'tiposaidas') {
        const endpoint = 'saidas'
        const saidas = {
            nome: form.nome().value,
            valor: parseFloat(form.valor().value),
            tipo_saida: form.tipo_entrada().value,
            usuario_id: 1,
            descricao: form.descricao().value,
            data_criacao: form.data().value,
            data_alteracao: form.data().value,
            ativo: 1
        }
        return [saidas, endpoint]
    }

}

function editTransaction() {
    const tipo_transacao = form.tipo_transacao_edit().value

    if (tipo_transacao == 'tipoentradas') {
        const endpoint = 'entradas'
        const entradas = {
            id: id,
            nome: form.nome_edit().value,
            valor: parseFloat(form.valor_edit().value),
            tipo_entrada: form.tipo_entrada_edit().value,
            usuario_id: 1,
            descricao: form.descricao_edit().value,
            data_criacao: form.data_edit().value,
            data_alteracao: form.data_edit().value,
            ativo: 1
        }
        return [entradas, endpoint]
    }
    if (tipo_transacao == 'tiposaidas') {
        const endpoint = 'saidas'
        const saidas = {
            id : id,
            nome: form.nome_edit().value,
            valor: parseFloat(form.valor_edit().value),
            tipo_saida: form.tipo_entrada_edit().value,
            usuario_id: 1,
            descricao: form.descricao_edit().value,
            data_criacao: form.data_edit().value,
            data_alteracao: form.data_edit().value,
            ativo: 1
        }
        return [saidas, endpoint]
    }

}

//Cria e chama a função que salva a transação
function saveTransaction() {
    console.log('Salvando')
    const transaction = createTransaction();
    save(transaction[0], transaction[1])
}

//Edita transação
function saveEdit() {
    console.log('Editando')
    const transaction = editTransaction();
    update(transaction[0], transaction[1])
}

//Função que chama a camada de serviço e salva a transação
function save(transaction, endpoint) {
    transactionServiceDevelop.save(transaction, endpoint)
}

//Atualiza transação
function update(transaction, endpoint) {
    transactionServiceDevelop.update(transaction, endpoint)
        .then(() => {
            closeModalEdit();
        }).catch(() => {
            hideLoading();
            alert('Erro ao atualizar transação')
        })
}

const form = {
    tipo_transacao: () => document.getElementById("tipo_transacao"),
    nome: () => document.getElementById('nome'),
    descricao: () => document.getElementById("descricao"),
    valor: () => document.getElementById("valor"),
    tipo_entrada: () => document.getElementById('tipo_entrada'),
    data: () => document.getElementById("data"),
    saveButton: () => document.getElementById("save-button"),

    //Para editar transacao
    tipo_transacao_edit: () => document.getElementById("tipo_transacao-edit"),
    nome_edit: () => document.getElementById('nome-edit'),
    descricao_edit: () => document.getElementById("descricao-edit"),
    valor_edit: () => document.getElementById("valor-edit"),
    tipo_entrada_edit: () => document.getElementById('tipo_entrada-edit'),
    data_edit: () => document.getElementById("data-edit"),
    saveButton_edit: () => document.getElementById("save-edit")
}

function main() {
    //endpoints
    let data_entradas = transactionServiceDevelop.getAll("entradas")
    let entradas = JSON.parse(data_entradas);

    let data_saidas = transactionServiceDevelop.getAll("saidas")
    let saidas = JSON.parse(data_saidas);

    let data_tiposaidas = transactionServiceDevelop.getAll("tiposaidas")
    let tipo_saidas = JSON.parse(data_tiposaidas);
    addTableRows(entradas, 'tipo_entrada', 'tipoentradas')
    addTableRows(saidas, 'tipo_saida', 'tiposaidas')


}
main()