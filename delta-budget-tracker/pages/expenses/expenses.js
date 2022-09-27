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
    showLoading()
    firebase.firestore()
    .collection('transactions')
    .where('user.uid', '==', user.uid)
    .orderBy('date', 'desc')
    .get()
    .then(snapshot => {
        hideLoading()
        const transactions = snapshot.docs.map(doc => doc.data());
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
        orderedList.appendChild(li);

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
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}
