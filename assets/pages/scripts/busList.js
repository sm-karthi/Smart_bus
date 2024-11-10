

// Display bus data on page load
window.addEventListener('DOMContentLoaded', function () {
    const from = localStorage.getItem('searchFrom');
    const to = localStorage.getItem('searchTo');
    const date = localStorage.getItem('searchDate');

    const buses = [
        { name: "Lakshmi Travels", from: "Chennai", to: "Madurai", date: "2024-11-12", time: "10:00 AM" },
        { name: "MRM Travels", from: "Chennai", to: "Madurai", date: "2024-11-12", time: "12:00 PM" },
        { name: "Amernath Travels", from: "Chennai", to: "Madurai", date: "2024-11-12", time: "2:00 PM" },
    ];

    const filteredBuses = buses.filter(bus => bus.from === from && bus.to === to && bus.date === date);
    const busList = document.getElementById('bus_list');

    if (filteredBuses.length > 0) {
        filteredBuses.forEach(bus => {
            const busItem = document.createElement('div');
            busItem.classList.add('bus-item');
            busItem.innerHTML = `
                <h3>${bus.name}</h3>
                <p>From: ${bus.from}</p>
                <p>To: ${bus.to}</p>
                <p>Date: ${bus.date}</p>
                <p>Time: ${bus.time}</p>
            `;
            busList.appendChild(busItem);
        });
    } else {
        busList.innerHTML = "<p>No buses available for this route on the selected date.</p>";
    }
});

// Retrieve and display the username
let userName = localStorage.getItem("username");
const profile = document.getElementById("profile");

profile.addEventListener("click", (e) => {
    e.stopPropagation();
    let profileContainer = document.getElementById("profileContainer");

    if (!profileContainer) {
        profileContainer = document.createElement("div");
        profileContainer.setAttribute("id", "profileContainer");
        profileContainer.classList.add("profileManage");
        profileContainer.innerHTML = userName
            ? `<p>Hello, ${userName}!</p>`
            : "<p>No username found. Please login.</p>";

        const logoutIcon = document.createElement("i");
        logoutIcon.classList.add("logoutIcon", "fa", "fa-sign-out");
        logoutIcon.style.cursor = "pointer";

        const logoutText = document.createElement("span");
        logoutText.setAttribute("id", "logoutText");
        logoutText.textContent = "Logout";
        logoutText.style.marginLeft = "8px";
        logoutText.style.cursor = "pointer";

        const handleLogout = () => {
            localStorage.removeItem("username");
            localStorage.removeItem("loggedIn");
            window.location.href = "/index.html";
            window.history.pushState(null, null, window.location.href);
            window.addEventListener("popstate", function () {
                window.history.pushState(null, null, window.location.href);
            });
        };

        logoutIcon.addEventListener("click", handleLogout);
        logoutText.addEventListener("click", handleLogout);

        profileContainer.appendChild(logoutIcon);
        profileContainer.appendChild(logoutText);
        document.body.appendChild(profileContainer);
    } else {
        profileContainer.classList.toggle("h");
    }
});

// Hide profile container when clicking outside of it
document.addEventListener("click", (e) => {
    const profileContainer = document.getElementById("profileContainer");
    if (profileContainer && !profileContainer.contains(e.target) && e.target !== profile) {
        profileContainer.classList.add("h");
    }
});
