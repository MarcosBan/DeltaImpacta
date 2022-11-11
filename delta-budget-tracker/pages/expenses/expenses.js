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
        const li = document.createElement('li')
        li.classList.add(transaction.type);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            window.location.href="../transaction/transaction.html?uid=" + transaction.uid;
        })

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("outline", "danger");
        deleteButton.addEventListener("click", event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        })
        deleteButton.innerHTML = "Excluir";

        li.appendChild(deleteButton)

        const editButton = document.createElement("button");
        editButton.classList.add("outline", "edit");
        editButton.addEventListener("click", event => {
            event.stopPropagation();
            window.location.href="../transaction/transaction.html?uid=" + transaction.uid;
        })
        editButton.innerHTML = "Editar";

        li.appendChild(editButton)
        
        const date = document.createElement('p');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);

        const type = document.createElement('p');
        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        if (transaction.description) {
            const description = document.createElement('p');
            description.innerHTML = transaction.description;
            li.appendChild(description);
        }

        orderedList.appendChild(li);
        
    });
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