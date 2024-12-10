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

/* // Function to fetch and display seat data
async function fetchSeatData() {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "buses/0/busSeats")); // Ensure this path matches your database structure
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Fetched Data:", data);

            // Display seat information
            createSeats(data);
        } else {
            console.error("No data available at the specified path");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to dynamically create seats based on fetched data
function createSeats(data) {
    const lowerDeckDiv = document.getElementById("lowerDeckDiv");
    const upperDeckDiv = document.getElementById("upperDeckDiv");

    // Check if required HTML elements exist
    if (!lowerDeckDiv || !upperDeckDiv) {
        console.error("Required HTML elements (lowerDeckDiv or upperDeckDiv) are missing");
        return;
    }

    // Clear previous content
    lowerDeckDiv.innerHTML = "";
    upperDeckDiv.innerHTML = "";

    // Create lower deck seats
    if (data.lowerDeck) {
        console.log("Lower Deck Data:", data.lowerDeck);
        for (let i = 0; i < data.lowerDeck.sleeper; i++) {
            const seat = document.createElement("div");
            seat.className = "seat sleeper";
            seat.textContent = `LS-${i + 1}`; // Lower Sleeper
            lowerDeckDiv.appendChild(seat);
        }

        for (let i = 0; i < data.lowerDeck.seater; i++) {
            const seat = document.createElement("div");
            seat.className = "seat seater";
            seat.textContent = `LST-${i + 1}`; // Lower Seater
            lowerDeckDiv.appendChild(seat);
        }
    } else {
        console.warn("No lower deck data found");
    }

    // Create upper deck seats
    if (data.upperDeck) {
        console.log("Upper Deck Data:", data.upperDeck);
        for (let i = 0; i < data.upperDeck.sleeper; i++) {
            const seat = document.createElement("div");
            seat.className = "seat sleeper";
            seat.textContent = `US-${i + 1}`; // Upper Sleeper
            upperDeckDiv.appendChild(seat);
        }

        for (let i = 0; i < data.upperDeck.seater; i++) {
            const seat = document.createElement("div");
            seat.className = "seat seater";
            seat.textContent = `UST-${i + 1}`; // Upper Seater
            upperDeckDiv.appendChild(seat);
        }
    } else {
        console.warn("No upper deck data found");
    }
}

// Call fetchSeatData on page load
fetchSeatData();
 */


















// Redirect to home page on custom back arrow click
document.getElementById("leftArrow").addEventListener("click", () => {
    window.location = "../html/busList.html";
});