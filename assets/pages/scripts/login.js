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


// Initialize intl-tel-input
const iti = window.intlTelInput(numberInput, {
    initialCountry: "auto",
    geoIpLookup: callback => {
        fetch('https://ipinfo.io?token=<YOUR_TOKEN_HERE>') // Replace with your actual token
            .then(response => response.json())
            .then(data => callback(data.country))
            .catch(() => callback("US"));
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
});

// Set initial country code value
iti.promise.then(() => {
    const countryData = iti.getSelectedCountryData();
    numberInput.value = `+${countryData.dialCode} `;
});

// Update country code value on country change
numberInput.addEventListener("countrychange", () => {
    const countryData = iti.getSelectedCountryData();
    const countryCode = `+${countryData.dialCode} `;
    if (!numberInput.value.startsWith(countryCode)) {
        numberInput.value = countryCode; // Update the input value with the new country code
    }
});

// Prevent country code from being removed
numberInput.addEventListener("input", () => {
    const countryData = iti.getSelectedCountryData();
    const countryCode = `+${countryData.dialCode} `;
    if (!numberInput.value.startsWith(countryCode)) {
        numberInput.value = countryCode + numberInput.value.replace(/^\+\d+\s*/, "");
    }
});



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
    const emailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?!.*\1.*\1)$/;
    return emailPattern.test(email);
}

// Handle Sign-up Form Submission
signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form from submitting initially

    let formValid = true;
    signUpError.textContent = "";
    signUpNameError.textContent = "";
    signUpEmailError.textContent = "";
    signUpNumberError.textContent = "";
    signUpPasswordError.textContent = "";
    signUpCpassError.textContent = "";

    // Validate Mobile Number
    const countryData = iti.getSelectedCountryData();
    const countryCode = `+${countryData.dialCode} `;
    const mobileNumber = numberInput.value;

    // Remove the country code for validation
    const strippedNumber = mobileNumber.replace(countryCode, "").trim();

    if (
        signUpName.value.length === 0 &&
        signUpEmail.value.length === 0 &&
        numberInput.value.length === countryCode.length &&
        passInput.value.length === 0 &&
        cPassInput.value.length === 0
    ) {
        signUpError.textContent = "Create an account!";
    } else {
        // Validate Username
        if (signUpName.value.length === 0) {
            signUpNameError.textContent = "Username required";
            formValid = false;
        } else if (signUpName.value.length < 3 || signUpName.value.length > 30) {
            signUpNameError.textContent = "Username must be between 3 and 30 characters";
            formValid = false;
        } else if (!validateUsername(signUpName.value)) {
            // Specific error message if username contains only numbers
            if (/^\d+$/.test(signUpName.value)) {
                signUpNameError.textContent = "Not use only number include letters.";
            } else {
                signUpNameError.innerHTML = `<p>You can use one space. Not use one more space<br>but you can use underscores.`;
            }
            formValid = false;
        }

        // Validate Email
        if (signUpEmail.value.length === 0) {
            signUpEmailError.textContent = "Email required";
            formValid = false;
        } else if (!validateEmail(signUpEmail.value)) {
            signUpEmailError.textContent = "Enter a valid email";
            formValid = false;
        }



        // Check if the number input is empty (without the country code part)
        if (numberInput.value.length === countryCode.length) {
            signUpNumberError.textContent = "Mobile number required";
            formValid = false;
        }
        // Check if the number is valid using intl-tel-input's method
        else if (!iti.isValidNumber()) {
            signUpNumberError.textContent = "Please enter a valid mobile number";
            formValid = false;
        }
        // Check if the mobile number is "1234567890"
        else if (strippedNumber === "1234567890") {
            signUpNumberError.textContent = "Please enter a valid mobile number";
            formValid = false;
        }


        // Validate Password
        if (passInput.value.length === 0) {
            signUpPasswordError.textContent = "Password required";
            formValid = false;
        } else if (passInput.value.length < 8) {
            signUpPasswordError.textContent = "The password must be at least 8 characters";
            formValid = false;
        }
        else if (!validatePassword(passInput.value)) {
            signUpPasswordError.innerHTML = `<p>Enter strong password, with uppercase, <br>lowercase, digit, and special character.</p>`;
            formValid = false;
        }

        // Validate Confirm Password
        if (cPassInput.value !== passInput.value) {
            signUpCpassError.textContent = "Passwords do not match, Enter the correct password";
            formValid = false;
        }

        if (formValid) {
            try {
                // Check if mobile number already exists in Firestore
                const docRef = doc(db, "mobileNumbers", mobileNumber); // Store numbers in a "mobileNumbers" collection
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    signUpNumberError.textContent = "This mobile number is already in use.";
                    return;
                }

                // Proceed with Firebase Authentication
                const email = signUpEmail.value;
                const password = passInput.value;

                createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userCredential) => {
                        console.log('Signed up:', userCredential.user);

                        // Save the mobile number in Firestore
                        await setDoc(doc(db, "mobileNumbers", mobileNumber), {
                            email: email,
                            timestamp: new Date()
                        });

                        // Store the username in local storage
                        localStorage.setItem("username", signUpName.value);

                        alert('Sign-up successful! You can now log in.');

                        document.querySelectorAll(".sign_up_container input").forEach(x => {
                            x.value = "";
                        });

                        switchToLogin();
                    })
                    .catch((error) => {
                        console.log(error);

                        if (error.code === "auth/email-already-in-use") {
                            signUpEmailError.textContent = "This email is already in use.";
                        }
                    });
            } catch (error) {
                console.error("Error checking or saving mobile number:", error);
                signUpError.textContent = "An error occurred. Please try again.";
            }
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