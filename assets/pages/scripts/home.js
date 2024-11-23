
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
    // Prevent the event from propagating to the document click handler
    e.stopPropagation();

    // Check if the profileContainer already exists
    let profileContainer = document.getElementById("profileContainer");

    if (!profileContainer) {
        // Create a new div to serve as the container if it doesn't exist
        profileContainer = document.createElement("div");
        profileContainer.setAttribute("id", "profileContainer");
        profileContainer.classList.add("profileManage");

        // Display the username in the container
        profileContainer.innerHTML = userName
            ? `<p>Hello, ${userName}!</p>`
            : "<p>No username found. Please login.</p>";

        // Create a logout icon element
        const logoutIcon = document.createElement("i");
        logoutIcon.classList.add("logoutIcon", "fa", "fa-sign-out"); // Font Awesome icon for logout

        const logoutText = document.createElement("span");
        logoutText.setAttribute("id", "logoutText");
        logoutText.textContent = "Logout";

        // Add event listener to handle logout on icon click
        logoutIcon.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("loggedIn");
            window.location.href = "/index.html"; // Redirect to login page

            window.history.pushState(null, null, window.location.href);
            window.addEventListener('popstate', function () {
                window.history.pushState(null, null, window.location.href);
            });



        });

        logoutText.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("loggedIn");
            window.location.href = "/index.html"; // Redirect to login page

            window.history.pushState(null, null, window.location.href);
            window.addEventListener('popstate', function () {
                window.history.pushState(null, null, window.location.href);
            });



        });

        // Append the icon and text to the logout container
        profileContainer.appendChild(logoutIcon);
        profileContainer.appendChild(logoutText);

        // Append the container to the body (or another desired element)
        document.body.appendChild(profileContainer);
    } else {
        // Toggle visibility by adding/removing the "h" class
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


/* // Show the bus list
document.getElementById('search_bus_button').addEventListener('click', function () {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;

    // Check if all fields are filled
    if (!from || !to || !date) {
        alert("Please fill in all fields to search for buses.");
        return;
    }

    // Store search parameters in localStorage
    localStorage.setItem('searchFrom', from);
    localStorage.setItem('searchTo', to);
    localStorage.setItem('searchDate', date);

    // Redirect to bus_show.html
    window.location.href = "/assets/pages/html/busList.html";
}); */


 // Show the bus list
 document.getElementById('search_bus_button').addEventListener('click', function () {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value.trim();

    // Get the message container
    const messageContainer = document.getElementById('message-container');

    // Clear any existing messages and reset styles
    messageContainer.innerHTML = '';
    messageContainer.classList.remove('expand');

    // Check if all fields are filled
    if (!from || !to || !date) {
        // Create a div for the message
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Please fill in all fields to search for buses.";
        messageContainer.appendChild(messageDiv); // Append message to the container

        // Show the container with fade-in effect
        messageContainer.style.display = 'block'; // Make it visible
        setTimeout(() => {
            messageContainer.classList.add('expand');
        }, 12); // Small delay to allow DOM rendering

        // Hide the container after 2 seconds
        setTimeout(() => {
            messageContainer.classList.remove('expand'); // Trigger fade-out and collapse
        }, 2500);

        // Remove the container from display after fade-out
        setTimeout(() => {
            messageContainer.style.display = 'none'; // Fully hide
        }, 3000); // Wait for fade-out transition to complete

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
    "Arakkonam", "Kanchipuram", "Pudukkottai", "Vikrampur", "Sivakasi", "Tiruvannamalai", 
    "Kanchipuram", "Tiruvarur", "Chidambaram", "Krishnagiri", "Dharmapuri", "Sankari", 
    "Srirangam", "Kovilpatti", "Karaikkudi", "Ariyalur", "Kanchipuram", "Vedasandur", 
    "Thiruvallur", "Perambalur", "Azhagiapandipuram", "Rajapalayam", "Kallakurichi", 
    "Ariyalur", "Chengalpattu", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Karur", 
    "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Perambalur", "Pudukkottai", 
    "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Tiruvannamalai", "Tirunelveli", 
    "Vellore", "Virudhunagar", "Nilgiris", "Tenkasi", "Thiruvarur", "Thoothukudi"
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



