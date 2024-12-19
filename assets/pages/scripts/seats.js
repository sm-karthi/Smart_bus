// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
    authDomain: "smartbus-7443b.firebaseapp.com",
    databaseURL: "https://smartbus-7443b-default-rtdb.firebaseio.com/",
    projectId: "smartbus-7443b",
    storageBucket: "smartbus-7443b.appspot.com",
    messagingSenderId: "35022257891",
    appId: "1:35022257891:web:8eed74fb4131a414730fd6"
};

// Initialize Firebase and Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



/* // Function to load seat details for the selected bus
async function loadSeatDetails() {
    const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

    if (!selectedBus || !selectedBus.id) {
        return;
    }

    const busId = selectedBus.id;

    try {
        // Fetch seat details based on bus ID
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `seats/${busId}`));

        if (snapshot.exists()) {
            const seatData = snapshot.val();

            // Render seat details
            seatsContainer.innerHTML = `<h3>Seats for Bus: ${selectedBus.name}</h3>`;
            const seatsList = document.createElement("ul");

            Object.entries(seatData).forEach(([seatNumber, seatInfo]) => {
                const seatItem = document.createElement("li");
                seatItem.textContent = `Seat ${seatNumber}: ${
                    seatInfo.isAvailable ? "Available" : "Booked"
                }`;
                seatsList.appendChild(seatItem);
            });

            seatsContainer.appendChild(seatsList);
        } else {
        }
    } catch (error) {
        console.error("Error fetching seat details:", error);
        seatsContainer.innerHTML = `<h5>Error loading seat data. Please try again later.</h5>`;
    }
}

// Call loadSeatDetails on page load
document.addEventListener("DOMContentLoaded", loadSeatDetails); */


// Redirect to home page on custom back arrow click
document.getElementById("leftArrow").addEventListener("click", () => {
    window.location = "../html/busList.html";
  });
  
 // Select all seat elements
const seats = document.querySelectorAll('.seat');

// Div to show boarding/dropping point modal
const pointModal = document.getElementById('pointModal');

// Passenger details form div
const passengerForm = document.getElementById('passengerForm');

// Keep track of selected seats
let selectedSeats = [];

// Error message container
const messageContainer = document.getElementById('message-container');

// Div to display the total amount
const totalAmountDiv = document.getElementById('total-amount');

// Cost per seat
const costPerSeat = 2100;

// Boarding and dropping point variables
let selectedBoardingPoint = null;
let selectedDroppingPoint = null;

// Add click event to each seat
seats.forEach((seat) => {
  seat.addEventListener('click', () => {
    const seatNumber = seat.textContent; // Get seat number

    // Check if the seat is already selected
    if (seat.classList.contains('selected')) {
      // Deselect the seat
      seat.classList.remove('selected');
      selectedSeats = selectedSeats.filter((num) => num !== seatNumber); // Remove from selected list
    } else {
      // Check if the limit is reached
      if (selectedSeats.length < 6) {
        // Select the seat
        seat.classList.add('selected');
        selectedSeats.push(seatNumber); // Add to selected list
      } else {
        // Show error message
        showErrorMessage("You can select a maximum of 6 seats.");
        return; // Exit if seat limit is exceeded
      }
    }

    // Update total amount
    updateTotalAmount();

    // Show or hide the modal based on selected seats
    if (selectedSeats.length > 0) {
      showModalWithAnimation();
    } else {
      hideModalWithAnimation();
    }

    // Update confirmation details dynamically
    updateConfirmationDetails();
  });
});

// Function to show error message
function showErrorMessage(message) {
  if (!messageContainer.querySelector('.error-message')) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.classList.add('error-message');
    messageContainer.appendChild(messageDiv);

    messageContainer.style.visibility = 'visible';
    setTimeout(() => messageContainer.classList.add('expand'), 12);
    setTimeout(() => messageContainer.classList.remove('expand'), 2500);
    setTimeout(() => {
      messageContainer.style.visibility = 'hidden';
      messageContainer.innerHTML = '';
    }, 3000);
  }
}

// Function to update total amount
function updateTotalAmount() {
  const totalAmount = selectedSeats.length * costPerSeat;
  totalAmountDiv.textContent = `Total Amount: ₹${totalAmount}`;
}

// Show the modal with animation
function showModalWithAnimation() {
  pointModal.style.opacity = '0';
  pointModal.style.display = 'block';
  setTimeout(() => {
    pointModal.style.transition = 'opacity 0.3s ease-in-out';
    pointModal.style.opacity = '1';
  }, 10);
}

// Hide the modal with animation
function hideModalWithAnimation() {
  pointModal.style.transition = 'opacity 0.3s ease-in-out';
  pointModal.style.opacity = '0';
  setTimeout(() => {
    pointModal.style.display = 'none';
  }, 300);
}

// Selectors for modal, tabs, and location containers
const boardingTab = document.getElementById('boardingTab');
const droppingTab = document.getElementById('droppingTab');
const boardingLocations = document.getElementById('boardingLocations');
const droppingLocations = document.getElementById('droppingLocations');

// Function to handle tab switching
function switchTab(tab) {
  if (tab === 'boarding') {
    boardingTab.classList.add('active');
    droppingTab.classList.remove('active');
    boardingLocations.classList.add('active');
    droppingLocations.classList.remove('active');
  } else if (tab === 'dropping') {
    boardingTab.classList.remove('active');
    droppingTab.classList.add('active');
    boardingLocations.classList.remove('active');
    droppingLocations.classList.add('active');
  }
}

// Add event listeners to tabs
boardingTab.addEventListener('click', () => switchTab('boarding'));
droppingTab.addEventListener('click', () => switchTab('dropping'));

// Function to handle location selection
function selectLocation(event) {
  const selectedLocation = event.target;
  const isBoarding = boardingLocations.classList.contains('active');

  if (isBoarding) {
    document.querySelectorAll('#boardingLocations .location').forEach(loc => {
      loc.style.backgroundColor = '';
      loc.style.color = '';
    });
    selectedBoardingPoint = selectedLocation.textContent;
  } else {
    document.querySelectorAll('#droppingLocations .location').forEach(loc => {
      loc.style.backgroundColor = '';
      loc.style.color = '';
    });
    selectedDroppingPoint = selectedLocation.textContent;
  }

  selectedLocation.style.backgroundColor = "rgb(248, 107, 121)";
  selectedLocation.style.color = "white";

  if (isBoarding) {
    setTimeout(() => switchTab('dropping'), 300);
  }

  updateConfirmationDetails();
}

// Add event listeners to all boarding and dropping locations
document.querySelectorAll('.location').forEach(location => {
  location.addEventListener('click', selectLocation);
});

// Function to update confirmation details dynamically
function updateConfirmationDetails() {
  if (selectedSeats.length > 0 && selectedBoardingPoint && selectedDroppingPoint) {
    pointModal.innerHTML = `
      <p id="changeLetter">Change</p>
      <h3 id="heading">Boarding & Dropping</h3>
      <p id="boarding">${selectedBoardingPoint}</p>
      <p id="dropping">${selectedDroppingPoint}</p>
      <p id="seatNumber">Seat Numbers: ${selectedSeats.join(', ')}</p>
      <p id="amount">Total Amount: ₹${selectedSeats.length * costPerSeat}</p>
      <button id="proceedButton">PROCEED TO BOOK</button>
    `;

    // Add event listener for "Change" letter to show the dropping point div
    document.getElementById("changeLetter").addEventListener('click', () => switchTab('dropping'));
      

    // Add event listener for proceed button
    document.getElementById('proceedButton').addEventListener('click', () => {
      // Hide the modal
      hideModalWithAnimation();
      // Show passenger details form
      passengerForm.style.display = 'block';
    });
  }
}
