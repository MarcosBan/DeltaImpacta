function toHome() {
    window.location.href = "./home.html";
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
    window.location.href = "../user/user.html";
}

function delayed_user() {
    setTimeout(toUser, 600)
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

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

//Recupera nome do tipo da transação por id
function getNameFromID(transactionTypeID, endpoint) {
    debugger
    let data = transactionServiceDevelop.getAll(endpoint)
    let transactionType = JSON.parse(data);
    let nome = 'vazio'

    transactionType.forEach(type => {
        if (transactionTypeID == type.id) {
            nome = type.nome;
        }
    }); return nome;
}

//Gera gráfico de todas as entradas por tipo
function getxValues() {
    values = ["Entradas", "Saídas"]

    return values
}


function getyValues() {
    let entrada_raw = transactionServiceDevelop.getAll('entradas')
    const entradas = JSON.parse(entrada_raw)

    let saida_raw = transactionServiceDevelop.getAll('saidas')
    const saidas = JSON.parse(saida_raw)
    values_entradas = []
    values_saidas = []
    values = []

    entradas.forEach(entrada => {
        values_entradas.push(entrada['valor'])
    });

    saidas.forEach(saida => {
        values_saidas.push(saida['valor'])
    });

    sum_entradas = values_entradas.reduce((a, b) => a + b, 0)
    sum_saidas = values_saidas.reduce((a, b) => a + b, 0)

    values.push(sum_entradas, sum_saidas)

    return values
}

function getBarDataValor() {
    let entrada_raw = transactionServiceDevelop.getAll('entradas')
    const entradas = JSON.parse(entrada_raw)

    let saida_raw = transactionServiceDevelop.getAll('saidas')
    const saidas = JSON.parse(saida_raw)
    labels = []

    entradas.forEach(entrada => {
        labels.push(entrada['data_alteracao'].substring(0, 10))
    });


    saidas.forEach(saida => {
        labels.push(saida['data_alteracao'].substring(0, 10))
    })

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Entradas",
                data: "Dados vem aqui",
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: "Saídas",
                data: "Dados vem aqui",
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]

    }
    return data;
}

function getyValuesNomeValor() {
    let entrada_raw = transactionServiceDevelop.getAll('entradas')
    const entradas = JSON.parse(entrada_raw)

    let saida_raw = transactionServiceDevelop.getAll('saidas')
    const saidas = JSON.parse(saida_raw)
    values = []

    entradas.forEach(entrada => {
        values.push(entrada['valor'])
    });


    saidas.forEach(saida => {
        values.push(saida['valor'])
    })
    return values;
}