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












// Set the initial value of the number input to "+91 "
numberInput.value = "+91  ";

// Ensure the cursor always starts after "+91 " when focused
numberInput.addEventListener("focus", function () {
    if (numberInput.selectionStart < 5) { // Corrected index to 5 since "+91 " is 5 characters
        numberInput.setSelectionRange(5, 5); // Position cursor after "+91 "
    }
});

// Prevent deletion or modification of the "+91 " prefix
numberInput.addEventListener("keydown", function (e) {
    const cursorPosition = numberInput.selectionStart;

    // Block backspace or delete from affecting the "+91 " prefix
    if ((e.key === "Backspace" || e.key === "Delete") && cursorPosition <= 4) {
        e.preventDefault(); // Prevent deleting the "+91 " prefix
    }

    // Allow both Backspace and Delete after the "+91 " prefix (index > 4)
    if (cursorPosition > 4) {
        // Allow Backspace and Delete after the "+91 " prefix
        if (e.key === "Backspace" || e.key === "Delete") {
            return; // Allow deleting selected content or previous characters
        }

        // Allow both letters and digits or navigation keys after "+91 "
        if (
            !/^[a-zA-Z0-9]$/.test(e.key) &&  // Allow letters and digits
            e.key !== "ArrowLeft" && 
            e.key !== "ArrowRight" && 
            e.key !== "Tab"
        ) {
            e.preventDefault(); // Prevent non-letter and non-digit inputs
        }
    }
});

// Allow pasting content (both letters and digits) and append it after the "+91 " prefix
numberInput.addEventListener("paste", function (e) {
    e.preventDefault(); // Prevent default paste behavior

    // Get the pasted data
    const pasteData = (e.clipboardData || window.clipboardData).getData("text");

    // Remove non-letter and non-digit characters from pasted data
    const validContent = pasteData.replace(/[^a-zA-Z0-9]/g, "");

    if (validContent) {
        const currentValue = numberInput.value.slice(0, 4); // Keep the "+91 " prefix
        numberInput.value = currentValue + validContent; // Append the letters and digits after "+91 "

        // Move the cursor to the end of the input
        numberInput.setSelectionRange(numberInput.value.length, numberInput.value.length);
    }
});

// Prevent editing or removing the "+91 " prefix
numberInput.addEventListener("input", function () {
    if (!numberInput.value.startsWith("+91  ")) {
        numberInput.value = "+91  " + numberInput.value.slice(4); // Corrected to slice from index 4
    }
});

// Allow selecting the entire input and preserve "+91 " prefix
numberInput.addEventListener("select", function () {
    if (numberInput.selectionStart < 5) { // Ensure selection only occurs after "+91 "
        numberInput.setSelectionRange(5, numberInput.value.length); // Restrict selection to digits and letters
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
    const emailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Validate Indian mobile number pattern
function validateIndianMobileNumber(mobileNumber) {
    const indianMobilePattern = /^[6-9]\d{9}$/; // Starts with 6-9 and is 10 digits long
    return indianMobilePattern.test(mobileNumber);
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

    if (
        signUpName.value.length === 0 &&
        signUpEmail.value.length === 0 &&
        numberInput.value.length === 0 &&
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
            signUpNameError.textContent = "Username can include letters, numbers, and underscores.";
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

        // Validate Mobile Number
        const mobileNumber = numberInput.value.replace("+91 ", ""); // Remove the "+91 " prefix before validation
        if (mobileNumber.length === 0) {
            signUpNumberError.textContent = "Mobile number required";
            formValid = false;
        } else if (!validateIndianMobileNumber(mobileNumber)) {
            signUpNumberError.textContent = "Please enter valid mobile number";
            formValid = false;
        }

        // Validate Password
        if (passInput.value.length === 0) {
            signUpPasswordError.textContent = "Password required";
            formValid = false;
        } else if (passInput.value.length < 8) {
            signUpPasswordError.textContent = "The password must be at least 8 characters";
            formValid = false;
        } else if (!validatePassword(passInput.value)) {
            signUpPasswordError.innerHTML = `Enter strong password, with uppercase, lowercase, digit, and special character.`;
            formValid = false;
        }

        // Validate Confirm Password
        if (cPassInput.value.length === 0) {
            signUpCpassError.textContent = "Confirm your password";
            formValid = false;
        } else if (cPassInput.value !== passInput.value) {
            signUpCpassError.textContent = "Passwords don't match!";
            formValid = false;
        }

        // If form is valid, proceed with Firebase authentication
        if (formValid) {
            const mobileDocRef = doc(db, "mobileNumbers", mobileNumber);
            const mobileDocSnap = await getDoc(mobileDocRef);
            if (mobileDocSnap.exists()) {
                signUpNumberError.textContent = "Mobile number already exists.";
                return;
            }

            try {
                await createUserWithEmailAndPassword(auth, signUpEmail.value, passInput.value);
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    name: signUpName.value,
                    email: signUpEmail.value,
                    mobileNumber: mobileNumber,
                });
                localStorage.setItem("loggedIn", "true");
                window.location.replace("./assets/pages/html/home.html");
            } catch (error) {
                signUpError.textContent = error.message;
            }
        }
    }
});

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