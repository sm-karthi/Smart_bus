// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
  authDomain: "smartbus-7443b.firebaseapp.com",
  databaseURL: "https://smartbus-7443b-default-rtdb.firebaseio.com/",
  projectId: "smartbus-7443b",
  storageBucket: "smartbus-7443b.appspot.com",
  messagingSenderId: "35022257891",
  appId: "1:35022257891:web:8eed74fb4131a414730fd6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get selected bus from localStorage
const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

const busId = selectedBus.busId;

const busRef = ref(database, `buses/${busId}`);
get(busRef)
  .then((snapshot) => {

    if (snapshot.exists()) {
      const busData = snapshot.val();
      const fromLocation = busData.from;
      const toLocation = busData.to;

      document.title = `${fromLocation} to ${toLocation} - Smart bus`;
      
    }
  });

// Handle arrow icon
document.getElementById("leftArrow").addEventListener("click", () => {
  window.location.href = "../pages/seats.html";
});

// Retrieve data from localStorage
const busDataLocal = JSON.parse(localStorage.getItem("passengerDetailsWithBusDetails"));

// get all values
const showFinalDetails = document.getElementById("showFinalDetails");
const busName = document.getElementById("busName");
const busType = document.getElementById("busType");
const departureDate = document.getElementById("departureDate");
const seatsName = document.getElementById("seatsName");
const boardingPoint = document.getElementById("boardingPoint");
const droppingPoint = document.getElementById("droppingPoint");
const passengerName = document.getElementById("passengerName");
const passengerEmail = document.getElementById("passengerEmail");
const contactNumber = document.getElementById("contactNumber");
const ticketSentSentence = document.getElementById("ticketSentSentence");

// Assuming you have a container to display all passengers
const passengerDetailsContainer = document.getElementById("passengerDetailsContainer");

// Helper function to format date
function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Display the bus details

busName.textContent = busDataLocal.busName;
busType.textContent = busDataLocal.busType;

// Format the departure date to dd-mm-yyyy
departureDate.textContent = formatDateToDDMMYYYY(busDataLocal.departureDate);

// Format seat names with gaps (e.g., L2, U3, S7)
if (Array.isArray(busDataLocal.selectedSeats)) {
  const formattedSeats = busDataLocal.selectedSeats.map(seat => seat.trim()).join(', ');
  seatsName.textContent = formattedSeats;
} else {
  seatsName.textContent = busDataLocal.selectedSeats;
}

boardingPoint.textContent = busDataLocal.selectedBoardingPoint;
droppingPoint.textContent = busDataLocal.selectedDroppingPoint;

// Remove ticketSentSentence from its original position
ticketSentSentence.remove();

let formattedName;

// Display the passenger details
if (busDataLocal.passengerDetails.length > 0) {
  busDataLocal.passengerDetails.forEach((passenger, index) => {
    // Create a div for each passenger
    const passengerDiv = document.createElement("div");
    passengerDiv.classList.add("passenger-detail");

    // Capitalize the first letter of the name and get the first letter of gender
    formattedName = passenger.name.charAt(0).toUpperCase() + passenger.name.slice(1);
    const formattedGender = passenger.gender.charAt(0).toUpperCase();

    // Combine name, age, and gender into one string
    const passengerInfo = `${formattedName} (${passenger.age}, ${formattedGender})`;

    // Add passenger details to the div
    passengerDiv.innerHTML = `
        <p>${passengerInfo}</p>
      `;

    // Append the passenger details div to the container
    passengerDetailsContainer.appendChild(passengerDiv);
  });
}

// Append ticketSentSentence, email, and contact number to the end
const ticketInfoDiv = document.createElement("div");
ticketInfoDiv.classList.add("ticket-info");
ticketInfoDiv.innerHTML = `
    <h3 id="ticketSentSentence">${ticketSentSentence.textContent}</h3>
    <div>${busDataLocal.emailInput}</div>
    <div>${busDataLocal.contactInput}</div>
  `;
showFinalDetails.appendChild(ticketInfoDiv);


// Ensure data exists in localStorage before using it
const selectedBusId = JSON.parse(localStorage.getItem("selectedBus"));
let selectedSeats = JSON.parse(localStorage.getItem("selectedSeatIndices"));

// Debugging: Log the selected bus and selected seats from localStorage
console.log("Selected Bus from LocalStorage:", selectedBusId);
console.log("Selected Seats from LocalStorage:", selectedSeats);

// Check if selectedBusId or selectedSeats is null or undefined
if (!selectedBusId || !selectedBusId.busId) {
  console.error("Selected bus ID is missing or invalid.");
  alert("Selected bus ID is missing or invalid. Please try again.");
} else if (!Array.isArray(selectedSeats)) {
  selectedSeats = [selectedSeats]; // Ensure selectedSeats is an array
  console.log("Selected Seats:", selectedSeats);
} else {
  console.log("Selected Bus ID:", selectedBusId.busId);
  console.log("Selected Seats:", selectedSeats);

  // Function to update seat availability in Firebase
  const updateSeatAvailability = async (busId, selectedSeats, passengerDetails) => {
    try {
      // Firebase reference for bus seats
      const busSeatsRef = ref(database, `buses/${busId}/seats`);
      console.log("Bus Seats Reference:", busSeatsRef);

      // Attempt to get data from Firebase
      const snapshot = await get(busSeatsRef);
      console.log("Snapshot exists:", snapshot.exists());

      if (snapshot.exists()) {
        const seatsData = snapshot.val();
        console.log("Seats data:", seatsData); // Log the seat data from Firebase

        // Update the selected seats based on gender
        selectedSeats.forEach((seatIndex, index) => {
          console.log("Updating seat:", seatIndex); // Log seat index being updated

          const adjustedSeatIndex = parseInt(seatIndex); // Adjust index if necessary
          console.log("Adjusted Seat Index:", adjustedSeatIndex); // Log the adjusted index

          if (adjustedSeatIndex && seatsData[adjustedSeatIndex] !== undefined) {
            const passenger = passengerDetails[index]; // Match seat with passenger details
            if (passenger.gender.toLowerCase() === "male") {
              seatsData[adjustedSeatIndex] = "unavailable"; // Mark as unavailable for males
            } else if (passenger.gender.toLowerCase() === "female") {
              seatsData[adjustedSeatIndex] = "female"; // Mark as female for females
            }
          } else {
            console.warn(`Seat index ${adjustedSeatIndex} not found in seats data.`);
          }
        });

        const seatsObject = {};
        seatsData.forEach((seat, index) => {
          seatsObject[index] = seat; // Set the index as the key
        });

        // Push updated data back to Firebase
        await update(busSeatsRef, seatsObject);
        console.log("Seats updated successfully.");
      } else {
        console.error("Bus seats data not found in the database.");
        alert("Bus seats data not found in the database. Please try again.");
      }
    } catch (error) {
      console.error("Error updating seats:", error);
      alert("Error updating seats. Please try again.");
    }
  };

 



  // Function to save ticket booking details to localStorage
  function saveTicketDetailsToLocalStorage() {
    const ticketDetails = {
      boardingPoint: busDataLocal.selectedBoardingPoint,
      droppingPoint: busDataLocal.selectedDroppingPoint,
      departureDate: busDataLocal.departureDate,
      selectedSeats: busDataLocal.selectedSeats,
      passengerDetails: busDataLocal.passengerDetails,
      busName: busDataLocal.busName,
      departureTime: busDataLocal.DepartureTime,
    };

    // Retrieve existing tickets from localStorage or initialize an empty array
    let tickets = JSON.parse(localStorage.getItem("bookedTickets")) || [];

    // Add the new ticket details
    tickets.push(ticketDetails);

    // Save the updated tickets array back to localStorage
    localStorage.setItem("bookedTickets", JSON.stringify(tickets));
    console.log("Ticket details saved to localStorage:", ticketDetails);
  }



  // Handle pay now button
  const payNowBtn = document.getElementById("payNowBtn");
  const tickContainer = document.getElementById("tickContainer");

  // Function to show success animation and redirect
  function showSuccessAnimation() {
    // Display the tick animation
    tickContainer.style.display = "flex";
    tickContainer.classList.remove("hidden");

    // Wait for animation to complete, then redirect
    setTimeout(() => {
      tickContainer.style.display = "none";
      window.location.href = "../pages/busList.html"; // Redirect to bus list page
    }, 4000); // 4 seconds
  }

  payNowBtn.addEventListener("click", async () => {
    try {
      // Update seats in Firebase
      await updateSeatAvailability(selectedBusId.busId, selectedSeats, busDataLocal.passengerDetails);

      // Save ticket details to localStorage
      saveTicketDetailsToLocalStorage();
    sentEmail(email, bus_name, boarding_Point, dropping_Point, travelDate, Seats, allPassengerNames);

      // Show success animation
      showSuccessAnimation();

    } catch (error) {
      console.error("Error during pay now:", error);
      alert("Error processing payment. Please try again.");
    }
  });

}


let bus_name = busDataLocal.busName;
let boarding_Point = busDataLocal.selectedBoardingPoint;
let dropping_Point = busDataLocal.selectedDroppingPoint;
let travelDate = formatDateToDDMMYYYY(busDataLocal.departureDate); // Avoid using "Date" as it's a reserved keyword.
let Seats = busDataLocal.selectedSeats.join(", "); // Convert seats array to string
// Generate all passenger names as a single string
const allPassengerNames = busDataLocal.passengerDetails
  .map(passenger => `${passenger.name.charAt(0).toUpperCase() + passenger.name.slice(1)} (${passenger.age}, ${passenger.gender.charAt(0).toUpperCase()})`)
  .join(", ");




let email=busDataLocal.emailInput;
emailjs.init('KYPpsm8Fey06PqEp_');


function sentEmail(email, bus_name, boarding_Point, dropping_Point, travelDate, Seats, allPassengerNames) {
  return emailjs.send('service_bbt3i93', 'template_yraeoyc', {
    to_email: email,
    Bus_name: bus_name,
    boarding_point: boarding_Point,
    dropping_point: dropping_Point,
    date: travelDate,
    seats: Seats,
    passenger_name: allPassengerNames, // Send all passenger names
  })
  .then((response) => {
    console.log('Email sent successfully', response);
  })
  .catch((error) => {
    console.error('Error sending email', error);
  });
}