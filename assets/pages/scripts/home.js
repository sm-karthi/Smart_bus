// Prevent the user from using the back button
window.history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function () {
    window.history.pushState(null, null, window.location.href);
});

// Check if the user is logged in
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "/index.html"; // Redirect to login page if not logged in
}

// Arrow click functionality to swap 'from' and 'to' inputs
const arrow = document.querySelector(".stack");
const from_input = document.getElementById("from");
const to_input = document.getElementById("to");

arrow.addEventListener("click", () => {
    const temp = from_input.value;
    from_input.value = to_input.value;
    to_input.value = temp;
});

// Focus the 'From' and 'To' inputs when their respective icons are clicked
const fromBusIcon = document.getElementById('from_bus');
const toBusIcon = document.getElementById('to_bus');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');

fromBusIcon.addEventListener('click', () => {
    fromInput.focus();  // Focuses the 'From' input field
});

toBusIcon.addEventListener('click', () => {
    toInput.focus();  // Focuses the 'To' input field
});

// Retrieve the username from localStorage
let userName = localStorage.getItem("usersName");

// Profile container toggle logic
const profile = document.getElementById("profile");

profile.addEventListener("click", (e) => {
    e.stopPropagation();  // Prevent the event from propagating to the document click handler

    let profileContainer = document.getElementById("profileContainer");

    if (!profileContainer) {
        // Create and display the profile container
        profileContainer = document.createElement("div");
        profileContainer.setAttribute("id", "profileContainer");
        profileContainer.classList.add("profileManage");

        profileContainer.innerHTML = userName
            ? `<p>Hello, ${userName}!</p>`
            : "<p>No username found. Please login.</p>";

        // Create and append the logout icon
        const logoutIcon = document.createElement("i");
        logoutIcon.classList.add("logoutIcon", "fa", "fa-sign-out");

        const logoutText = document.createElement("span");
        logoutText.setAttribute("id", "logoutText");
        logoutText.textContent = "Logout";

        // Add event listeners to handle logout
        logoutIcon.addEventListener("click", showLogoutConfirmation);
        logoutText.addEventListener("click", showLogoutConfirmation);

        profileContainer.appendChild(logoutIcon);
        profileContainer.appendChild(logoutText);
        document.body.appendChild(profileContainer);
    } else {
        profileContainer.classList.toggle("h");
    }
});

// Close the profile container if clicking anywhere outside of it
document.addEventListener("click", (e) => {
    let profileContainer = document.getElementById("profileContainer");
    if (profileContainer && !profileContainer.contains(e.target) && e.target !== profile) {
        profileContainer.classList.add("h"); // Hide the profile container
    }
});

// Show custom logout confirmation dialog
function showLogoutConfirmation() {
    let confirmationDialog = document.getElementById("confirmationDialog");
    if (confirmationDialog) return;

    // Create the confirmation dialog
    confirmationDialog = document.createElement("div");
    confirmationDialog.setAttribute("id", "confirmationDialog");
    confirmationDialog.classList.add("confirmationDialog");

    confirmationDialog.innerHTML = `
        <p>Are you sure you want to log out?</p>
        <button id="confirmYes" class="confirmButton">Yes</button>
        <button id="confirmNo" class="confirmButton">No</button>
    `;

    // Create the overlay to block interaction
    const overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    document.body.appendChild(confirmationDialog);

    // Prevent interaction with the background
    overlay.style.display = "block"; // Show overlay

    // Add event listeners for Yes/No buttons
    document.getElementById("confirmYes").addEventListener("click", () => {
        localStorage.removeItem("usersName");
        localStorage.removeItem("loggedIn");
        window.location.href = "/index.html";
    });

    document.getElementById("confirmNo").addEventListener("click", () => {
        confirmationDialog.classList.add("hidden");
        overlay.style.display = "none"; // Hide overlay
        setTimeout(() => {
            confirmationDialog.remove();
            overlay.remove();
        }, 500);
    });
}





// Show the bus list
document.getElementById('search_bus_button').addEventListener('click', function () {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value.trim();

    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';
    messageContainer.classList.remove('expand');

    // Check if all fields are filled
    if (!from || !to || !date) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Please fill in all fields to search for buses.";
        messageContainer.appendChild(messageDiv);

        messageContainer.style.visibility = 'visible';
        setTimeout(() => {
            messageContainer.classList.add('expand');
        }, 12);

        setTimeout(() => {
            messageContainer.classList.remove('expand');
        }, 2500);

        setTimeout(() => {
            messageContainer.style.visibility = 'hidden';
        }, 3000);

        return;
    }

    // Store search parameters in localStorage
    localStorage.setItem('searchFrom', from);
    localStorage.setItem('searchTo', to);
    localStorage.setItem('searchDate', date);

    // Redirect to bus_show.html
    window.location.href = "/assets/pages/html/busList.html";
});


// List of place names
const places = [
    // Districts of Tamil Nadu with sample Taluks
    "Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem", "Erode",
    "Vellore", "Tirunelveli", "Thanjavur", "Dindigul", "Theni", "Kanyakumari",
    "Nagercoil", "Ramanathapuram", "Cuddalore", "Karur", "Villupuram", "Nagapattinam",
    "Arakkonam", "Pudukkottai", "Vikrampur", "Sivakasi", "Tiruvannamalai",
    "Kanchipuram", "Tiruvarur", "Chidambaram", "Krishnagiri", "Dharmapuri", "Sankari",
    "Srirangam", "Kovilpatti", "Karaikkudi", "Ariyalur", "Vedasandur",
    "Thiruvallur", "Perambalur", "Azhagiapandipuram", "Rajapalayam", "Kallakurichi",
    "Chengalpattu",
    "Namakkal",
    "Sivagangai",
    "Virudhunagar", "Nilgiris", "Tenkasi", "Thiruvarur", "Thoothukudi"
];



const selectedValuesContainer = document.getElementById('selected_values');

// Create dropdown elements
const fromDropdown = document.createElement("div");
fromDropdown.classList.add("dropdown");
fromInput.parentNode.appendChild(fromDropdown);

const toDropdown = document.createElement("div");
toDropdown.classList.add("dropdown");
toInput.parentNode.appendChild(toDropdown);

// Index to track selected item in the dropdown
let fromSelectedIndex = -1;
let toSelectedIndex = -1;

// Function to filter places based on input value
function filterPlaces(inputValue) {
    if (inputValue.trim() === "") {
        return []; // Return an empty array when input is empty, hiding the dropdown
    } else {
        return places.filter(place =>
            place.toLowerCase().includes(inputValue.toLowerCase())
        );
    }
}

// Function to show dropdown suggestions
function showDropdown(input, dropdown, filteredPlaces, selectedIndex) {
    dropdown.innerHTML = ""; // Clear previous suggestions

    if (filteredPlaces.length === 0) {
        dropdown.style.display = "none"; // Hide dropdown if no places match
        return;
    }

    filteredPlaces.forEach((place, index) => {
        const option = document.createElement("div");
        option.textContent = place;
        option.classList.add("dropdown-item");

        // Highlight the selected option
        if (index === selectedIndex) {
            option.classList.add("selected");
        }

        option.addEventListener("click", () => {
            input.value = place; // Set the selected place in the input
            dropdown.style.display = "none"; // Hide dropdown after selection
        });

        dropdown.appendChild(option);
    });

    dropdown.style.display = "block"; // Show dropdown
}

// Add event listeners for "From" input
fromInput.addEventListener("input", () => {
    const filteredPlaces = filterPlaces(fromInput.value);
    showDropdown(fromInput, fromDropdown, filteredPlaces, fromSelectedIndex);
});

// Add event listeners for "To" input
toInput.addEventListener("input", () => {
    const filteredPlaces = filterPlaces(toInput.value);
    showDropdown(toInput, toDropdown, filteredPlaces, toSelectedIndex);
});

// Keyboard navigation for dropdown (arrow keys and Enter)
document.addEventListener("keydown", (event) => {
    const fromFilteredPlaces = filterPlaces(fromInput.value);
    const toFilteredPlaces = filterPlaces(toInput.value);

    // For "From" input
    if (event.target === fromInput) {
        if (event.key === "ArrowDown") {
            if (fromSelectedIndex < fromFilteredPlaces.length - 1) {
                fromSelectedIndex++;
            }
        } else if (event.key === "ArrowUp") {
            if (fromSelectedIndex > 0) {
                fromSelectedIndex--;
            }
        } else if (event.key === "Enter") {
            if (fromSelectedIndex !== -1) {
                fromInput.value = fromFilteredPlaces[fromSelectedIndex];
                fromDropdown.style.display = "none"; // Hide dropdown after selection
            }
        }
        showDropdown(fromInput, fromDropdown, fromFilteredPlaces, fromSelectedIndex);
    }

    // For "To" input
    if (event.target === toInput) {
        if (event.key === "ArrowDown") {
            if (toSelectedIndex < toFilteredPlaces.length - 1) {
                toSelectedIndex++;
            }
        } else if (event.key === "ArrowUp") {
            if (toSelectedIndex > 0) {
                toSelectedIndex--;
            }
        } else if (event.key === "Enter") {
            if (toSelectedIndex !== -1) {
                toInput.value = toFilteredPlaces[toSelectedIndex];
                toDropdown.style.display = "none"; // Hide dropdown after selection
            }
        }
        showDropdown(toInput, toDropdown, toFilteredPlaces, toSelectedIndex);
    }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!fromInput.contains(event.target) && !fromDropdown.contains(event.target)) {
        fromDropdown.style.display = "none";
    }
    if (!toInput.contains(event.target) && !toDropdown.contains(event.target)) {
        toDropdown.style.display = "none";
    }
});

// Display the selected values when the Enter key is pressed after filling both inputs
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const from = fromInput.value;
        const to = toInput.value;

        // Check if both 'From' and 'To' inputs are filled
        if (from && to) {
            selectedValuesContainer.textContent = `From: ${from}, To: ${to}`;

            // Hide the container (dropdowns) after entering both values
            fromDropdown.style.display = "none";
            toDropdown.style.display = "none";
        }
    }
});

