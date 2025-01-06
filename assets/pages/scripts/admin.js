// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, set, get, remove, update } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
    authDomain: "smartbus-7443b.firebaseapp.com",
    projectId: "smartbus-7443b",
    storageBucket: "smartbus-7443b.appspot.com",
    messagingSenderId: "35022257891",
    appId: "1:35022257891:web:8eed74fb4131a414730fd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Handle arrow icon
document.getElementById("leftArrow").addEventListener("click", () => {
    window.location.href = "../html/home.html";
})


// Bus List Container
const busListContainer = document.createElement("div");
busListContainer.id = "busListContainer";
document.body.appendChild(busListContainer);

// Variable to track the selected bus div
let selectedBusDiv = null;
let selectedBusId = null;  // To store the selected busId for update

// Load saved buses from local storage
const loadBusesFromLocalStorage = () => {
    const buses = JSON.parse(localStorage.getItem("busList")) || [];
    buses.forEach((bus, index) => createBusDiv(bus, index + 1));
};

// Create a new bus div
const createBusDiv = (bus, busNumber) => {
    const busDiv = document.createElement("div");
    busDiv.className = "bus-item";

    // Create a box for the row number
    const rowNumberBox = document.createElement("div");
    rowNumberBox.className = "row-number-box";
    rowNumberBox.textContent = busNumber;

    // Create a text container for the bus details
    const busTextContainer = document.createElement("div");
    busTextContainer.className = "bus-text";
    busTextContainer.textContent = bus.name;

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    // Add click event for delete button
    deleteButton.addEventListener("click", async (event) => {
        event.stopPropagation(); // Prevent triggering the bus div click event

        // Create overlay
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        // Create the confirmation modal
        const confirmationDiv = document.createElement("div");
        confirmationDiv.classList.add("confirmation-modal");
        confirmationDiv.id = "confirmationDialog";

        // Add message
        const message = document.createElement("p");
        message.textContent = "Are you sure you want to delete this bus?";
        confirmationDiv.appendChild(message);

        // Create "Yes" button
        const yesButton = document.createElement("button");
        yesButton.textContent = "Yes";
        yesButton.classList.add("yes-button");

        // Create "No" button
        const noButton = document.createElement("button");
        noButton.textContent = "No";
        noButton.classList.add("no-button");

        // Append buttons to confirmation modal
        confirmationDiv.appendChild(yesButton);
        confirmationDiv.appendChild(noButton);

        // Append overlay and confirmation modal to body
        document.body.appendChild(overlay);
        document.body.appendChild(confirmationDiv);

        // "Yes" button click event
        yesButton.addEventListener("click", async () => {
            try {
                // Remove from Firebase
                const busRef = ref(database, `buses/${bus.busId}`);
                await remove(busRef);

                // Remove from local storage
                const savedBuses = JSON.parse(localStorage.getItem("busList")) || [];
                const updatedBuses = savedBuses.filter(savedBus => savedBus.busId !== bus.busId);
                localStorage.setItem("busList", JSON.stringify(updatedBuses));

                // Hide the bus div
                busDiv.remove();

                // Re-align the row numbers (optional if rows are numbered dynamically)
                updateRowNumbers();

                // Remove the confirmation modal and overlay
                overlay.remove();
                confirmationDiv.remove();
            } catch (error) {
                console.error("Error deleting bus: ", error.message);
            }
        });

        // "No" button click event
        noButton.addEventListener("click", () => {
            // Add 'hidden' class to trigger fade-out animation
            confirmationDiv.classList.add("hidden");

            // Wait for the animation to complete, then remove elements
            setTimeout(() => {
                overlay.remove();
                confirmationDiv.remove();
            }, 400); // Match the duration of the fadeOut animation in CSS
        });
    });



    // Append row number box, bus text, and delete button to the bus div
    busDiv.appendChild(rowNumberBox);
    busDiv.appendChild(busTextContainer);
    busDiv.appendChild(deleteButton);

    // Click event to toggle form values and background color
    busDiv.addEventListener("click", () => {
        // If the bus div is already selected, unselect it
        if (selectedBusDiv === busDiv) {
            busDiv.style.backgroundColor = "#f9f9f9";
            clearFormValues();
            selectedBusDiv = null;
            selectedBusId = null;
        } else {
            // Deselect the previously selected bus div (if any)
            if (selectedBusDiv) {
                selectedBusDiv.style.backgroundColor = "#f9f9f9";
            }
            // Select the new bus div
            busDiv.style.backgroundColor = "#aeaeae";
            populateFormValues(bus);
            selectedBusDiv = busDiv;
            selectedBusId = bus.busId; // Store busId for update
        }
    });

    // Hover effect: Revert color when mouse leaves
    busDiv.addEventListener("mouseover", () => {
        if (selectedBusDiv !== busDiv) {
            busDiv.style.backgroundColor = "#e0e0e0"; // Change color on hover if not selected
        }
    });

    busDiv.addEventListener("mouseout", () => {
        if (selectedBusDiv !== busDiv) {
            busDiv.style.backgroundColor = "#f9f9f9"; // Revert color on hover out if not selected
        }
    });

    busListContainer.appendChild(busDiv);
};

// Update row numbers after deletion
const updateRowNumbers = () => {
    const busDivs = document.querySelectorAll(".bus-item");
    busDivs.forEach((busDiv, index) => {
        const rowNumberBox = busDiv.querySelector(".row-number-box");
        rowNumberBox.textContent = index + 1; // Update row number
    });
};

// Error spaces
const busNameError = document.getElementById("busNameError");
const busTypeError = document.getElementById("busTypeError");
const fromLocationError = document.getElementById("fromLocationError");
const toLocationError = document.getElementById("toLocationError");
const departureTimeError = document.getElementById("departureTimeError");
const departureDateError = document.getElementById("departureDateError");
const arrivalTimeError = document.getElementById("arrivalTimeError");
const arrivalDateError = document.getElementById("arrivalDateError");
const durationError = document.getElementById("durationError");
const fareError = document.getElementById("fareError");
const seatsError = document.getElementById("seatsError");
const waterBottleError = document.getElementById("waterBottleError");
const blanketsError = document.getElementById("blanketsError");
const chargingPointError = document.getElementById("chargingPointError");
// const ratingError = document.getElementById("ratingError");
const boardingPointError = document.getElementById("boardingPointError");
const droppingPointError = document.getElementById("droppingPointError");

// Populate form with bus details
const populateFormValues = (bus) => {
    document.getElementById("busName").value = bus.name || "";
    document.getElementById("busType").value = bus.bustype || "";
    ShowTotalSeats(bus.bustype, bus.seats);
    document.getElementById("fromLocation").value = bus.from || "";
    document.getElementById("toLocation").value = bus.to || "";
    document.getElementById("departureTime").value = bus.Departure || "";
    document.getElementById("date").value = bus.date || "";
    document.getElementById("arrivalTime").value = bus.Arrival || "";
    document.getElementById("arrivalDate").value = bus.arrivalDate || "";
    document.getElementById("duration").value = bus.Duration || "";
    document.getElementById("fare").value = bus.inrRate || "";
    document.getElementById("seats").value = bus.seats;
    document.getElementById("WaterBottle").value = bus.WaterBottle || "";
    document.getElementById("blankets").value = bus.Blankets || "";
    document.getElementById("chargingPoint").value = bus.ChargingPoint || "";
    // document.getElementById("rating").value = bus.ratingBadge?.ratingValue?.textContent || "";
    document.getElementById("boardingPoint").value = bus.boardingPoint || "";
    document.getElementById("droppingPoint").value = bus.droppingPoint || "";
};

// Clear form values
const clearFormValues = () => {
    document.getElementById("busName").value = "";
    document.getElementById("busType").value = "";
    document.getElementById("fromLocation").value = "";
    document.getElementById("toLocation").value = "";
    document.getElementById("departureTime").value = "";
    document.getElementById("date").value = "";
    document.getElementById("arrivalTime").value = "";
    document.getElementById("arrivalDate").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("fare").value = "";
    document.getElementById("seats").value = "";
    document.getElementById("WaterBottle").value = "";
    document.getElementById("blankets").value = "";
    document.getElementById("chargingPoint").value = "";
    // document.getElementById("rating").value = "";
    document.getElementById("boardingPoint").value = "";
    document.getElementById("droppingPoint").value = "";
}

// Function to capitalize the first letter of each word, keeping the rest as is
const capitalizeWords = (str) => {
    return str
        .trim()
        .split(/\s+/) // Split by one or more spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter, leave the rest as is
        .join(" ");
};

function capitalizeLocations(input) {
    return input
        .split(", ") // Split by ", " to handle each location separately
        .map(location => location.charAt(0).toUpperCase() + location.slice(1)) // Capitalize the first letter of each location
        .join(", "); // Join them back with ", "
}


// Dynamic seat options based on bus type

// Elements
const busTypeElement = document.getElementById("busType");
const seatsElement = document.getElementById("seats");

busTypeElement.addEventListener("change", () => {
    seatsElement.innerHTML = ""; // Clear existing options

    let seatOptions = [];
    if (busTypeElement.value === "A/C / Sleeper (2 + 1)" || busTypeElement.value === "Non A/C Sleeper (2 + 1)") {
        seatOptions = [30, 36];
    } else if (busTypeElement.value === "A/C / Seater / Sleeper (2 + 1)" || busTypeElement.value === "Non A/C Seater / Sleeper (2 + 1)") {
        seatOptions = [40, 46, 48, 55];
    }


    seatOptions.forEach(seatCount => {
        const option = document.createElement("option");
        option.value = seatCount;
        option.textContent = `${seatCount} Seats`;
        seatsElement.appendChild(option);
    });
});


function ShowTotalSeats(busType, totalSeats) {
    // Elements
    const seatsElement = document.getElementById("seats");

    seatsElement.innerHTML = ""; // Clear existing options

    let seatOptions = [];
    if (busTypeElement.value === "A/C / Sleeper (2 + 1)" || busTypeElement.value === "Non A/C Sleeper (2 + 1)") {
        seatOptions = [30, 36];
    } else if (busTypeElement.value === "A/C / Seater / Sleeper (2 + 1)" || busTypeElement.value === "Non A/C Seater / Sleeper (2 + 1)") {
        seatOptions = [40, 46, 48, 55];
    }

    seatOptions.forEach(seatCount => {
        const option = document.createElement("option");
        option.value = seatCount;
        option.textContent = `${seatCount} Seats`;
        seatsElement.appendChild(option);

        if (totalSeats === seatCount) {
            option.selected = true;
        }
    });



}



const messageContainer = document.getElementById('message-container');
messageContainer.innerHTML = '';
messageContainer.classList.remove('expand');

// Save Bus Data
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    busNameError.textContent = "";
    busTypeError.textContent = "";
    fromLocationError.textContent = "";
    toLocationError.textContent = "";
    departureTimeError.textContent = "";
    departureDateError.textContent = "";
    arrivalTimeError.textContent = "";
    arrivalDateError.textContent = "";
    durationError.textContent = "";
    fareError.textContent = "";
    seatsError.textContent = "";
    waterBottleError.textContent = "";
    blanketsError.textContent = "";
    chargingPointError.textContent = "";
    boardingPointError.textContent = "";
    droppingPointError.textContent = "";

    // Form inputs
    const getBusName = document.getElementById("busName").value.trim();
    const busName = capitalizeWords(getBusName);

    const busType = document.getElementById("busType").value.trim();
    const getFromLocation = document.getElementById("fromLocation").value.trim();
    const fromLocation = capitalizeWords(getFromLocation);

    const getToLocation = document.getElementById("toLocation").value.trim();
    const toLocation = capitalizeWords(getToLocation)

    const Departure = document.getElementById("departureTime").value.trim();
    const date = document.getElementById("date").value.trim();
    const Arrival = document.getElementById("arrivalTime").value.trim();
    const arrivalDate = document.getElementById("arrivalDate").value.trim();
    const Duration = document.getElementById("duration").value.trim();
    const inrRate = document.getElementById("fare").value.trim();
    const seats = document.getElementById("seats").value.trim();
    const WaterBottle = document.getElementById("WaterBottle").value.trim();
    const Blankets = document.getElementById("blankets").value.trim();
    const ChargingPoint = document.getElementById("chargingPoint").value.trim();
    // const rating = document.getElementById("rating").value.trim();

    const getBoardingPoint = document.getElementById("boardingPoint").value.trim();
    const boardingPoint = capitalizeLocations(getBoardingPoint);

    const getDroppingPoint = document.getElementById("droppingPoint").value.trim();
    const droppingPoint = capitalizeLocations(getDroppingPoint);

    let formValid = true;

    // Regular expression for "location (time)" format
    const validPattern = /^[a-zA-Z\s]+ \(\d{2}:\d{2}\)(, [a-zA-Z\s]+ \(\d{2}:\d{2}\))*$/;


    // Validation logic
    if (busName === "") {
        busNameError.textContent = "Bus name is required.";
        formValid = false;
    } else if (/\d/.test(busName)) {
        busNameError.textContent = "Enter valid bus name.";
        formValid = false;
    }


    if (busType === "") {
        busTypeError.textContent = "Bus type is required.";
        formValid = false;
    }

    if (fromLocation === "") {
        fromLocationError.textContent = "From location is required.";
        formValid = false;
    } else if (/\d/.test(fromLocation)) {
        fromLocationError.textContent = "Enter valid from location.";
        formValid = false;
    }

    if (boardingPoint === "") {
        boardingPointError.textContent = "Boarding point is required."
        formValid = false;
    }
    else if (!validPattern.test(boardingPoint)) {
        boardingPointError.textContent = "Invalid boarding point. Use format: Location (HH:MM)";
        formValid = false;
    }

    if (droppingPoint === "") {
        droppingPointError.textContent = "Dropping point is required."
        formValid = false;
    }
    else if (!validPattern.test(droppingPoint)) {
        droppingPointError.textContent = "Invalid dropping point. Use format: Location (HH:MM)";
        formValid = false;
    }


    if (toLocation === "") {
        toLocationError.textContent = "To location is required.";
        formValid = false;
    } else if (/\d/.test(toLocation)) {
        toLocationError.textContent = "Enter valid to location.";
        formValid = false;
    }

    if (Departure === "") {
        departureTimeError.textContent = "Departure time is required.";
        formValid = false;
    } else if (!/^\d{2}:\d{2}$/.test(Departure)) {
        departureTimeError.textContent = "Please enter a valid time in HH:MM format.";
        formValid = false;
    }

    if (date === "") {
        departureDateError.textContent = "Departure date is required.";
        formValid = false;
    }

    if (Arrival === "") {
        arrivalTimeError.textContent = "Arrival time is required.";
        formValid = false;
    } else if (!/^\d{2}:\d{2}$/.test(Arrival)) {
        arrivalTimeError.textContent = "Please enter a valid time in HH:MM format.";
        formValid = false;
    }

    if (arrivalDate === "") {
        arrivalDateError.textContent = "Arrival date is required.";
        formValid = false;
    }

    if (Duration === "") {
        durationError.textContent = "Duration is required.";
        formValid = false;
    } else if (!/^\d{2}h \d{2}m$/.test(Duration)) {
        durationError.textContent = "Please enter a valid time in '00h 00m' format.";
        formValid = false;
    }


    if (inrRate === "") {
        fareError.textContent = "Fare amount is required.";
        formValid = false;
    } else if (isNaN(inrRate)) {
        fareError.textContent = "Enter valid fare amount.";
        formValid = false;
    }

    if (seats === "") {
        seatsError.textContent = "Seat count is required.";
        formValid = false;
    }

    if (ChargingPoint === "") {
        chargingPointError.textContent = "Please select an option for charging point.";
        formValid = false;
    }

    if (WaterBottle === "") {
        waterBottleError.textContent = "Please select an option for water bottle.";
        formValid = false;
    }

    if (Blankets === "") {
        blanketsError.textContent = "Please select an option for blankets.";
        formValid = false;
    }

    // if (rating === "") {
    //     ratingError.textContent = "Rating is required."
    //     formValid = false;
    // }


    if (formValid) {
        try {
            const busRef = ref(database, "buses");

            // Fetch existing buses to calculate the next busId
            const snapshot = await get(busRef);
            const buses = snapshot.val();

            let nextBusId = 1;
            if (buses) {
                const busIds = Object.keys(buses).map(id => parseInt(id));
                nextBusId = Math.max(...busIds) + 1;
            }

            // Convert to boolean values for real-time database
            const waterBottleBool = WaterBottle === "Yes";
            const blanketsBool = Blankets === "Yes";
            const chargingPointBool = ChargingPoint === "Yes";

            // Format the arrival date dd-mm-yyyy
            const [year, month, day] = arrivalDate.split("-");  // Split the yyyy-mm-dd format
            const ArrivalDate = `${day}-${month}-${year}`;   // Format it as dd-mm-yyyy

            // Generate seat details
            const seatDetails = {};
            for (let i = 1; i <= seats; i++) {
                seatDetails[i] = "available"; // Default to "available"
            }


            // Create bus data for real-time database
            const busDataFirebase = {
                busId: selectedBusId || nextBusId, // Use selectedBusId if updating, otherwise generate a new ID
                name: busName,
                bustype: busType,
                from: fromLocation,
                to: toLocation,
                Departure,
                date,
                Arrival,
                ArrivalDate,
                Duration,
                inrRate,
                seats: seatDetails, // Store seat details instead of total seat count
                ratingBadge: {
                    badgeClass: "rating-badge",
                    starIcon: {
                        iconClass: "star-icon",
                        iconHTML: "&#9733;"
                    },
                    ratingValue: {
                        valueClass: "rating-value",
                        textContent: 3.4
                    }
                },
                WaterBottle: waterBottleBool,
                Blankets: blanketsBool,
                ChargingPoint: chargingPointBool,
                boardingPoint,
                droppingPoint
            };

            // Create bus data for local storage
            const busDataLocal = {
                busId: selectedBusId || nextBusId,
                name: busName,
                bustype: busType,
                from: fromLocation,
                to: toLocation,
                Departure,
                date,
                Arrival,
                arrivalDate,
                Duration,
                inrRate,
                seats,
                ratingBadge: {
                    badgeClass: "rating-badge",
                    starIcon: {
                        iconClass: "star-icon",
                        iconHTML: "&#9733;"
                    },
                    ratingValue: {
                        valueClass: "rating-value",
                        textContent: 3.4
                    }
                },
                WaterBottle,
                Blankets,
                ChargingPoint,
                boardingPoint,
                droppingPoint
            };

            // Update or add bus data in Firebase
            if (selectedBusId) {
                await update(ref(database, `buses/${selectedBusId}`), busDataFirebase); // Update existing bus
                // await update(ref(database, `seats/${selectedBusId}`), seatDetails); // Update seat details
            } else {
                await set(ref(database, `buses/${busDataFirebase.busId}`), busDataFirebase); // Add new bus
                // await set(ref(database, `seats/${busDataFirebase.busId}`), seatDetails); // Add seat details
            }

            // Update or save bus in local storage
            const savedBuses = JSON.parse(localStorage.getItem("busList")) || [];
            if (selectedBusId) {
                const updatedBuses = savedBuses.map(bus => bus.busId === selectedBusId ? busDataLocal : bus);
                localStorage.setItem("busList", JSON.stringify(updatedBuses));
            } else {
                savedBuses.push(busDataLocal);
                localStorage.setItem("busList", JSON.stringify(savedBuses));
            }

            // Find or create the bus div
            let busDiv = document.querySelector(`[data-bus-id="${busDataLocal.busId}"]`);
            if (!busDiv) {
                // Create a new div if it doesn't exist
                busDiv = createBusDiv(busDataLocal, savedBuses.length);
            } else {
                // Update the existing div
                busDiv.querySelector(".bus-text").textContent = busName;
                busDiv.querySelector(".bus-details").textContent = `${fromLocation} to ${toLocation} - Departure: ${Departure}`;
            }

            // Reset selections
            selectedBusDiv = null;
            selectedBusId = null;

            // Scroll to the top of the page
            window.scrollTo(0, 0);

            // Success message
            const messageDiv = document.createElement('div');
            messageDiv.textContent = "Bus added or updated successfully.";
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
                window.location.href = "../html/admin.html";
            }, 3000);




            clearFormValues(); // Clear form
        } catch (error) {
            // Handle errors and display meaningful messages
            alert("Error updating/saving bus: " + error.message);
            console.error("Detailed Error:", error);
        }
    }
});

// Load buses from local storage on page load
loadBusesFromLocalStorage();
