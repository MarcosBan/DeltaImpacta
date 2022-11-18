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

main()