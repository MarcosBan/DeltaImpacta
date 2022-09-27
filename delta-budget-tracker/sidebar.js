const menuToggle = document.querySelector('.menuToggle');
            const navigation = document.querySelector('.navigation');
            
            menuToggle.onclick = function () {
                navigation.classList.toggle('open')
            }
            const list = document.querySelectorAll('.list');
            function activeLink() {
                list.forEach((item) => 
                item.classList.remove('active'));
                this.classList.add('active');
            }
            list.forEach((item) =>
            item.addEventListener('click', activeLink))

            
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html"
    }).catch(error => {
        alert("Erro ao efetuar o logout")
    })
}

function delayed_logout() {
    setTimeout(logout, 1000)
}