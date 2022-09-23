function checkIfAlreadyLogged() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = "pages/home/home.html";
        }
    })
}

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    const password = form.password().value;
    if (!password) {
        return false;
    }
    return true;
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";

}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordError().style.display = password ? "none" : "block";
    
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoveryPasswordButton().disabled = !emailValid;

    //const passwordValid = isPasswordValid();
    //form.loginButton().disabled = !emailValid || !passwordValid;
}

function login() {
    showLoading();
    firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value)
    .then(response => {
        hideLoading();
        window.location.href = "pages/home/home.html"
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
        
}

function recoverPassword() {
    showLoading();
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        hideLoading();
        alert('Email enviado com sucesso');
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    })
}

function getErrorMessage(error) {
    if(error.code == "auth/wrong-password") {
        return "Senha inválida.";
    } else if (error.code == "auth/user-not-found") {
        return "Usuario não encontrado.";
    } else if (error.code == "auth/invalid-email") {
        return "E-mail inválido ou não informado."
    }
    return error.message;
}

function signup() {
    window.location.href = "pages/signup/signup.html"
}

const form = {
    email: () => document.getElementById("email"),
    password: () => document.getElementById("password"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    passwordError: () => document.getElementById("password-error"),
    recoveryPasswordButton: () => document.getElementById("recover-password-button"),
    loginButton: () => document.getElementById("login-button")
}