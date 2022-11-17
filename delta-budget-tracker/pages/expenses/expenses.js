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

function newTransaction() {
    window.location.href="../transaction/transaction.html"
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


firebase.auth().onAuthStateChanged(user => {
    if(user){
        findTransactions(user);
    }
})

function findTransactions(user) {
    transactionService.findByUser(user)
    .then(transactions => {
        hideLoading();
        addTransactionToScreen(transactions);
    }).catch(error => {
        hideLoading();
        console.log(error);
        alert('Erro ao recuperar transações')
    })
};

function addTransactionToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));
        li.appendChild(createEditButton(transaction));
        li.appendChild(createParagraph(formatDate(transaction.date)));
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.type));
        
        if (transaction.description) {
            li.appendChild(createParagraph(transaction.description));
        }
        orderedList.appendChild(li);
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement('li')
        li.classList.add(transaction.type);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            window.location.href="../transaction/transaction.html?uid=" + transaction.uid;
        })
        return li;
}

function createDeleteButton(transaction) {
    const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Excluir";
        deleteButton.classList.add("outline", "danger");
        deleteButton.addEventListener("click", event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        })
        return deleteButton;
}

function createEditButton(transaction) {
    const editButton = document.createElement("button");
        editButton.innerHTML = "Editar";
        editButton.classList.add("outline", "edit");
        editButton.addEventListener("click", event => {
            event.stopPropagation();
            window.location.href="../transaction/transaction.html?uid=" + transaction.uid;
        })
        return editButton;        
}

function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;
    return element;
    }


function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transação?');
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();
    transactionService.remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        }).catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover transação')
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}