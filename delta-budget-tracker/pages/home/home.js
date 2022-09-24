function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html"
    }).catch(error => {
        alert("Erro ao efetuar o logout")
    })
}

function test () {
    alert('delayer')
}
