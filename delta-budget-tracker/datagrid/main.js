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
    let data = transactionService.getAll(endpoint)
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
    edit_button.innerHTML = '<span class="material-symbols-outlined">edit</span></button>'

    if (transaction.tipo_entrada_id) {
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
    
    transactionService.findById(id, endpoint)
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
        document.getElementById('tipo_transacao-edit').value = 'tipoentradas'
        document.getElementById('nome-edit').value = transaction.nome
        document.getElementById('valor-edit').value = transaction.valor
        document.getElementById('tipo_entrada-edit').value = transaction.tipo_entrada_id
        
        if (transaction.descricao) {
            document.getElementById('descricao-edit').value = transaction.descricao
        }

        const data_string = JSON.stringify(transaction.data_alteracao)
        const data_field = data_string.substring(1, 11)
        
        document.getElementById('data-edit').value = data_field

    } else {
        document.getElementById('tipo_transacao-edit').value = 'tiposaidas'
        document.getElementById('nome-edit').value = transaction.nome
        document.getElementById('valor-edit').value = transaction.valor
        document.getElementById('tipo_entrada-edit').value = transaction.tipo_saida_id
        
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

    if (transaction.tipo_entrada_id) {
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
    transactionService.remove(transaction.id, endpoint)
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
            tipo_entrada_id: form.tipo_entrada().value,
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
            tipo_saida_id: form.tipo_entrada().value,
            usuario_id: 1,
            descricao: form.descricao().value,
            data_criacao: form.data().value,
            data_alteracao: form.data().value,
            ativo: 1
        }
        return [saidas, endpoint]
    }

}

//Cria e chama a função que salva a transação
function saveTransaction() {
    const transaction = createTransaction();
    console.log(transaction)
    if (transaction.tipo_entrada_id) {
        endpoint = 'entradas'

        if (isNewTransaction(transaction.id, endpoint)) {
            console.log('Novinha')
            //save(transaction[0], transaction[1])
            //closeModal();
        } else {
            console.log('editando')
            //update(transaction)
            //closeModalEdit();
        }
    } else {
        endpoint = 'saidas'

        if (isNewTransaction(transaction.id, endpoint)) {
            console.log('Novinha')
            //save(transaction[0], transaction[1])
            //closeModal();
        } else {
            console.log('editando')
            //update(transaction)
            //closeModalEdit();
        }
    }



    
}

//Função que chama a camada de serviço e salva a transação
function save(transaction, endpoint) {
    transactionService.save(transaction, endpoint)
}

//Atualiza transação
function update(transaction) {
    transactionService.update(transaction, endpoint)
        .then(() => {
            closeModalEdit();
        }).catch(() => {
            hideLoading();
            alert('Erro ao atualizar transação')
        })
}

//Valida se é uma nova transação ou não
function isNewTransaction(id, endpoint) {
    return transactionService.findById(id, endpoint) ? false: true;
}

function findTransactionID() {
    transactionService.getAll
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
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
    //endpoints
    let data_entradas = transactionService.getAll("entradas")
    let entradas = JSON.parse(data_entradas);

    let data_saidas = transactionService.getAll("saidas")
    let saidas = JSON.parse(data_saidas);

    let data_tiposaidas = transactionService.getAll("tiposaidas")
    let tipo_saidas = JSON.parse(data_tiposaidas);

    addTableRows(entradas, 'tipo_entrada_id', 'tipoentradas')
    addTableRows(saidas, 'tipo_saida_id', 'tiposaidas')


}
main()