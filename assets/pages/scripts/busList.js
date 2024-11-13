window.addEventListener('DOMContentLoaded', function () {
    const from = localStorage.getItem('searchFrom');
    const to = localStorage.getItem('searchTo');
    const date = localStorage.getItem('searchDate');

    document.title = `${from} To ${to}`;

    const busList = document.getElementById('bus_list');

    if (!from || !to || !date) {
        busList.innerHTML = "<p>Please enter search criteria for 'from', 'to', and 'date' on the previous page.</p>";
        return;
    }

    // Parse selected date and today's date
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate comparison

    // Only proceed if the selected date is today or in the future
    if (selectedDate < today) {
        busList.innerHTML = "<p>No buses available for past dates. Please select today or a future date.</p>";
        return;
    }

    fetch("/assets/pages/scripts/JSON/buses.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load bus data.");
            }
            return response.json();
        })
        .then(buses => {
            const matchingBuses = buses.filter(bus =>
                bus.from.toLowerCase() === from.toLowerCase() &&
                bus.to.toLowerCase() === to.toLowerCase() &&
                bus.date === date
            );

            if (matchingBuses.length > 0) {
                matchingBuses.forEach(bus => {
                    const busItem = document.createElement('div');
                    busItem.classList.add('bus-item');
                    busItem.innerHTML = `
                        <h3 id = "busName">${bus.name}</h3>
                        <p id = "fromPlace">From: ${bus.from}</p>
                        <p id = "toPlace">To: ${bus.to}</p>
                        <p id = "busDate">Date: ${bus.date}</p>
                        <p id = "DepartureTime">Departure: ${bus.Departure}</p>
                        <p id = "ArrivalTime">Arrival: ${bus.Arrival}</p>
                        <p id = "Duration">Duration: ${bus.Duration}</p>
                        <p id = "bustype">bustype: ${bus.bustype}</p>
                    `;
                    busList.appendChild(busItem);
                });
            } else {
                busList.innerHTML = `<p class = "No_buses">No buses available for this route on the selected date.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            busList.innerHTML = "<p>Could not load bus data. Please try again later.</p>";
        });
});












// Retrieve the username from localStorage
let userName = localStorage.getItem("username");

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
        logoutText.style= " cursor: pointer"

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
