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
        return firebase.firestore()
        .collection('transactions')
        .doc(getTransactionUid())
        .update(transaction)
    }
}

function callApi({method, endpoint}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, endpoint, true)

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

        xhr.send();
    })
}