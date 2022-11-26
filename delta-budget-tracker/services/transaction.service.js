const transactionServiceDevelop = {
    getByID(id, endpoint) {
        let request = new XMLHttpRequest()
        //request.open("GET", `https://apibudgettracker.azurewebsites.net/${endpoint}/view/${id}`, false)
        request.open("GET", `http://localhost:3000/${endpoint}/${id}`, false)
        request.send()
        return request.responseText
    },

    getAll(endpoint) {
        let request = new XMLHttpRequest()
        request.open("GET", `http://localhost:3000/${endpoint}`, false)
        request.send()
        return request.responseText
    },

    findById: (id, endpoint) => {
        return callApi({
            method: "GET",
            endpoint: `http://localhost:3000/${endpoint}/${id}`
        })
    },
    remove: (id, endpoint) => {
        return callApi({
            method: "DELETE",
            endpoint: `http://localhost:3000/${endpoint}/${id}`
        })
    },
    save: (transaction, endpoint) => {
        let request = new XMLHttpRequest()
        request.open("POST", `http://localhost:3000/${endpoint}`, false)
        request.send(transaction)
    },
    update: (transaction, endpoint) => {
        console.log(transaction, endpoint)
        return callApi({
            method: "PATCH",
            endpoint: `http://localhost:3000/${endpoint}/${transaction.id}`,
            params: transaction
        })
    }
}

const transactionService = {
    getByID(id, endpoint) {
        let request = new XMLHttpRequest()
        request.open("GET", `https://apibudgettracker.azurewebsites.net/${endpoint}/view/${id}`, false)
        request.send()
        return request.responseText
    },

    getAll(endpoint) {
        let request = new XMLHttpRequest()
        request.open("GET", `https://apibudgettracker.azurewebsites.net/${endpoint}`, false)
        request.send()
        return request.responseText
    },

    findById: (id, endpoint) => {
        return callApi({
            method: "GET",
            endpoint: `https://apibudgettracker.azurewebsites.net/${endpoint}/view/${id}`
        })
    },
    remove: (id, endpoint) => {
        return callApi({
            method: "DELETE",
            endpoint: `https://apibudgettracker.azurewebsites.net/${endpoint}/remove/${id}`
        })
    },
    save: (transaction, endpoint) => {
            return callApi({
            method: "POST",
            endpoint: `https://apibudgettracker.azurewebsites.net/${endpoint}`,
            params: transaction
        })
    },
    update: (transaction, endpoint) => {
        console.log(transaction, endpoint)
        return callApi({
            method: "PUT",
            endpoint: `https://apibudgettracker.azurewebsites.net/${endpoint}/${transaction.id}`,
            params: transaction
        })
    }
}

function callApi({method, endpoint, params}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, endpoint, false)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
            const json = JSON.parse(this.responseText);
            if (this.status != 200) {
                reject(json);
            } else {
                resolve(json);
            }
        }
    };

        xhr.send(JSON.stringify(params));
    })
}