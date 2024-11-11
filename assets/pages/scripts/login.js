import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";


window.onload = function() {
    // Prevent going back to the previous page
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, null, window.location.href);
    });
};




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
// firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.onload = function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
        // If the user is logged in, redirect to the home page
        window.location.replace("./assets/pages/html/home.html");
    } 
};


const signUpName = document.getElementById("Name_input");
const signUpEmail = document.getElementById("Email_input");
const numberInput = document.getElementById("Number_input");

const signUpNameError = document.getElementById("signUpNameError");
const signUpEmailError = document.getElementById("signUpEmailError");
const signUpNumberError = document.getElementById("numberError");
const signUpPasswordError = document.getElementById("signUpPassError");
const signUpCpassError = document.getElementById("signUpCpassError");

const passInput = document.getElementById("password_input");

const cPassInput = document.getElementById("Cpassword_input");

// Login password
const passwordInput = document.getElementById("password_inputs");
// Form References
const loginForm = document.getElementById("login_form");
const signUpForm = document.getElementById("sign_up_form");
const loginError = document.getElementById("loginError");
const signUpError = document.getElementById("signUpError");

// Login page form validation Error space
const loginEmailError = document.getElementById("emailError");
const loginPasswordError = document.getElementById("passwordError");
const loginNameError = document.getElementById("nameError");

// Login page inputs
const loginEmail = document.getElementById("Email_inputs");
const loginName = document.getElementById("Name_inputs");


/* if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "./assets/pages/html/home.html";
} */
// Sign up form validation
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the form from submitting initially

    let formValid = true;

    // Reset error messages
    signUpError.textContent = "";
    signUpNameError.textContent = "";
    signUpEmailError.textContent = "";
    signUpNumberError.textContent = "";
    signUpPasswordError.textContent = "";
    signUpCpassError.textContent = "";

    if (signUpName.value.length === 0 && signUpEmail.value.length === 0 && numberInput.value.length === 0 && passInput.value.length === 0 && cPassInput.value.length === 0) {
        signUpError.textContent = "Create an account!";
    } else {
        // Validate fields
        if (signUpName.value.length === 0) {
            signUpNameError.textContent = "Username required";
            formValid = false;
        } else if (signUpName.value.length < 3 || signUpName.value.length > 30) {
            signUpNameError.textContent = "Username must be between 3 and 30 characters";
            formValid = false;
        }

        if (signUpEmail.value.length === 0) {
            signUpEmailError.textContent = "Email required";
            formValid = false;
        } else if (signUpEmail.validity.typeMismatch) {
            signUpEmailError.textContent = "Enter valid email";
            formValid = false;
        }

        if (numberInput.value.length === 0) {
            signUpNumberError.textContent = "Mobile number required";
            formValid = false;
        } else if (numberInput.value.length !== 10 || isNaN(numberInput.value)) {
            signUpNumberError.textContent = "Only enter 10 numeric digits";
            formValid = false;
        }

        if (passInput.value.length === 0) {
            signUpPasswordError.textContent = "Password required";
            formValid = false;
        } else if (passInput.value.length < 6) {
            signUpPasswordError.textContent = "The password must be at least 6 characters";
            formValid = false;
        }

        if (cPassInput.value !== passInput.value) {
            signUpCpassError.textContent = "Passwords do not match";
            formValid = false;
        }

        // If the form is valid, proceed with Firebase authentication
        if (formValid) {
            const email = signUpEmail.value;
            const password = passInput.value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log('Signed up:', userCredential.user);

                    // Show the success alert
                    alert('Sign-up successful! You can now log in.');


                    // Clear the form inputs
                    document.querySelectorAll(".sign_up_container input").forEach(x => {
                        x.value = "";
                    });

                    // Redirect to the login page or switch the form view
                    switchToLogin();
                })
                .catch((error) => {
                    console.log(error);
                });


        }
    }
});






// Handle Confirm Password validation
cPassInput.addEventListener("input", () => {
    if (cPassInput.value !== passInput.value) {
        signUpCpassError.textContent = "Passwords do not match, Enter the correct password";
    } else {
        signUpCpassError.textContent = "";
    }
});

// Handle Mobile Number input validation
numberInput.addEventListener("input", () => {
    if (numberInput.value.length !== 10) {
        signUpNumberError.textContent = `Only enter 10 numbers, Your entered ${numberInput.value.length}.`;
    } else {
        signUpNumberError.textContent = "";
    }
});

// Restrict Mobile Number input to only numbers
numberInput.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');

    if (event.target.value.length > 10) {
        event.target.value = event.target.value.slice(0, 10);
    }
});


// Switch to login form after successful sign-up
function switchToLogin() {
    signUpContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
}


// Login form validation 
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasError = false;

    // Clear previous error messages
    loginError.textContent = "";
    loginNameError.textContent = "";
    loginEmailError.textContent = "";
    loginPasswordError.textContent = "";

    if (loginName.value.length === 0 && loginEmail.value.length === 0 && passwordInput.value.length === 0) {
        loginError.textContent = "Please fill in all fields.";
    }
    else {

        if (loginName.value.length === 0) {
            loginNameError.textContent = "User name required";
            hasError = true;
        }

        if (loginEmail.value.length === 0) {
            loginEmailError.textContent = "Email required";
            hasError = true;
        }

        if (passwordInput.value.length === 0) {
            loginPasswordError.textContent = "Password required";
            hasError = true;
        }

        // If there's any error, display a message and stop form submission
        if (hasError) {
            loginError.textContent = "";
            return; // Stop further execution
        }

        // Proceed with Firebase login if no errors
        const email = loginEmail.value;
        const password = passwordInput.value;
        const username = loginName.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                loginError.textContent = '';
                console.log('Logged in:', userCredential.user);

                // Redirect to the home page
                window.location.href = "./assets/pages/html/home.html";

                // Store the username in local storage
                localStorage.setItem("loggedIn", "true");

                localStorage.setItem("username", username);
                // Clear the form inputs
                document.querySelectorAll(".login-container input").forEach(x => {
                    x.value = "";
                });
            })
            .catch((error) => {
                console.log(error);
                loginError.textContent = "Login failed. Please check your credentials.";
            });
    }
});


// Login page password toggle
const togglePassword = document.querySelector('#togglePassword');
const icon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
});

// Sign up password toggle
const signUpToggle = document.getElementById("signUp-Password-Toggle");

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






