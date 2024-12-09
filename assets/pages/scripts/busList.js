// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get, child} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
    authDomain: "smartbus-7443b.firebaseapp.com",
    projectId: "smartbus-7443b",
    storageBucket: "smartbus-7443b.appspot.com",
    messagingSenderId: "35022257891",
    appId: "1:35022257891:web:8eed74fb4131a414730fd6"
};

let filterOn = false;
let filteredBusesList;

// Redirect to home page on custom back arrow click
document.getElementById("leftArrow").addEventListener("click", () => {
    window.location = "../html/home.html";
});


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

    // Predefined locations for suggestions
    const locations = [
        "Villathikulam", "Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem", "Erode",
        "Vellore", "Tirunelveli", "Thanjavur", "Dindigul", "Theni", "Kanyakumari",
        "Nagercoil", "Ramanathapuram", "Cuddalore", "Karur", "Villupuram", "Nagapattinam",
        "Arakkonam", "Pudukkottai", "Vikrampur", "Sivakasi", "Tiruvannamalai",
        "Kanchipuram", "Tiruvarur", "Chidambaram", "Krishnagiri", "Dharmapuri", "Sankari",
        "Srirangam", "Kovilpatti", "Karaikkudi", "Ariyalur", "Vedasandur",
        "Thiruvallur", "Perambalur", "Azhagiapandipuram", "Rajapalayam", "Kallakurichi",
        "Chengalpattu", "Namakkal", "Sivagangai", "Virudhunagar", "Nilgiris", "Tenkasi",
        "Thiruvarur", "Thoothukudi", "Nagalapuram"
    ];

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(str) {
        if (!str) return str; // Check for empty or null string
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

     // Function to format date from yyyy-mm-dd to dd-mm-yyyy
     function formatDate(dateStr) {
        const dateObj = new Date(dateStr);
        const day = ("0" + dateObj.getDate()).slice(-2);  // Add leading zero to day
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);  // Add leading zero to month
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Initialize displayed values with capitalization
    const savedFrom = localStorage.getItem("searchFrom") || "Enter From";
    const savedTo = localStorage.getItem("searchTo") || "Enter To";
    const savedDate = localStorage.getItem("searchDate") || "2024-12-08";
    displayFrom.textContent = capitalizeFirstLetter(savedFrom);
    displayTo.textContent = capitalizeFirstLetter(savedTo);
    displayDate.textContent = formatDate(savedDate);

    // Handle Modify button click
    modifyButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from propagating

        if (dynamicForm) {
            return; // Prevent creating multiple forms
        }

        // Create the dynamic form
        dynamicForm = document.createElement("form");
        dynamicForm.id = "dynamicModifyForm";

        dynamicForm.innerHTML = `
            <div class="close-btn" id="closeFormBtn">X</div> <!-- Close button -->
            <div id="modifyFromContainer">
                <label for="modifyFrom">From</label>
                <input type="text" id="modifyFrom" name="modifyFrom" 
                    value="${displayFrom.textContent === "Enter From" ? "" : displayFrom.textContent}" autocomplete="off"/>
                <div class="dropdown" id="fromDropdown"></div>
            </div>
            <div class="stack">
                <div class="arrow" id="upArrow">&#8593;</div> <!-- Up arrow -->
                <div class="arrow1" id="downArrow">&#8595;</div> <!-- Down arrow -->
            </div>

            <div id="modifyToContainer">
                <label for="modifyTo">To</label>
                <input type="text" id="modifyTo" name="modifyTo" 
                    value="${displayTo.textContent === "Enter To" ? "" : displayTo.textContent}" autocomplete="off"/>
                <div class="dropdown" id="toDropdown"></div>
            </div>
            <div id="modifyDateContainer">
                <label for="modifyDate">Date</label>
                <input type="date" id="modifyDate" name="modifyDate" 
                    value="${savedDate}"/>
            </div>
            <button id="searchButton" type="button">Search</button>
        `;

        // Append the form after the modify button
        modifyButton.parentNode.insertBefore(dynamicForm, modifyButton.nextSibling);

        // Add animation to show the form smoothly
        setTimeout(() => {
            dynamicForm.classList.add("show");
        }, 10);

        const arrowStack = document.querySelector(".stack");
        arrowStack.addEventListener("click", (e) => {
            // Swap the values between the "From" and "To" fields
            const temp = modifyFrom.value;
            modifyFrom.value = modifyTo.value;
            modifyTo.value = temp;
        });

        // Add functionality for dropdown suggestions
        function addDropdownFunctionality(inputId, dropdownId) {
            const inputField = document.getElementById(inputId);
            const dropdown = document.getElementById(dropdownId);
            let highlightedIndex = -1; // To keep track of highlighted suggestion

            inputField.addEventListener("input", () => {
                const inputValue = inputField.value.toLowerCase();
                dropdown.innerHTML = ""; // Clear previous suggestions

                if (inputValue) {
                    const matchingLocations = locations.filter(location =>
                        location.toLowerCase().includes(inputValue)
                    );

                    matchingLocations.forEach((location, index) => {
                        const suggestion = document.createElement("div");
                        suggestion.classList.add("dropdown-item");
                        suggestion.textContent = location;

                        suggestion.addEventListener("click", () => {
                            inputField.value = location; // Set input value to the clicked suggestion
                            dropdown.innerHTML = ""; // Clear dropdown
                        });

                        // Set the index for highlighting purposes
                        suggestion.setAttribute('data-index', index);
                        dropdown.appendChild(suggestion);
                    });

                    dropdown.style.display = matchingLocations.length > 0 ? "block" : "none";
                } else {
                    dropdown.style.display = "none"; // Hide dropdown if input is empty
                }
            });



            // Keydown listener for navigating the dropdown using keys
            inputField.addEventListener("keydown", (event) => {
                const dropdownItems = dropdown.querySelectorAll(".dropdown-item");
                if (event.key === "ArrowDown") {
                    // Highlight next item
                    if (highlightedIndex < dropdownItems.length - 1) {
                        highlightedIndex++;
                    } else {
                        highlightedIndex = 0; // Loop to the top
                    }
                    updateHighlightedItem(dropdownItems);
                } else if (event.key === "ArrowUp") {
                    // Highlight previous item
                    if (highlightedIndex > 0) {
                        highlightedIndex--;
                    } else {
                        highlightedIndex = dropdownItems.length - 1; // Loop to the bottom
                    }
                    updateHighlightedItem(dropdownItems);
                } else if (event.key === "Enter" && highlightedIndex > -1) {
                    inputField.value = dropdownItems[highlightedIndex].textContent; // Set input value to highlighted item
                    dropdown.innerHTML = ""; // Clear dropdown
                    highlightedIndex = -1; // Reset highlighted index
                }
            });

            // Helper function to update the highlighted item in the dropdown
            function updateHighlightedItem(dropdownItems) {
                dropdownItems.forEach(item => item.classList.remove("highlighted"));
                if (highlightedIndex > -1) {
                    dropdownItems[highlightedIndex].classList.add("highlighted");
                }
            }

            // Hide dropdown when clicking outside
            document.addEventListener("click", (event) => {
                if (!dropdown.contains(event.target) && event.target !== inputField) {
                    dropdown.style.display = "none";
                }
            });
        }

        addDropdownFunctionality("modifyFrom", "fromDropdown");
        addDropdownFunctionality("modifyTo", "toDropdown");

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
            const fromValue = document.getElementById("modifyFrom").value.trim();
            const toValue = document.getElementById("modifyTo").value.trim();
            const dateValue = document.getElementById("modifyDate").value.trim();


            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = '';
            messageContainer.classList.remove('expand');

            if (fromValue === toValue) {
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

                return;
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
            dynamicForm.classList.remove("show");
            setTimeout(() => {
                dynamicForm.remove();
                dynamicForm = null;
            }, 500);

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
        hideLoader(); // Hide loader after 1.8 seconds
        if (typeof callback === "function") {
            callback(); // Execute the callback (e.g., display bus results)
        }
    }, 1800);
}

const side_bar = document.getElementById('side_bar');
side_bar.style.display = "none";





// Sort by letters
const sortByContainer = document.getElementById("sortBy_bus_result");

const busCount = document.createElement("div");
busCount.setAttribute("id", "busCount");

let count;
// Function to fetch and display data from Firebase
async function loadBusResults() {
    simulateLoading(async () => {
        const from = localStorage.getItem("searchFrom");
        const to = localStorage.getItem("searchTo");
        const date = localStorage.getItem("searchDate");
        const bus_container = document.getElementById("bus_container");
        const busList = document.getElementById("bus_list");

        document.title = `${from} to ${to}`;

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



            side_bar.style.display = "block";

            busList.innerHTML = ""; // Clear existing list

            count = 0;

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


                    // Prepare feature icons based on boolean values
                    const waterBottleIcon = bus.WaterBottle
                        ? `<div class="feature waterBottle" data-tooltip="Water Bottle Available">
                           <i class="fas fa-bottle-water"></i><i class="fas fa-bottle-water"></i>
                           </div>`
                        : "";
                    const blanketsIcon = bus.Blankets
                        ? `<div class="feature blankets" data-tooltip="Blankets Available">
                           <i class="fas fa-layer-group"></i>
                           </div>`
                        : "";
                    const chargingPointIcon = bus.ChargingPoint
                        ? `<div class="feature chargingPoint" data-tooltip="Charging Points Available">
                           <i class="fas fa-plug"></i>
                           </div>`
                        : "";

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
                        <p id="busDate">${bus.ArrivalDate}</p>
                        <p id="DepartureTime">${bus.Departure || "Not available"}</p>
                        <p id="ArrivalTime">${bus.Arrival || "Not available"}</p>
                        <p id="Duration">${bus.Duration}</p>
                        <p id="bustype">${bus.bustype}</p>
                        ${ratingBadge}
                        <p id="inrRate">INR ${bus.inrRate}</p>
                        <p id="seatsAvailable">${bus.seatsAvailable}</p>
                        <p id="single">${bus.single}</p>
                        <div class="features-row">
                         ${waterBottleIcon}
                         ${blanketsIcon}
                         ${chargingPointIcon}
                        </div>
                       
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


        // Prepare feature icons based on boolean values
        const waterBottleIcon = bus.WaterBottle
            ? `<div class="feature waterBottle" data-tooltip="Water Bottle Available">
           <i class="fas fa-bottle-water"></i><i class="fas fa-bottle-water"></i>
           </div>`
            : "";
        const blanketsIcon = bus.Blankets
            ? `<div class="feature blankets" data-tooltip="Blankets Available">
           <i class="fas fa-layer-group"></i>
           </div>`
            : "";
        const chargingPointIcon = bus.ChargingPoint
            ? `<div class="feature chargingPoint" data-tooltip="Charging Points Available">
           <i class="fas fa-plug"></i>
           </div>`
            : "";


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
                        <p id="busDate">${bus.ArrivalDate}</p>
                        <p id="DepartureTime">${bus.Departure || "Not available"}</p>
                        <p id="ArrivalTime">${bus.Arrival || "Not available"}</p>
                        <p id="Duration">${bus.Duration}</p>
                        <p id="bustype">${bus.bustype}</p>
                        ${ratingBadge}
                        <p id="inrRate">INR ${bus.inrRate}</p>
                        <p id="seatsAvailable">${bus.seatsAvailable}</p>
                        <p id="single">${bus.single}</p>
                        <div class="features-row">
                         ${waterBottleIcon}
                         ${blanketsIcon}
                         ${chargingPointIcon}
                        </div>
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
    let busesToRender = filterOn ? filteredBusesList : displayedBuses;


    if (busesToRender.length === 0) {
        console.log("No buses available to sort.");
        return;
    }
    console.log(busesToRender);
    // Sort buses based on the selected property
    if (property === "rating") {
        // Handle rating as a number


        busesToRender.sort((a, b) => {
            const ratingA = parseFloat(a.ratingBadge.ratingValue.textContent) || 0; // Ensure valid ratings
            const ratingB = parseFloat(b.ratingBadge.ratingValue.textContent) || 0;
            return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
        });
    }


    else if (property == "inrRate") {
        busesToRender.sort((a, b) => {
            const ratingA = parseFloat(a.inrRate) || 0; // Ensure valid ratings
            const ratingB = parseFloat(b.inrRate) || 0;
            return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
        });
    }
    else {
        // General sorting logic for other properties
        busesToRender.sort((a, b) => {
            if (a[property] < b[property]) return sortOrder === "asc" ? -1 : 1;
            if (a[property] > b[property]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }

    // Toggle sort order
    sortOrder = sortOrder === "asc" ? "desc" : "asc";

    // Render the sorted buses
    renderBusList(busesToRender);
}













// Function to set the active button's color
function setActiveButton(activeButtonId) {
    // Get all filter buttons
    const filterButtons = document.querySelectorAll("#ac_bus, #nonac_bus, #sleeper_bus, #seater_bus, #single_seat, #water_bottle, #blankets, #charging_point");

    // Reset the background color for all buttons
    filterButtons.forEach((button) => {
        button.style.backgroundColor = ""; // Default color
        button.style.color = ""; // Reset text color
    });

    // Set the active button's color
    const activeButton = document.getElementById(activeButtonId);
    activeButton.style.backgroundColor = "#c3c3c3"; // Active background color
    activeButton.style.boxShadow = "0px 4px 8px 0 rgba(0, 0, 0, 0.3)"; // Active text color
}

let acBuses = false;
let nonAcBuses = false;
let sleeperBuses = false;
let seaterBuses = false;
let singleSeatsBuses = false;
let waterBottle = false;
let blankets = false;
let chargingPoint = false;


const filteredACbuses = document.getElementById("ac_bus");
const filteredNonAcBuses = document.getElementById("nonac_bus");
const filteredSleeperBuses = document.getElementById("sleeper_bus");
const filteredSeaterBuses = document.getElementById("seater_bus");
const filteredSingleSeatBuses = document.getElementById("single_seat");
const filteredWaterBottle = document.getElementById("water_bottle");
const filteredBlankets = document.getElementById("blankets");
const filteredChargingPoint = document.getElementById("charging_point");

// Event listeners for filtering by bus type
filteredACbuses.addEventListener("click", () => {
    if (acBuses) {
        filterOn = false;
        acBuses = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredACbuses.style.backgroundColor = "#f3f3f3";
        filteredACbuses.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";
    }
    else {
        filterOn = true;
        acBuses = true;
        window.scrollTo(0, 0);
        filterBusesByType("A/C /");
        setActiveButton("ac_bus");
        nonAcBuses = false;
        sleeperBuses = false;
        seaterBuses = false;
        singleSeatsBuses = false;
        waterBottle = false;
        chargingPoint = false;
        blankets = false;
    }
});
filteredNonAcBuses.addEventListener("click", () => {

    if (nonAcBuses) {
        filterOn = false;
        nonAcBuses = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredNonAcBuses.style.backgroundColor = "#f3f3f3";
        filteredNonAcBuses.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";
    }
    else {
        filterOn = true;
        nonAcBuses = true;
        window.scrollTo(0, 0);
        filterBusesByType("NON");
        setActiveButton("nonac_bus");
        acBuses = false;
        sleeperBuses = false;
        seaterBuses = false;
        singleSeatsBuses = false;
        waterBottle = false;
        chargingPoint = false;
        blankets = false;

    }
});
filteredSleeperBuses.addEventListener("click", () => {
    if (sleeperBuses) {
        filterOn = false;
        sleeperBuses = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredSleeperBuses.style.backgroundColor = "#f3f3f3";
        filteredSleeperBuses.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";
    }
    else {
        filterOn = true;
        sleeperBuses = true;
        window.scrollTo(0, 0);
        filterBusesByType("Sleeper");
        setActiveButton("sleeper_bus");
        acBuses = false;
        nonAcBuses = false;
        seaterBuses = false;
        singleSeatsBuses = false;
        waterBottle = false;
        chargingPoint = false;
        blankets = false;
    }
});
filteredSeaterBuses.addEventListener("click", () => {
    if (seaterBuses) {
        filterOn = false;
        seaterBuses = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredSeaterBuses.style.backgroundColor = "#f3f3f3";
        filteredSeaterBuses.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)"
    }
    else {
        filterOn = true;
        seaterBuses = true;
        window.scrollTo(0, 0);
        filterBusesByType("Seater");
        setActiveButton("seater_bus");
        acBuses = false;
        nonAcBuses = false;
        sleeperBuses = false;
        singleSeatsBuses = false;
        waterBottle = false;
        chargingPoint = false;
        blankets = false;
    }
});


filteredSingleSeatBuses.addEventListener("click", () => {
    if (singleSeatsBuses) {
        filterOn = false;
        singleSeatsBuses = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredSingleSeatBuses.style.backgroundColor = "#f3f3f3";
        filteredSingleSeatBuses.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";
    }
    else {
        filterOn = true;
        singleSeatsBuses = true;
        window.scrollTo(0, 0); // Scroll to the top of the page
        filterSingleSeats();   // Filter buses with single seats
        setActiveButton("single_seat");
        acBuses = false;
        nonAcBuses = false;
        sleeperBuses = false;
        seaterBuses = false;
        waterBottle = false;
        chargingPoint = false;
        blankets = false;
    }
});



// Event listeners for filtering buses by features
filteredWaterBottle.addEventListener("click", () => {
    if (waterBottle) {
        filterOn = false;
        waterBottle = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredWaterBottle.style.backgroundColor = "#f3f3f3";
        filteredWaterBottle.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";

    }
    else {
        filterOn = true;
        waterBottle = true;
        window.scrollTo(0, 0);
        filterBusesWithWaterBottle()
        setActiveButton("water_bottle");
        acBuses = false;
        nonAcBuses = false;
        sleeperBuses = false;
        seaterBuses = false;
        singleSeatsBuses = false;
        chargingPoint = false;
        blankets = false;
    }
});
filteredBlankets.addEventListener("click", () => {
    if (blankets) {
        filterOn = false;
        blankets = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredBlankets.style.backgroundColor = "#f3f3f3";
        filteredBlankets.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";
    }
    else {
        filterOn = true;
        blankets = true;
        window.scrollTo(0, 0);
        filterBusesWithBlankets()
        setActiveButton("blankets");
        acBuses = false;
        nonAcBuses = false;
        sleeperBuses = false;
        seaterBuses = false;
        singleSeatsBuses = false;
        waterBottle = false;
        chargingPoint = false;
    }
});
filteredChargingPoint.addEventListener("click", () => {
    if (chargingPoint) {
        filterOn = false;
        chargingPoint = false;
        loadBusResults();
        window.scrollTo(0, 0);
        filteredChargingPoint.style.backgroundColor = "#f3f3f3";
        filteredChargingPoint.style.boxShadow = "0px 2px 5px 0 rgba(0, 0, 0, 0.2)";
    }
    else {
        filterOn = true;
        chargingPoint = true;
        window.scrollTo(0, 0);
        filterBusesWithChargingPoints()
        setActiveButton("charging_point");
        acBuses = false;
        nonAcBuses = false;
        sleeperBuses = false;
        seaterBuses = false;
        singleSeatsBuses = false;
        waterBottle = false;
        blankets = false;
    }
});

// Function to filter buses that provide water bottles
function filterBusesWithWaterBottle() {
    const busList = document.getElementById("bus_list");
    busList.innerHTML = ""; // Clear the bus list

    // Get the selected state of the water bottle filter
    const hasWaterBottle = document.getElementById("water_bottle");

    // Filter buses based on the water bottle feature being true
    const filteredBuses = displayedBuses.filter(bus => {
        // If the filter is checked, only include buses with Water Bottle: true
        if (hasWaterBottle) {
            return bus["WaterBottle"] === true;
        }
        // If the filter is not checked, return all buses
        return true;
    });

    renderFilteredBuses(filteredBuses, "Water Bottle");
}

// Function to filter buses that provide blankets
function filterBusesWithBlankets() {
    const busList = document.getElementById("bus_list");
    busList.innerHTML = ""; // Clear the bus list

    // Get the selected state of the blankets filter
    const hasBlankets = document.getElementById("blankets");

    // Filter buses based on the blankets feature being true
    const filteredBuses = displayedBuses.filter(bus => {
        // If the filter is checked, only include buses with Blankets: true
        if (hasBlankets) {
            return bus["Blankets"] === true;
        }
        // If the filter is not checked, return all buses
        return true;
    });

    renderFilteredBuses(filteredBuses, "Blankets");
}

// Function to filter buses that provide charging points
function filterBusesWithChargingPoints() {
    const busList = document.getElementById("bus_list");
    busList.innerHTML = ""; // Clear the bus list

    // Get the selected state of the charging points filter
    const hasChargingPoint = document.getElementById("charging_point");

    // Filter buses based on the charging point feature being true
    const filteredBuses = displayedBuses.filter(bus => {
        // If the filter is checked, only include buses with Charging Point: true
        if (hasChargingPoint) {
            return bus["ChargingPoint"] === true;
        }
        // If the filter is not checked, return all buses
        return true;
    });

    renderFilteredBuses(filteredBuses, "Charging Points");
}




// Function to filter buses by type
function filterBusesByType(busType) {
    const busList = document.getElementById("bus_list");
    busList.innerHTML = ""; // Clear the bus list

    // Filter logic
    const filteredBuses = displayedBuses.filter(bus => {
        const normalizedBustype = bus.bustype.trim().toLowerCase();
        const normalizedFilter = busType.trim().toLowerCase();

        return normalizedBustype.includes(normalizedFilter);
    });

    renderFilteredBuses(filteredBuses, busType);
}

// Function to filter buses with single seats
function filterSingleSeats() {
    const busList = document.getElementById("bus_list");
    busList.innerHTML = ""; // Clear the bus list

    const filteredBuses = displayedBuses.filter(bus => {
        return bus.single && bus.single.toLowerCase().includes("single");
    });

    renderFilteredBuses(filteredBuses, "Single Seat");
}

// Helper function to render filtered buses
function renderFilteredBuses(filteredBuses, filterType) {

    filteredBusesList = filteredBuses
    const busList = document.getElementById("bus_list");

    count = 0;
    if (filteredBuses.length > 0) {
        sortByContainer.style.display = "block"; // Show sorting options

        filteredBuses.forEach(bus => {
            const busItem = document.createElement("div");
            busItem.classList.add("bus-item");

            // Check if rating exists, else default to 0
            const ratingValue = bus.ratingBadge.ratingValue.textContent;
            let ratingClass = "green"; // Default green

            if (ratingValue < 4.0 && ratingValue >= 2.5) {
                ratingClass = "yellow"; // Yellow for average ratings
            } else if (ratingValue < 2.5) {
                ratingClass = "red"; // Red for poor ratings
            }


            // Prepare feature icons based on boolean values
            const waterBottleIcon = bus.WaterBottle
            ? `<div class="feature waterBottle" data-tooltip="Water Bottle Available">
               <i class="fas fa-bottle-water"></i><i class="fas fa-bottle-water"></i>
               </div>`
            : "";
        const blanketsIcon = bus.Blankets
            ? `<div class="feature blankets" data-tooltip="Blankets Available">
               <i class="fas fa-layer-group"></i>
               </div>`
            : "";
        const chargingPointIcon = bus.ChargingPoint
            ? `<div class="feature chargingPoint" data-tooltip="Charging Points Available">
               <i class="fas fa-plug"></i>
               </div>`
            : "";


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
                <p id="busDate">${bus.ArrivalDate}</p>
                <p id="DepartureTime">${bus.Departure || "Not available"}</p>
                <p id="ArrivalTime">${bus.Arrival || "Not available"}</p>
                <p id="Duration">${bus.Duration}</p>
                <p id="bustype">${bus.bustype}</p>
                ${ratingBadge}
                <p id="inrRate">INR ${bus.inrRate}</p>
                <p id="seatsAvailable">${bus.seatsAvailable}</p>
                <p id="single">${bus.single}</p>
                <div class="features-row">
                         ${waterBottleIcon}
                         ${blanketsIcon}
                         ${chargingPointIcon}
                        </div>
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
    } else {
        busList.innerHTML = `<h5 class="No_buses" id = "filterBus">No ${filterType.toUpperCase()} buses available for this route on the selected date.</h5>`;
        sortByContainer.style.display = "none";
        busCount.textContent = `${count} Buses found`;
        bus_container.appendChild(busCount);
    }
}
