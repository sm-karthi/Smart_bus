import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Initialize Firebase (replace with your configuration)
const firebaseConfig = {
    apiKey: "AIzaSyD2-zKNWSqkRWHsk49coYSbMfBnywCpdO8",
    authDomain: "smartbus-7443b.firebaseapp.com",
    projectId: "smartbus-7443b",
    storageBucket: "smartbus-7443b.appspot.com",
    messagingSenderId: "35022257891",
    appId: "1:35022257891:web:8eed74fb4131a414730fd6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Function to upload data from local JSON to Firebase
 */
async function uploadJSONToFirebase() {
    try {
        const response = await fetch("../../../../assets/pages/scripts/JSON/buses.json");
        if (!response.ok) throw new Error("Failed to load local JSON file.");
        
        const buses = await response.json();
        if (!Array.isArray(buses)) throw new Error("Invalid JSON format. Expected an array.");

        // Push buses to Firebase
        await updateJSONToFirebase(buses);
        console.log("Data uploaded to Firebase successfully!");
    } catch (error) {
        console.error("Error uploading JSON to Firebase:", error);
    }
}

/**
 * Function to update Firebase with new JSON data
 * @param {Array} buses - The JSON array of buses to save in Firebase
 */
async function updateJSONToFirebase(buses) {
    try {
        const updates = {}; // Object to hold all updates
        buses.forEach((bus) => {
            // Use unique identifiers if available (e.g., bus.id)
            const key = bus.id || `${Date.now()}-${Math.random()}`; // Fallback for unique key
            updates[`buses/${key}`] = bus;
        });

        // Push all updates at once to Firebase
        await update(ref(database), updates);
        console.log("Firebase updated with new JSON details!");
    } catch (error) {
        console.error("Error updating Firebase:", error);
    }
}

// Upload local JSON data to Firebase when the page loads
uploadJSONToFirebase();
