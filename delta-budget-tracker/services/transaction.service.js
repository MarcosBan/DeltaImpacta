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
    remove: transaction => {
        return firebase.firestore()
        .collection("transactions")
        .doc(transaction.uid)
        .delete();
    },
    save: transaction => {
        return firebase.firestore()
        .collection('transactions')
        .add(transaction)
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