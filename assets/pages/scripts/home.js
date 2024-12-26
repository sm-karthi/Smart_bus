// Get today's date dynamically
const today = new Date();

// Format the date in YYYY-MM-DD
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
const day = String(today.getDate()).padStart(2, '0'); // Add leading zero to the day if needed

const currentDate = `${year}-${month}-${day}`;

// Set the min attribute to today's date
document.getElementById("date").setAttribute("min", currentDate);


// click the My booking button go to booking page
document.getElementById("myBooking").addEventListener("click", () => {
    window.location = "../html/booking.html"
})

// Listen for the page load to set initial values from localStorage
document.addEventListener('DOMContentLoaded', function () {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const dateInput = document.getElementById('date');

    // Retrieve saved values and set them in the form fields
    if (localStorage.getItem('fromValue')) {
        fromInput.value = localStorage.getItem('fromValue');
    }
    if (localStorage.getItem('toValue')) {
        toInput.value = localStorage.getItem('toValue');
    }
    if (localStorage.getItem('dateValue')) {
        dateInput.value = localStorage.getItem('dateValue');
    }
});

// Click the bus logo reload the page
document.getElementById("Bus_logo").addEventListener("click", () => {
    window.location.reload();
});

// Save input values to localStorage as the user types
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const dateInput = document.getElementById('date');


// Prevent the user from using the back button
window.history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function () {
    window.history.pushState(null, null, window.location.href);
});


// Arrow click functionality to swap 'from' and 'to' inputs
const arrow = document.querySelector(".stack");
const from_input = document.getElementById("from");
const to_input = document.getElementById("to");
// const dateInput = document.getElementById("date");

arrow.addEventListener("click", () => {
    const temp = from_input.value;
    from_input.value = to_input.value;
    to_input.value = temp;

    // Save updated values in localStorage
    localStorage.setItem("searchFrom", fromInput.value);
    localStorage.setItem("searchTo", toInput.value);
});

// Focus the 'From' and 'To' inputs when their respective icons are clicked
const fromBusIcon = document.getElementById('from_bus');
const toBusIcon = document.getElementById('to_bus');

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
            ? `<p>Wellcome, ${userName}!</p>`
            : `<p id = "profile_letters">No username found. Please login.</p>`;


       // Create and append the bus register button
    //    const busRegister = document.createElement("button");
    //    busRegister.id = "busRegister";
    //    busRegister.textContent = "Register Bus";
    //    busRegister.addEventListener("click", () => {
    //        window.location.href = "../html/admin.html";
    //    });

    //    profileContainer.appendChild(busRegister);

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

        // Add the 'show' class to display the profile container
        setTimeout(() => {
            profileContainer.classList.add("show");
        }, 10); // Ensure the animation starts after appending
    } else {
        // Toggle visibility with animation
        profileContainer.classList.toggle("show");
    }
});

// Close the profile container if clicking anywhere outside of it
document.addEventListener("click", (e) => {
    let profileContainer = document.getElementById("profileContainer");
    if (profileContainer && !profileContainer.contains(e.target) && e.target !== profile) {
        profileContainer.classList.remove("show"); // Hide the profile container with animation
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
        // localStorage.removeItem("usersName");
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



// Save values to localStorage on input
fromInput.addEventListener("input", () => localStorage.setItem("searchFrom", fromInput.value));
toInput.addEventListener("input", () => localStorage.setItem("searchTo", toInput.value));
dateInput.addEventListener("input", () => localStorage.setItem("searchDate", dateInput.value));


// Show the bus list
document.getElementById('search_bus_button').addEventListener('click', function () {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value.trim();

    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';
    messageContainer.classList.remove('expand');


    if (from === to) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Please enter valid locations.";
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

    // Check for invalid entries (numbers or special characters in 'from' or 'to')
    const invalidPattern = /[^a-zA-Z\s]/; // Regex to detect special characters or numbers
    if (invalidPattern.test(from) || invalidPattern.test(to)) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Please enter valid locations.";
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

    // Check for invalid entries (numbers in 'from' or 'to')
    const numberPattern = /\d/; // Regex to detect digits
    if (numberPattern.test(from) || numberPattern.test(to)) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Please enter valid locations.";
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

    /* // Store search parameters in localStorage
    localStorage.setItem('searchFrom', from);
    localStorage.setItem('searchTo', to);
    localStorage.setItem('searchDate', date); */

    // Redirect to bus_list.html
    window.location.href = "/assets/pages/html/busList.html";
});


// Dropdown elements
const fromDropdown = document.createElement("div");
const toDropdown = document.createElement("div");


// Message and selected values container
const messageContainer = document.getElementById("message-container");

// Add dropdown elements to DOM
fromDropdown.classList.add("dropdown");
toDropdown.classList.add("dropdown");
fromInput.parentNode.appendChild(fromDropdown);
toInput.parentNode.appendChild(toDropdown);

// List of places
const places = [
    "Villathikulam", "Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem", "Erode",
    "Vellore", "Tirunelveli", "Thanjavur", "Dindigul", "Theni", "Kanyakumari",
    "Nagercoil", "Ramanathapuram", "Cuddalore", "Karur", "Villupuram", "Nagapattinam",
    "Arakkonam", "Pudukkottai", "Vikrampur", "Sivakasi", "Tiruvannamalai",
    "Kanchipuram", "Tiruvarur", "Chidambaram", "Krishnagiri", "Dharmapuri", "Sankari",
    "Srirangam", "Kovilpatti", "Karaikkudi", "Ariyalur", "Vedasandur",
    "Thiruvallur", "Perambalur", "Azhagiapandipuram", "Rajapalayam", "Kallakurichi",
    "Chengalpattu", "Namakkal", "Sivagangai", "Virudhunagar", "Nilgiris", "Tenkasi",
    "Thiruvarur", "Thoothukudi", "Nagalapuram", "Ariyalur", "Mayiladuthurai",
    "Ranipet", "Tirupattur", "Tiruppur",
];

// State for selected index
let fromSelectedIndex = -1;
let toSelectedIndex = -1;

// Utility function to filter places based on input
function filterPlaces(inputValue) {
    return inputValue ? places.filter(place => place.toLowerCase().includes(inputValue.toLowerCase())) : [];
}

// Function to display dropdown options
function showDropdown(input, dropdown, filteredPlaces, selectedIndex = -1) {
    dropdown.innerHTML = ""; // Clear dropdown content
    filteredPlaces.forEach((place, index) => {
        const option = document.createElement("div");
        option.textContent = place;
        option.classList.add("dropdown-item");
        if (index === selectedIndex) {
            option.classList.add("active");
        }
        // Select place on click
        option.addEventListener("click", () => {
            input.value = place;
            dropdown.style.display = "none";
            localStorage.setItem(input.id === "from" ? "searchFrom" : "searchTo", place);
        });
        dropdown.appendChild(option);
    });
    dropdown.style.display = filteredPlaces.length > 0 ? "block" : "none"; // Show or hide dropdown
}

// Handle keyboard navigation
function handleKeyNavigation(event, input, dropdown, selectedIndex, setIndexCallback) {
    const filteredPlaces = filterPlaces(input.value);

    if (filteredPlaces.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    if (event.key === "ArrowDown") {
        selectedIndex = Math.min(selectedIndex + 1, filteredPlaces.length - 1);
    } else if (event.key === "ArrowUp") {
        selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (event.key === "Enter") {
        if (selectedIndex >= 0) {
            input.value = filteredPlaces[selectedIndex];
            localStorage.setItem(input.id === "from" ? "searchFrom" : "searchTo", input.value);
            dropdown.style.display = "none";
        }

    }
    setIndexCallback(selectedIndex);
    showDropdown(input, dropdown, filteredPlaces, selectedIndex);
}

// Input event listeners for filtering
fromInput.addEventListener("input", () => {
    const filteredPlaces = filterPlaces(fromInput.value);
    fromSelectedIndex = -1;
    showDropdown(fromInput, fromDropdown, filteredPlaces);
});

toInput.addEventListener("input", () => {
    const filteredPlaces = filterPlaces(toInput.value);
    toSelectedIndex = -1;
    showDropdown(toInput, toDropdown, filteredPlaces);
});

// Keyboard navigation listeners
fromInput.addEventListener("keydown", (event) => {
    handleKeyNavigation(event, fromInput, fromDropdown, fromSelectedIndex, (index) => {
        fromSelectedIndex = index;
    });
});

toInput.addEventListener("keydown", (event) => {
    handleKeyNavigation(event, toInput, toDropdown, toSelectedIndex, (index) => {
        toSelectedIndex = index;
    });
});

// Hide dropdowns when clicking outside
document.addEventListener("click", (event) => {
    if (!fromInput.contains(event.target) && !fromDropdown.contains(event.target)) {
        fromDropdown.style.display = "none";
    }
    if (!toInput.contains(event.target) && !toDropdown.contains(event.target)) {
        toDropdown.style.display = "none";
    }
});

// Restore saved values on page load
document.addEventListener("DOMContentLoaded", () => {
    const storedFrom = localStorage.getItem("searchFrom");
    const storedTo = localStorage.getItem("searchTo");
    const storedDate = localStorage.getItem("searchDate");

    if (storedFrom) fromInput.value = storedFrom;
    if (storedTo) toInput.value = storedTo;
    if (storedDate) dateInput.value = storedDate;
});

// Save the date input to localStorage
dateInput.addEventListener("input", () => {
    localStorage.setItem("searchDate", dateInput.value);
});

// On page load, restore saved values
document.addEventListener("DOMContentLoaded", () => {
    const storedFrom = localStorage.getItem("searchFrom");
    const storedTo = localStorage.getItem("searchTo");
    const storedDate = localStorage.getItem("searchDate");

    if (storedFrom) fromInput.value = storedFrom;
    if (storedTo) toInput.value = storedTo;
    if (storedDate) dateInput.value = storedDate;
});