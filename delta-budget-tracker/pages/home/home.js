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
    let data = transactionService.getAll(endpoint)
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
    let entrada_raw = transactionService.getAll('entradas')
    const entradas = JSON.parse(entrada_raw)

    let saida_raw = transactionService.getAll('saidas')
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

function countUniqArray(array) {
    count = array.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null))
    return count
 }


 function removeDuplicates(array) {
    return array.filter((item,
        index) => array.indexOf(item) === index);
}

function getBarDataValor() {
    const entradas = getData('entradas')
    const saidas = getData('saidas')
    labels = []
    dict_entradas = []
    dict_saidas = []
    dados_entradas = []
    dados_saidas = []
        
   entradas.forEach(entrada => {
        data_cr = entrada['data_criacao'].substring(0, 10)
        valor = entrada['valor']
        dict_entradas.push({Id: data_cr, qty: valor})
        labels.push(entrada['data_criacao'].substring(0, 10))
    });

    saidas.forEach(saida => {
        data_cr = saida['data_criacao'].substring(0,10)
        valor = saida['valor']
        dict_saidas.push({Id: data_cr, qty: valor})
        labels.push(saida['data_criacao'].substring(0, 10))
    });
    
      var result_entradas = [];
      dict_entradas.reduce(function(res, value) {
        if (!res[value.Id]) {
          res[value.Id] = { Id: value.Id, qty: 0 };
          result_entradas.push(res[value.Id])
        }
        res[value.Id].qty += value.qty;
        return res;
      }, {});

      var result_saidas = [];
      dict_saidas.reduce(function(res, value) {
        if (!res[value.Id]) {
          res[value.Id] = { Id: value.Id, qty: 0 };
          result_saidas.push(res[value.Id])
        }
        res[value.Id].qty += value.qty;
        return res;
      }, {});
    
    result_entradas.forEach(resultado => {
        dados_entradas.push(resultado['qty'])
    })
    result_saidas.forEach(resultado => {
        dados_saidas.push(resultado['qty'])
    })

    label_final = removeDuplicates(labels)
    const data = {
        
        labels: label_final,
        datasets: [
            {
                label: "Entradas",
                data: dados_entradas,
                borderColor: "#ffffff",
                backgroundColor: "#58d168",
            },
            {
                label: "Saídas",
                data: dados_saidas,
                borderColor: "#ffffff",
                backgroundColor: "#d15858",
            }
        ]
    
    }
    return data;
}

function getxValuesByCategory() {
    const saidas = getData('saidas')
    nomeCateg = []


    saidas.forEach(saida => {
        nome_categ = getNameFromID(saida['tipo_saida'], 'tiposaidas')
        nomeCateg.push(nome_categ)
    })
    return removeDuplicates(nomeCateg)
}

function getyValuesByCategory() {
    const saidas = getData('saidas')
    nomeCateg = []
    count_categ = []


    saidas.forEach(saida => {
        nome_categ = getNameFromID(saida['tipo_saida'], 'tiposaidas')
        nomeCateg.push(nome_categ)
    })

    countCateg = countUniqArray(nomeCateg)

    count_categ = Object.values(countCateg)

    return count_categ
}

function getxValuesByValue() {
    const saidas = getData('saidas')
    nomeCateg = []


    saidas.forEach(saida => {
        nome_categ = getNameFromID(saida['tipo_saida'], 'tiposaidas')
        nomeCateg.push(nome_categ)
    })
    return removeDuplicates(nomeCateg)
}

function getyValuesByValue() {
    const saidas = getData('saidas')
    nomeCateg = []
    dict_saidas = []
    sum_saidas = []


    saidas.forEach(saida => {
        nome_categ = getNameFromID(saida['tipo_saida'], 'tiposaidas')
        nomeCateg.push(nome_categ)
        valor = saida['valor']
        dict_saidas.push({ Id: [nome_categ], qty: valor })
    })

      var result = [];
      dict_saidas.reduce(function(res, value) {
        if (!res[value.Id]) {
          res[value.Id] = { Id: value.Id, qty: 0 };
          result.push(res[value.Id])
        }
        res[value.Id].qty += value.qty;
        return res;
      }, {});
      
      result.forEach(soma => {
        sum_saidas.push(soma['qty'])
    })
    return sum_saidas
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

function getData(endpoint) {
    const data_raw = transactionService.getAll(endpoint)
    const entradas = JSON.parse(data_raw)
    return entradas
}