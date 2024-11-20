
document.addEventListener("DOMContentLoaded", () => {
    const modifyButton = document.getElementById("modifyButton");
    const displayFrom = document.getElementById("displayFrom");
    const displayTo = document.getElementById("displayTo");
    const displayDate = document.getElementById("displayDate");

    let dynamicForm = null; // Track the dynamic form

    // Initialize displayed values
    displayFrom.textContent = localStorage.getItem("searchFrom") || "Enter From";
    displayTo.textContent = localStorage.getItem("searchTo") || "Enter To";
    displayDate.textContent = localStorage.getItem("searchDate") || "Select Date";

    // Handle Modify button click
    modifyButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from propagating to document

        if (dynamicForm) {
            // If the form already exists, hide it and clear the reference
            dynamicForm.remove();
            dynamicForm = null;
            return;
        }

        // Create the dynamic form
        dynamicForm = document.createElement("form");
        dynamicForm.id = "dynamicModifyForm";

        // Add form fields
        dynamicForm.innerHTML = `
            <div id="modifyFromContainer">
                <label for="modifyFrom">From</label>
                <input type="text" id="modifyFrom" name="modifyFrom" 
                    value="${displayFrom.textContent === "Enter From" ? "" : displayFrom.textContent}" />
            </div>
            <div class="stack">
                <div class="arrow" id="upArrow">&#8593;</div> <!-- Up arrow -->
                <div class="arrow1" id="downArrow">&#8595;</div> <!-- Down arrow -->
            </div>

            <div id="modifyToContainer">
                <label for="modifyTo">To</label>
                <input type="text" id="modifyTo" name="modifyTo" 
                    value="${displayTo.textContent === "Enter To" ? "" : displayTo.textContent}" />
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

        // Add event listener for the Search button
        const searchButton = document.getElementById("searchButton");
        searchButton.addEventListener("click", () => {
            const fromValue = modifyFrom.value.trim();
            const toValue = modifyTo.value.trim();
            const dateValue = document.getElementById("modifyDate").value.trim();

            if (!fromValue || !toValue || !dateValue) {
                alert("All fields are required. Please fill them out!");
                return;
            }

            // Save the values to localStorage
            localStorage.setItem("searchFrom", fromValue);
            localStorage.setItem("searchTo", toValue);
            localStorage.setItem("searchDate", dateValue);

            // Update displayed values
            displayFrom.textContent = fromValue;
            displayTo.textContent = toValue;
            displayDate.textContent = dateValue;

            // Remove the dynamic form
            dynamicForm.remove();
            dynamicForm = null; // Clear the form reference

            // Immediately load updated results
            loadBusResults();
        });
    });

    // Hide the form when clicking outside of it
    document.addEventListener("click", (event) => {
        if (dynamicForm && !dynamicForm.contains(event.target) && event.target !== modifyButton) {
            dynamicForm.remove();
            dynamicForm = null; // Clear the form reference
        }
    });

    // Load initial bus results on page load
    if (typeof loadBusResults === "function") {
        loadBusResults();
    } else {
        console.error("loadBusResults function is not defined!");
    }
});





// Function to load bus results
function loadBusResults() {
    const from = localStorage.getItem('searchFrom');
    const to = localStorage.getItem('searchTo');
    const date = localStorage.getItem('searchDate');

    const busList = document.getElementById('bus_list');
    const busCount = document.getElementById("busCount");

    if (!from || !to || !date) {
        busList.innerHTML = "<p>Please enter search criteria for 'from', 'to', and 'date' on the previous page.</p>";
        return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        busList.innerHTML = "<p>No buses available for past dates. Please select today or a future date.</p>";
        return;
    }

    fetch("/assets/pages/scripts/JSON/buses.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load bus data.");
            return response.json();
        })
        .then(buses => {
            const matchingBuses = buses.filter(bus =>
                bus.from.toLowerCase() === from.toLowerCase() &&
                bus.to.toLowerCase() === to.toLowerCase() &&
                bus.date === date
            );

            busList.innerHTML = "";
            let count = 0;

            if (matchingBuses.length > 0) {
                matchingBuses.forEach(bus => {
                    const busItem = document.createElement('div');
                    busItem.classList.add('bus-item');

                    const ratingBadge = `
                        <div class="${bus.ratingBadge.badgeClass}">
                            <span class="${bus.ratingBadge.starIcon.iconClass}">${bus.ratingBadge.starIcon.iconHTML}</span>
                            <span class="${bus.ratingBadge.ratingValue.valueClass}">${bus.ratingBadge.ratingValue.textContent}</span>
                        </div>
                    `;

                    busItem.innerHTML = `
                        <h3 id="busName">${bus.name}</h3>
                        <p id="fromPlace">${bus.from}</p>
                        <p id="toPlace">${bus.to}</p>
                        <p id="busDate">${bus.date}</p>
                        <p id="DepartureTime">${bus.Departure}</p>
                        <p id="ArrivalTime">${bus.Arrival}</p>
                        <p id="Duration">${bus.Duration}</p>
                        <p id="bustype">${bus.bustype}</p>
                        ${ratingBadge}
                        <p id="inrRate">INR ${bus.inrRate}</p>
                        <p id="seatsAvailable">${bus.seatsAvailable}</p>
                        <p id="single">${bus.single}</p>
                    `;

                    const viewSeatsButton = document.createElement('button');
                    viewSeatsButton.textContent = 'VIEW SEATS';
                    viewSeatsButton.classList.add('view-seats-btn');
                    viewSeatsButton.addEventListener("click", () => {
                        localStorage.setItem("selectedBus", JSON.stringify(bus));
                        window.location.href = "../html/seats.html";
                    });

                    busItem.appendChild(viewSeatsButton);
                    busList.appendChild(busItem);
                    count++;
                });

                busCount.textContent = `${count} BUSES found`;
            } else {
                busList.innerHTML = `<p class="No_buses">No buses available for this route on the selected date.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            busList.innerHTML = "<p>Could not load bus data. Please try again later.</p>";
        });
}

// Function to render seats from localStorage
function renderSeats() {
    const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));
    if (!selectedBus) {
        alert("No bus selected. Please go back and choose a bus.");
        return;
    }

    document.getElementById('bus-name').textContent = selectedBus.name;
    document.getElementById('from').textContent = selectedBus.from;
    document.getElementById('to').textContent = selectedBus.to;
    document.getElementById('date').textContent = selectedBus.date;

    const lowerDeck = document.getElementById('lower-deck');
    selectedBus.lowerDeck.forEach(seat => {
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat', seat.isAvailable ? 'available' : 'unavailable');
        seatDiv.textContent = seat.seatNumber;
        lowerDeck.appendChild(seatDiv);
    });

    const upperDeck = document.getElementById('upper-deck');
    selectedBus.upperDeck.forEach(seat => {
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat', seat.isAvailable ? 'available' : 'unavailable');
        seatDiv.textContent = seat.seatNumber;
        upperDeck.appendChild(seatDiv);
    });
}

// Load bus results on the appropriate page
if (document.getElementById("bus_list")) loadBusResults();
if (document.getElementById("seats-container")) renderSeats();