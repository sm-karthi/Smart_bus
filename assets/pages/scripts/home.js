
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


// Show the bus list
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
});

