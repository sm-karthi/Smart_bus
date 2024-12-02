// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
    authDomain: "smartbus-7443b.firebaseapp.com",
    projectId: "smartbus-7443b",
    storageBucket: "smartbus-7443b.appspot.com",
    messagingSenderId: "35022257891",
    appId: "1:35022257891:web:8eed74fb4131a414730fd6"
};

// Initialize Firebase and Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let displayedBuses = [];

document.addEventListener("DOMContentLoaded", () => {
    const modifyButton = document.getElementById("modifyButton");
    const displayFrom = document.getElementById("displayFrom");
    const displayTo = document.getElementById("displayTo");
    const displayDate = document.getElementById("displayDate");

    let dynamicForm = null; // Track the dynamic form

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(str) {
        if (!str) return str; // Check for empty or null string
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Initialize displayed values with capitalization
    displayFrom.textContent = capitalizeFirstLetter(localStorage.getItem("searchFrom") || "Enter From");
    displayTo.textContent = capitalizeFirstLetter(localStorage.getItem("searchTo") || "Enter To");
    displayDate.textContent = capitalizeFirstLetter(localStorage.getItem("searchDate") || "Select Date");

    // Handle Modify button click
    modifyButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from propagating to document

        if (dynamicForm) {

            return;
        }

        // Create the dynamic form
        dynamicForm = document.createElement("form");
        dynamicForm.id = "dynamicModifyForm";

        // Add form fields
        dynamicForm.innerHTML = `
            <div class="close-btn" id="closeFormBtn">X</div> <!-- Close button -->
            <div id="modifyFromContainer">
                <label for="modifyFrom">From</label>
                <input type="text" id="modifyFrom" name="modifyFrom" 
                    value="${displayFrom.textContent === "Enter From" ? "" : displayFrom.textContent}" autocomplete="off"/>
            </div>
            <div class="stack">
                <div class="arrow" id="upArrow">&#8593;</div> <!-- Up arrow -->
                <div class="arrow1" id="downArrow">&#8595;</div> <!-- Down arrow -->
            </div>

            <div id="modifyToContainer">
                <label for="modifyTo">To</label>
                <input type="text" id="modifyTo" name="modifyTo" 
                    value="${displayTo.textContent === "Enter To" ? "" : displayTo.textContent}" autocomplete="off"/>
            </div>
            <div id="modifyDateContainer">
                <label for="modifyDate">Date</label>
                <input type="date" id="modifyDate" name="modifyDate" 
                    value="${displayDate.textContent === "Select Date" ? "" : displayDate.textContent}" />
            </div>
            <button id="searchButton" type="button">Search</button>
        `;

        // Append the form after the modify button
        modifyButton.parentNode.insertBefore(dynamicForm, modifyButton.nextSibling);

        // Add animation class to show the form smoothly
        setTimeout(() => {
            dynamicForm.classList.add("show");
        }, 10); // Delay to ensure the form is added to the DOM before applying the class

        // Add functionality to swap values using arrows
        const modifyFrom = document.getElementById("modifyFrom");
        const modifyTo = document.getElementById("modifyTo");

        const arrowStack = document.querySelector(".stack");
        arrowStack.addEventListener("click", (e) => {
            // Swap the values between the "From" and "To" fields
            const temp = modifyFrom.value;
            modifyFrom.value = modifyTo.value;
            modifyTo.value = temp;
        });

        const closeButton = document.getElementById("closeFormBtn");
        closeButton.addEventListener("click", () => {
            dynamicForm.classList.remove("show"); // Hide the form smoothly
            setTimeout(() => {
                dynamicForm.remove();
                dynamicForm = null;
            }, 500); // Match the duration of the transition
        });

        // Add event listener for the Search button
        const searchButton = document.getElementById("searchButton");
        searchButton.addEventListener("click", () => {
            const fromValue = modifyFrom.value.trim();
            const toValue = modifyTo.value.trim();
            const dateValue = document.getElementById("modifyDate").value.trim();

            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = '';
            messageContainer.classList.remove('expand');

            // Validation for special characters or numbers in "From" and "To" fields
            const invalidPattern = /[^a-zA-Z\s]/; // Regex to detect invalid characters
            if (invalidPattern.test(fromValue) || invalidPattern.test(toValue)) {
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

                return; // Stop further processing
            }

            if (!fromValue || !toValue || !dateValue) {
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

            // Capitalize first letter of input values
            const capitalizedFromValue = capitalizeFirstLetter(fromValue);
            const capitalizedToValue = capitalizeFirstLetter(toValue);
            const capitalizedDateValue = capitalizeFirstLetter(dateValue);

            // Save the values to localStorage
            localStorage.setItem("searchFrom", capitalizedFromValue);
            localStorage.setItem("searchTo", capitalizedToValue);
            localStorage.setItem("searchDate", capitalizedDateValue);

            // Update displayed values with capitalized first letters
            displayFrom.textContent = capitalizedFromValue;
            displayTo.textContent = capitalizedToValue;
            displayDate.textContent = capitalizedDateValue;

            // Remove the dynamic form
            dynamicForm.classList.remove("show"); // Hide the form smoothly
            setTimeout(() => {
                dynamicForm.remove();
                dynamicForm = null; // Clear the form reference
            }, 500); // Match the duration of the transition

            // Immediately load updated results
            loadBusResults();

            window.location.reload();
        });

    });

    // Load initial bus results on page load
    if (typeof loadBusResults === "function") {
        loadBusResults();
    } else {
        console.error("loadBusResults function is not defined!");
    }
});






// Select the loader element
const loader = document.getElementById("loader");

// Function to show the loader
function showLoader() {
    loader.style.display = "block";
}

// Function to hide the loader
function hideLoader() {
    loader.style.display = "none";
}

// Function to simulate loading for 3 seconds
function simulateLoading(callback) {
    showLoader(); // Show loader
    setTimeout(() => {
        hideLoader(); // Hide loader after 3 seconds
        if (typeof callback === "function") {
            callback(); // Execute the callback (e.g., display bus results)
        }
    }, 2000); // 3000ms = 3 seconds
}

const side_bar = document.getElementById('side_bar');
side_bar.style.display = "none";


/**
 * Function to update Firebase with new JSON data
  @param {Array} buses //- The JSON array of buses to save in Firebase
 */
async function updateJSONToFirebase(buses) {
    try {
        const updates = {}; // Object to hold all updates
        buses.forEach((bus, index) => {
            updates[`buses/${index}`] = bus; // Use unique keys for buses
        });

        // Push all updates at once to Firebase
        await update(ref(database), updates);
        console.log("Firebase updated with new JSON details!");
    } catch (error) {
        console.error("Error updating Firebase:", error);
    }
}

// Function to upload data from local JSON to Firebase
async function uploadJSONToFirebase() {
    try {
        const response = await fetch("/assets/pages/scripts/JSON/buses.json");
        if (!response.ok) throw new Error("Failed to load local JSON file.");
        const buses = await response.json();

        // Upload buses to Firebase
        const dbRef = ref(database, "buses/");
        buses.forEach((bus, index) => {
            set(ref(database, `buses/${index}`), bus);
        });

        console.log("Data uploaded to Firebase successfully!");
    } catch (error) {
        console.error("Error uploading JSON to Firebase:", error);
    }
}

// Sort by letters
const sortByContainer = document.getElementById("sortBy_bus_result");

// Function to fetch and display data from Firebase
async function loadBusResults() {
    simulateLoading(async () => {
        const from = localStorage.getItem("searchFrom");
        const to = localStorage.getItem("searchTo");
        const date = localStorage.getItem("searchDate");
        const bus_container = document.getElementById("bus_container");
        const busList = document.getElementById("bus_list");

        document.title = `${from} To ${to}`;

        if (!from || !to || !date) {
            busList.innerHTML =
                "<h4>Please enter search criteria for 'from', 'to', and 'date' on the previous page.</h4>";
            side_bar.style.display = "none";
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            busList.innerHTML =
                "<h4>No buses available for past dates. Please select today or a future date.</h4>";
            side_bar.style.display = "none";
            return;
        }

        // Fetch data from Firebase
        const dbRef = ref(database);
        try {
            const snapshot = await get(child(dbRef, "buses/"));
            if (!snapshot.exists()) throw new Error("No data found in Firebase.");
            const buses = snapshot.val();

            displayedBuses = Object.values(buses).filter(
                (bus) =>
                    bus.from.toLowerCase() === from.toLowerCase() &&
                    bus.to.toLowerCase() === to.toLowerCase() &&
                    bus.date === date
            );

            const busCount = document.createElement("div");
            busCount.setAttribute("id", "busCount");

            side_bar.style.display = "block";

            busList.innerHTML = ""; // Clear existing list

            let count = 0;

            if (displayedBuses.length > 0) {
                displayedBuses.forEach((bus) => {
                    const busItem = document.createElement("div");
                    busItem.classList.add("bus-item");

                    const ratingValue = bus.ratingBadge.ratingValue.textContent;
                    let ratingClass = "green"; // Default green

                    if (ratingValue < 4.0 && ratingValue >= 2.5) {
                        ratingClass = "yellow"; // Yellow for average ratings
                    } else if (ratingValue < 2.5) {
                        ratingClass = "red"; // Red for poor ratings
                    }

                    const ratingBadge = bus.ratingBadge
                        ? `
    <div class="rating-badge ${ratingClass}">
        <span class="${bus.ratingBadge.starIcon.iconClass}">${bus.ratingBadge.starIcon.iconHTML}</span>
        <span class="${bus.ratingBadge.ratingValue.valueClass}">${bus.ratingBadge.ratingValue.textContent}</span>
    </div>`
                        : "";


                    busItem.innerHTML = `
                        <h3 id="busName">${bus.name}</h3>
                        <p id="fromPlace">${bus.from}</p>
                        <p id="toPlace">${bus.to}</p>
                        <p id="busDate">${bus.date}</p>
                        <p id="DepartureTime">${bus.Departure || "Not available"}</p>
                        <p id="ArrivalTime">${bus.Arrival || "Not available"}</p>
                        <p id="Duration">${bus.Duration}</p>
                        <p id="bustype">${bus.bustype}</p>
                        ${ratingBadge}
                        <p id="inrRate">INR ${bus.inrRate}</p>
                        <p id="seatsAvailable">${bus.seatsAvailable}</p>
                        <p id="single">${bus.single}</p>
                    `;

                    const viewSeatsButton = document.createElement("button");
                    viewSeatsButton.textContent = "VIEW SEATS";
                    viewSeatsButton.classList.add("view-seats-btn");
                    viewSeatsButton.addEventListener("click", () => {
                        localStorage.setItem("selectedBus", JSON.stringify(bus));
                        window.location.href = "../html/seats.html";
                    });

                    busItem.appendChild(viewSeatsButton);
                    busList.appendChild(busItem);
                    count++;
                });


                busCount.textContent = `${count} Buses found`;
                bus_container.appendChild(busCount);
                sortByContainer.style.display = "block";
            } else {
                busList.innerHTML = `<h5 class="No_buses">No buses available for this route on the selected date.</h5>`;
                side_bar.style.display = "none";
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            busList.innerHTML =
                "<h5>Could not load bus data. Please try again later.</h5>";
            side_bar.style.display = "none";
        }
    });
}

// Upload local JSON data to Firebase when the page loads
uploadJSONToFirebase();

// Call loadBusResults on page load
document.addEventListener("DOMContentLoaded", loadBusResults);










let sortOrder = "asc"; // Default sort order (ascending)
 // Store the fetched buses

// Attach event listeners to the sorting options
const sortingHeaders = {
    departure: "Departure",
    duration: "Duration",
    arrival: "Arrival",
    ratings: "rating",
    fare: "inrRate",
    seats_available: "seatsAvailable",
};

Object.keys(sortingHeaders).forEach((id) => {
    document.getElementById(id).addEventListener("click", () => {
        highlightSortingHeader(id);
        sortAndReloadBusList(sortingHeaders[id]);
    });
});

// Function to highlight the clicked column header and toggle arrow
function highlightSortingHeader(activeId) {
    // Reset all headers
    Object.keys(sortingHeaders).forEach((id) => {
        const header = document.getElementById(id);
        header.style.color = ""; // Reset color
        header.innerHTML = header.textContent.replace(/ ↑| ↓/, ""); // Remove arrow
    });

    // Highlight active header
    const activeHeader = document.getElementById(activeId);
    activeHeader.style.color = "rgb(248, 74, 91)"; // Change to your preferred highlight color
    activeHeader.textContent += sortOrder === "asc" ? " ↓" : " ↑"; // Add arrow
}

// Function to fetch bus data (only once when the page loads)
async function fetchBuses() {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "buses/"));
    if (!snapshot.exists()) throw new Error("No data found in Firebase.");
    return Object.values(snapshot.val()); // Return buses array
}

// Function to render the bus list
function renderBusList(buses) {
    const busList = document.getElementById("bus_list");
    busList.innerHTML = ""; // Clear the list

    buses.forEach((bus) => {
       const busItem = document.createElement("div");
                    busItem.classList.add("bus-item");

                    const ratingValue = bus.ratingBadge.ratingValue.textContent;
                    let ratingClass = "green"; // Default green

                    if (ratingValue < 4.0 && ratingValue >= 2.5) {
                        ratingClass = "yellow"; // Yellow for average ratings
                    } else if (ratingValue < 2.5) {
                        ratingClass = "red"; // Red for poor ratings
                    }

        const ratingBadge = bus.ratingBadge
                        ? `
    <div class="rating-badge ${ratingClass}">
        <span class="${bus.ratingBadge.starIcon.iconClass}">${bus.ratingBadge.starIcon.iconHTML}</span>
        <span class="${bus.ratingBadge.ratingValue.valueClass}">${bus.ratingBadge.ratingValue.textContent}</span>
    </div>`
                        : "";

                        busItem.innerHTML = `
                        <h3 id="busName">${bus.name}</h3>
                        <p id="fromPlace">${bus.from}</p>
                        <p id="toPlace">${bus.to}</p>
                        <p id="busDate">${bus.date}</p>
                        <p id="DepartureTime">${bus.Departure || "Not available"}</p>
                        <p id="ArrivalTime">${bus.Arrival || "Not available"}</p>
                        <p id="Duration">${bus.Duration}</p>
                        <p id="bustype">${bus.bustype}</p>
                        ${ratingBadge}
                        <p id="inrRate">INR ${bus.inrRate}</p>
                        <p id="seatsAvailable">${bus.seatsAvailable}</p>
                        <p id="single">${bus.single}</p>
                    `;

        const viewSeatsButton = document.createElement("button");
        viewSeatsButton.textContent = "VIEW SEATS";
        viewSeatsButton.classList.add("view-seats-btn");
        viewSeatsButton.addEventListener("click", () => {
            localStorage.setItem("selectedBus", JSON.stringify(bus));
            window.location.href = "../html/seats.html";
        });

        busItem.appendChild(viewSeatsButton);
        busList.appendChild(busItem);
    });
}

// Function to sort the bus list based on the selected property and reload the sorted list
function sortAndReloadBusList(property) {
    if (displayedBuses.length === 0) {
        console.log("No buses available to sort.");
        return;
    }
    console.log(displayedBuses);
    // Sort buses based on the selected property
    if (property === "rating"){
        // Handle rating as a number
        
        
        displayedBuses.sort((a, b) => {
            const ratingA = parseFloat(a.ratingBadge.ratingValue.textContent) || 0; // Ensure valid ratings
            const ratingB = parseFloat(b.ratingBadge.ratingValue.textContent) || 0;
            return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
        });
    } 
    
    
    else if(property=="inrRate"){
        displayedBuses.sort((a, b) => {
            const ratingA = parseFloat(a.inrRate) || 0; // Ensure valid ratings
            const ratingB = parseFloat(b.inrRate) || 0;
            return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
        });
    }
    else {
        // General sorting logic for other properties
        displayedBuses.sort((a, b) => {
            if (a[property] < b[property]) return sortOrder === "asc" ? -1 : 1;
            if (a[property] > b[property]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }

    // Toggle sort order
    sortOrder = sortOrder === "asc" ? "desc" : "asc";

    // Render the sorted buses
    renderBusList(displayedBuses);
}



// Side bar code



