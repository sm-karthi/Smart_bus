
// Element References
const goSignUp = document.getElementById("go_sign_up");
const goLoginPage = document.getElementById("go_login_page");
const loginContainer = document.querySelector(".login-container");
const signUpContainer = document.querySelector(".sign_up_container");

// Toggle Visibility for Login and Sign-up Pages
goSignUp.addEventListener("click", () => {
    loginContainer.classList.add("hidden");
    signUpContainer.classList.remove("hidden");
    document.title = "Sign up"
});

goLoginPage.addEventListener("click", () => {
    signUpContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
    document.title = "Login";
});


// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
    authDomain: "smartbus-7443b.firebaseapp.com",
    projectId: "smartbus-7443b",
    storageBucket: "smartbus-7443b.appspot.com",
    messagingSenderId: "35022257891",
    appId: "1:35022257891:web:8eed74fb4131a414730fd6"
};
firebase.initializeApp(firebaseConfig);

// Form References
const loginForm = document.getElementById("login_form");
const signUpForm = document.getElementById("sign_up_form");
const loginError = document.getElementById("loginError");
const signUpError = document.getElementById("signUpError");

// Handle Login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            loginError.textContent = '';
            console.log('Logged in:', userCredential.user);
            window.location.href = "./assets/pages/html/home.html";
            document.querySelectorAll(".login-container input").forEach(x => {
                x.value = "";
            })

        })
        .catch((error) => {
            console.log(error);

        });
});

// Handle Sign-Up
signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Signed up:', userCredential.user);
            alert('Sign-up successful! You can now log in.');
            document.querySelectorAll(".sign_up_container input").forEach(x => {
                x.value = "";
            });
            switchToLogin();
        })
        .catch((error) => {
            console.log(error);
        });
});

function switchToLogin() {
    signUpContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
}


// Login page password toggle
const password = document.getElementById("password_inputs");
const togglePassword = document.querySelector('#togglePassword');
const icon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        password.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
});

// Sign up password toggle
const signUpToggle = document.getElementById("signUp-Password-Toggle");
const passInput = document.getElementById("password_input");
const icons = signUpToggle.querySelector("i");

signUpToggle.addEventListener("click", () => {
    if (passInput.type === "password") {
        passInput.type = "text";
        icons.classList.remove("fa-eye-slash");
        icons.classList.add("fa-eye");
    } else {
        passInput.type = "password";
        icons.classList.remove("fa-eye");
        icons.classList.add("fa-eye-slash");
    }
});

// Sign up confirm password toggle
const confirmPassToggle = document.getElementById("confirm-Password-Toggle");
const cPassInput = document.getElementById("Cpassword_input");
const Cicon = confirmPassToggle.querySelector("i");

confirmPassToggle.addEventListener("click", () => {
    if (cPassInput.type === "password") {
        cPassInput.type = "text";
        Cicon.classList.remove("fa-eye-slash");
        Cicon.classList.add("fa-eye");
    } else {
        cPassInput.type = "password";
        Cicon.classList.remove("fa-eye");
        Cicon.classList.add("fa-eye-slash");
    }
});

// Login page form validation Error space
const loginNameError = document.getElementById("nameError");
const loginEmailError = document.getElementById("emailError");
const loginPasswordError = document.getElementById("passwordError");

// Sign up page form validation Error space
const signUpNameError = document.getElementById("signUpNameError");
const signUpEmailError = document.getElementById("signUpEmailError");
const signUpNumberError = document.getElementById("numberError");
const signUpPasswordError = document.getElementById("signUpPassError");
const signUpCpassError = document.getElementById("signUpCpassError");

// Login page inputs
const loginName = document.getElementById("Name_inputs");
const loginEmail = document.getElementById("Email_inputs");

// Sign up page inputs
const signUpName = document.getElementById("Name_input");
const signUpEmail = document.getElementById("Email_input");
const numberInput = document.getElementById("Number_input");


// Sign up form validation
signUpForm.addEventListener("submit", (e) => {

    if (signUpName.value.length === 0 && signUpEmail.value.length === 0 && numberInput.value.length === 0 && passInput.value.length === 0 && cPassInput.value.length === 0) {

        e.preventDefault();
        signUpError.textContent = "Create an account!";
    }
    else {
        e.preventDefault();
        signUpError.textContent = "";

        // Name error handle
        if (signUpName.value.length === 0) {
            e.preventDefault();
            signUpNameError.textContent = "User required";
        }
        else if (signUpName.value.length > 3 || signUpName.value.length < 30) {
            signUpNameError.textContent = "";

        }
        else {
            e.preventDefault();
            signUpNameError.textContent = "Username must be between 3 and 30 characters";
        }

        // Email error handle
        if (signUpEmail.value.length === 0) {
            e.preventDefault();
            signUpEmailError.textContent = "Email required";
        }
        else if (signUpEmail.validity.typeMismatch) {
            e.preventDefault();
            signUpEmailError.textContent = "Enter valid email";
        }
        else {
            signUpEmailError.textContent = "";
        }

        // Mobile number error handle
        if (numberInput.value.length === 0) {
            e.preventDefault();
            signUpNumberError.textContent = "Mobile number required";
        }
        else if (numberInput.value.length !== 10) {
            e.preventDefault();
            signUpNumberError.textContent = "Only enter 10 numbers";
        }
        else {
            signUpNumberError.textContent = "";
        }

        // password error handle
        if (passInput.value.length === 0) {
            e.preventDefault();
            signUpPasswordError.textContent = "Password required";
        }
        else if (passInput.value.length < 6) {
            e.preventDefault();
            signUpPasswordError.textContent = "The password must be at least 6 characters";
        }
        else {
            signUpPasswordError.textContent = "";
        }

        // Confirm password error handle
        if (cPassInput.value !== passInput.value) {
            e.preventDefault();
            signUpCpassError.textContent = "Passwords not match";
        }
        else {
            signUpCpassError.textContent = "";
        }
    }

});

cPassInput.addEventListener("input", () => {
    if(cPassInput.value !== passInput.value){
        signUpCpassError.textContent = "Passwords not match, Enter the correct password";
    }
    else {
        signUpCpassError.textContent = "";
    }
})

// Login form validation
loginForm.addEventListener("submit", (e) => {


    if (loginName.value.length === 0 && loginEmail.value.length === 0 && password.value.length === 0) {
        e.preventDefault();
        loginError.textContent = "Fill the all fields!";
    } else {

        e.preventDefault();
        loginError.textContent = "";

        // User name error handle
        if (loginName.value.length === 0) {
            e.preventDefault();
            loginNameError.textContent = "User name required";
        }
        // else if (loginName.value !== signUpName.value) {
        //     e.preventDefault();
        //     loginNameError.textContent = "Enter the same user name";
        // }
        else {
            loginNameError.textContent = "";
        }

        // Email error handle
        if (loginEmail.value.length === 0) {
            e.preventDefault();
            loginEmailError.textContent = "Email required";
        }
        // else if (loginEmail.value !== signUpEmail.value) {
        //     e.preventDefault();
        //     loginEmailError.textContent = "Enter the same email";
        // }
        else {
            loginEmailError.textContent = "";
        }

        // Password error handle
        if (password.value.length === 0) {
            e.preventDefault();
            loginPasswordError.textContent = "Password required";
        }
        // else if (password.value !== passInput.value) {
        //     e.preventDefault();
        //     loginPasswordError.textContent = "Enter the same password";
        // }
        else {
            loginPasswordError.textContent = "";
        }
    }
});
