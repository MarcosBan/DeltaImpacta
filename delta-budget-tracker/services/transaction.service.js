const transactionService = {
    findByUser: () => {
        return callApi({
            method: "GET",
            endpoint: "http://localhost:3000/transactions"
        })
    },
    findByUid: uid => {
        return callApi({
            method: "GET",
            endpoint: `http://localhost:3000/transactions/${uid}`
        })
    },
    remove: uid => {
        return callApi({
            method: "DELETE",
            endpoint: `http://localhost:3000/transactions/${uid}`
        })
    },
    save: transaction => {
        return callApi({
            method: "POST",
            endpoint: "http://localhost:3000/transactions",
            params: transaction
        })
    },
    update: transaction => {
        return callApi({
            method: "PATCH",
            endpoint: `http://localhost:3000/transactions/${transaction.uid}`,
            params: transaction
        })
    }
}

function callApi({method, endpoint, params}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, endpoint, true)
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