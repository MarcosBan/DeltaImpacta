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
        /*
        const header = document.createElement('div')
        header.classList.add('header')

        const dropbtn = document.createElement('div')
        dropbtn.classList.add('dropdown')
        
        const unordList = document.createElement('ul')
        unordList.classList.add('dropbtn')
        unordList.classList.add('icons')
        unordList.classList.add('btn-right')
        unordList.classList.add('showLeft')
        
        const subLi1 = document.createElement('li')
        const subLi2 = document.createElement('li')
        const subLi3 = document.createElement('li')
        unordList.appendChild(subLi1)
        unordList.appendChild(subLi2)
        unordList.appendChild(subLi3)
        unordList.setAttribute('onclick', 'showDropdown()')

        dropbtn.appendChild(unordList)

        const dropMenu = document.createElement('div')
        dropMenu.setAttribute('id', 'myDropdown')
        dropMenu.classList.add('dropdown-content')
        
        const edit = document.createElement('a')
        edit.setAttribute('href', '#')
        edit.innerHTML = 'Editar'

        const del = document.createElement('a')
        del.setAttribute('href', '#')
        del.innerHTML = 'Excluir'

        dropMenu.appendChild(edit)
        dropMenu.appendChild(del)

        dropbtn.appendChild(dropMenu)
        header.appendChild(dropbtn	)
  
        li.appendChild(header) */
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}

function changeLanguage(language) {
    var element = document.getElementById("url");
    element.value = language;
    element.innerHTML = language;
}