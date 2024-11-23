import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

// Prevent going back to the previous page using browser's back button
window.history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function () {
    window.history.pushState(null, null, window.location.href);
});

// Element References for Login and SignUp
const goSignUp = document.getElementById("go_sign_up");
const goLoginPage = document.getElementById("go_login_page");
const loginContainer = document.querySelector(".login-container");
const signUpContainer = document.querySelector(".sign_up_container");

// Toggle Visibility for Login and Sign-up Pages
goSignUp.addEventListener("click", () => {
    loginContainer.classList.add("hidden");
    signUpContainer.classList.remove("hidden");
    document.title = "Sign up";
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensure user is logged in before visiting home page
window.onload = function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
        // If the user is logged in, redirect to the home page
        window.location.replace("./assets/pages/html/home.html");
    }
};

// Sign-up Form Elements
const signUpName = document.getElementById("Name_input");
const signUpEmail = document.getElementById("Email_input");
const numberInput = document.getElementById("Number_input");
const passInput = document.getElementById("password_input");
const cPassInput = document.getElementById("Cpassword_input");

// Sign-up Form Error Elements
const signUpNameError = document.getElementById("signUpNameError");
const signUpEmailError = document.getElementById("signUpEmailError");
const signUpNumberError = document.getElementById("numberError");
const signUpPasswordError = document.getElementById("signUpPassError");
const signUpCpassError = document.getElementById("signUpCpassError");

// Login Form Elements
const passwordInput = document.getElementById("password_inputs");
const loginEmail = document.getElementById("Email_inputs");
const loginName = document.getElementById("Name_inputs");

// Form References
const loginForm = document.getElementById("login_form");
const signUpForm = document.getElementById("sign_up_form");
const loginError = document.getElementById("loginError");
const signUpError = document.getElementById("signUpError");

// Login page form validation Error space
const loginEmailError = document.getElementById("emailError");
const loginPasswordError = document.getElementById("passwordError");
const loginNameError = document.getElementById("nameError");






// Validate username pattern
function validateUsername(username) {
    const usernamePattern = /^(?=.*[a-zA-Z])([a-zA-Z0-9_]+ ?[a-zA-Z0-9_]*)$/;
    return usernamePattern.test(username);
}

// Validate password strength
function validatePassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
}

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}



signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form submission initially

    let formValid = true;
    signUpError.textContent = "";
    signUpNameError.textContent = "";
    signUpEmailError.textContent = "";
    signUpNumberError.textContent = "";
    signUpPasswordError.textContent = "";
    signUpCpassError.textContent = "";

    const number = numberInput.value.trim(); // Trim spaces
    const regex = /^[6-9]\d{9}$/; // Indian mobile number format

    if (
        signUpName.value.length === 0 &&
        signUpEmail.value.length === 0 &&
        numberInput.value.length === 0 &&
        passInput.value.length === 0 &&
        cPassInput.value.length === 0
    ) {
        signUpError.textContent = "Create an account!";
    } else {
        // Username Validation
        if (signUpName.value.length === 0) {
            signUpNameError.textContent = "Username required";
            formValid = false;
        } else if (signUpName.value.length < 3 || signUpName.value.length > 30) {
            signUpNameError.textContent = "Username must be between 3 and 30 characters";
            formValid = false;
        } else if (!validateUsername(signUpName.value)) {
            if (/^\d+$/.test(signUpName.value)) {
                signUpNameError.textContent = "Not use only number include letters.";
            } else {
                signUpNameError.innerHTML = `You can use one space. Not use multiple <br>spaces, but underscores are allowed.`;
            }
            formValid = false;
        }

        // Email Validation
        if (signUpEmail.value.length === 0) {
            signUpEmailError.textContent = "Email required";
            formValid = false;
        } else if (!validateEmail(signUpEmail.value)) {
            signUpEmailError.textContent = "Enter a valid email";
            formValid = false;
        }

        // Mobile Number Validation
        if (number.length === 0) {
            signUpNumberError.textContent = "Mobile number required";
            formValid = false;
        } else if (!regex.test(number)) {
            signUpNumberError.textContent = "Please enter a valid mobile number";
            formValid = false;
        } else {
            // Check if the mobile number is already used in Firestore
            const docRef = doc(db, "users", number);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                signUpNumberError.textContent = "Mobile number already in use";
                formValid = false;
            }
        }

        // Password Validation
        if (passInput.value.length === 0) {
            signUpPasswordError.textContent = "Password required";
            formValid = false;
        } else if (passInput.value.length < 8) {
            signUpPasswordError.textContent = "Password must be at least 8 characters";
            formValid = false;
        } else if (!validatePassword(passInput.value)) {
            signUpPasswordError.innerHTML = `Enter a strong password with uppercase, <br>lowercase, digit, and special character.`;
            formValid = false;
        }

        // Confirm Password Validation
        if (cPassInput.value !== passInput.value) {
            signUpCpassError.textContent = "Passwords do not match";
            formValid = false;
        }

        // If all validations pass
        if (formValid) {
            const email = signUpEmail.value;
            const password = passInput.value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    console.log("Signed up:", userCredential.user);

                    // Save user data in Firestore
                    await setDoc(doc(db, "users", number), {
                        name: signUpName.value,
                        email: email,
                        number: number,
                    });

                    // Create and display the success message
                    const messageContainer = document.createElement('div');
                    messageContainer.textContent = "Sign-up successful! You can now log in.";
                    messageContainer.classList.add('success-message'); // Add a class for styling
                    document.body.appendChild(messageContainer); // Append it to the body or a specific container

                    // Automatically hide the message after 3 seconds
                    setTimeout(() => {
                        messageContainer.classList.add('hide'); // Add a class for fade-out animation
                    }, 3000);

                    // Remove the message from the DOM after the animation completes
                    setTimeout(() => {
                        messageContainer.remove();
                    }, 4000); // Slightly longer to account for the fade-out duration

                    // Clear input fields
                    document.querySelectorAll(".sign_up_container input").forEach((x) => {
                        x.value = "";
                    });

                    // Store the username in local storage
                    localStorage.setItem("username", signUpName.value);

                    switchToLogin();
                })
                .catch((error) => {
                    console.log(error);
                    if (error.code === "auth/email-already-in-use") {
                        signUpEmailError.textContent = "This email is already in use.";
                    }
                });


        }
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

        const storedUsername = localStorage.getItem("username");

        if (storedUsername && loginName.value !== storedUsername) {
            loginNameError.textContent = "Username does not match.";
            return; // Stop further execution if usernames do not match
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                loginError.textContent = '';
                console.log('Logged in:', userCredential.user);

                window.location.href = "./assets/pages/html/home.html";
                localStorage.setItem("loggedIn", "true");

                localStorage.setItem("usersName", username);

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