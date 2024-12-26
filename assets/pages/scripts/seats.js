/* // Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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

// Handle back arrow
document.getElementById("leftArrow").addEventListener("click", () => {
  window.location.href = "../html/busList.html";
});

// Get selected bus from localStorage
const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

if (!selectedBus) {
  console.error("No bus selected. Please select a bus and try again.");
} else {
  const busId = selectedBus.busId;
  const lowerSeatAlignment = document.getElementById("lowerSeatAlignment");
  const upperSeatAlignment = document.getElementById("upperSeatAlignment");
  const busNameElement = document.getElementById("busName");
  const times = document.getElementById("times");

  const busRef = ref(database, `buses/${busId}`);
  get(busRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const busData = snapshot.val();
        const busName = busData.name || "Unnamed Bus";
        const DepartureTime = busData.Departure || "Unknown";
        const arrivalTime = busData.Arrival || "Unknown";

        busNameElement.textContent = busName;
        times.textContent = `${DepartureTime} - ${arrivalTime}`;

        const seatData = busData.seats || {};
        const seatKeys = Object.keys(seatData).sort((a, b) => a - b);
        const totalSeats = seatKeys.length;

        lowerSeatAlignment.innerHTML = "";
        upperSeatAlignment.innerHTML = "";

        const rows = 3; // Fixed number of rows
        const columns = Math.ceil(totalSeats / (2 * rows)); // Columns for both decks
        const lowerDeckSeats = Math.floor(totalSeats / 2);
        const upperDeckSeats = totalSeats - lowerDeckSeats;

        // Dynamic grid alignment
        if(totalSeats === 30){
        lowerSeatAlignment.style.gridTemplateColumns = `repeat(5, 103px)`;
        upperSeatAlignment.style.gridTemplateColumns = `repeat(5, 103px)`;
        }

        // Render Lower Deck (Column-First)
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const seatIndex = col * rows + row; // Column-first calculation
            if (seatIndex >= lowerDeckSeats) break;

            const seat = document.createElement("div");
            seat.classList.add("seat")
            seat.textContent = `L${seatIndex + 1}`;
            lowerSeatAlignment.appendChild(seat);
          }
        }

        // Render Upper Deck (Column-First)
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const seatIndex = lowerDeckSeats + col * rows + row; // Offset by lowerDeckSeats
            if (seatIndex >= totalSeats) break;

            const seat = document.createElement("div");
            seat.classList.add("seat")
            seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;
            upperSeatAlignment.appendChild(seat);
          }
        }
      } else {
        console.log("No bus data available for this bus.");
      }
    })
    .catch((error) => {
      console.error("Error fetching bus data:", error);
    });
} */

// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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

// Handle back arrow
document.getElementById("leftArrow").addEventListener("click", () => {
  window.location.href = "../html/busList.html";
});

// Get selected bus from localStorage
const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

if (!selectedBus) {
  console.error("No bus selected. Please select a bus and try again.");
} else {
  const busId = selectedBus.busId;
  const lowerSeatAlignment = document.getElementById("lowerSeatAlignment");
  const upperSeatAlignment = document.getElementById("upperSeatAlignment");
  const busNameElement = document.getElementById("busName");
  const times = document.getElementById("times");

  const busRef = ref(database, `buses/${busId}`);
  get(busRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const busData = snapshot.val();
        const busName = busData.name || "Unnamed Bus";
        const DepartureTime = busData.Departure || "Unknown";
        const arrivalTime = busData.Arrival || "Unknown";

        busNameElement.textContent = busName;
        times.textContent = `${DepartureTime} - ${arrivalTime}`;

        const seatData = busData.seats || {};
        const seatKeys = Object.keys(seatData).sort((a, b) => a - b);
        const totalSeats = seatKeys.length;

        lowerSeatAlignment.innerHTML = "";
        upperSeatAlignment.innerHTML = "";

        const rows = 3; // Fixed number of rows
        const columns = Math.ceil(totalSeats / (2 * rows)); // Columns for both decks
        const lowerDeckSeats = Math.floor(totalSeats / 2);
        const upperDeckSeats = totalSeats - lowerDeckSeats;

        // Dynamic grid alignment
        if(totalSeats === 30){
        lowerSeatAlignment.style.gridTemplateColumns = `repeat(5, 103px)`;
        upperSeatAlignment.style.gridTemplateColumns = `repeat(5, 103px)`;
        }

        // Render Lower Deck (Column-First)
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const seatIndex = col * rows + row; // Column-first calculation
            if (seatIndex >= lowerDeckSeats) break;

            const seat = document.createElement("div");
            seat.classList.add("seat")
            seat.textContent = `L${seatIndex + 1}`;
            lowerSeatAlignment.appendChild(seat);
          }
        }

        // Render Upper Deck (Column-First)
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const seatIndex = lowerDeckSeats + col * rows + row; // Offset by lowerDeckSeats
            if (seatIndex >= totalSeats) break;

            const seat = document.createElement("div");
            seat.classList.add("seat")
            seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;
            upperSeatAlignment.appendChild(seat);
          }
        }
      } else {
        console.log("No bus data available for this bus.");
      }
    })
    .catch((error) => {
      console.error("Error fetching bus data:", error);
    });
}
