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

// Error message get id
const messageContainer = document.getElementById("message-container");
messageContainer.innerHTML = '';
messageContainer.classList.remove('expand');

if (!selectedBus) {
  console.error("No bus selected. Please select a bus and try again.");
} else {
  const busId = selectedBus.busId;

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
        const busType = busData.bustype;
        const amount = busData.inrRate;

        busNameElement.textContent = busName;
        times.textContent = `${DepartureTime} - ${arrivalTime}`;


        

        // Get boarding and dropping points
      const boardingPoints = busData.boardingPoint.split(", ");
      const droppingPoints = busData.droppingPoint.split(", ");

      // Create a container for headings and points
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("boardingPointDiv");

      document.body.appendChild(infoDiv);

      const headings = document.createElement("h3");
      headings.id = "headings";
      headings.textContent = "Select boarding and dropping point";
      infoDiv.appendChild(headings);

      const firstLine = document.createElement("div");
      firstLine.id = "firstLine";
      infoDiv.appendChild(firstLine);

      // Create container for headings
      const headingsContainer = document.createElement("div");
      headingsContainer.id = "headingsContainer";

      infoDiv.appendChild(headingsContainer);

      // Create underline element
      const underline = document.createElement("div");
      underline.id = "underLine";
      infoDiv.appendChild(underline);

      // Create headings for boarding and dropping points
      const boardingHeading = document.createElement("div");
      boardingHeading.id = "boardingHeading";
      boardingHeading.textContent = "Boarding Point";
      boardingHeading.dataset.type = "boarding";
      headingsContainer.appendChild(boardingHeading);

      const droppingHeading = document.createElement("div");
      droppingHeading.id = "droppingPoint";
      droppingHeading.textContent = "Dropping Point";
      droppingHeading.dataset.type = "dropping";
      headingsContainer.appendChild(droppingHeading);

      // Create container for points
      const pointsContainer = document.createElement("div");
      pointsContainer.style.marginTop = "20px";
      infoDiv.appendChild(pointsContainer);

      // Create a container to display the amount
      const amountDisplay = document.createElement("div");
      amountDisplay.id = "amountDisplay";
      amountDisplay.textContent = `Total Amount: ₹0`; // Initial amount display
      infoDiv.appendChild(amountDisplay);

      // Variables to track selections
      let selectedBoardingPoint = null;
      let selectedDroppingPoint = null;
      

      // Function to update the view
      const updateView = (type) => {
        // Clear current points
        pointsContainer.innerHTML = "";

        // Update points based on type
        const points = type === "boarding" ? boardingPoints : droppingPoints;
        points.forEach((point) => {
          const pointDiv = document.createElement("div");
          pointDiv.classList.add("pointDiv");
          pointDiv.textContent = point;

          // Check if the point is selected
          if (type === "boarding" && point === selectedBoardingPoint) {
            pointDiv.classList.add("selected");
          } else if (type === "dropping" && point === selectedDroppingPoint) {
            pointDiv.classList.add("selected");
          }

          // Add click event to select a point
          pointDiv.addEventListener("click", () => {
            // Clear previous selection
            const selectedPointDiv = document.querySelector(".pointDiv.selected");
            if (selectedPointDiv) {
              selectedPointDiv.classList.remove("selected");
            }

            // Mark the current point as selected
            pointDiv.classList.add("selected");

            if (type === "boarding") {
              selectedBoardingPoint = point;
              // Automatically switch to dropping point view
              updateView("dropping");
            } else {
              selectedDroppingPoint = point;
              console.log("Selected Boarding Point:", selectedBoardingPoint);
              console.log("Selected Dropping Point:", selectedDroppingPoint);
            }
          });

          pointsContainer.appendChild(pointDiv);
        });

        // Move underline
        underline.style.transform =
          type === "boarding" ? "translateX(0%)" : "translateX(135%)";
      };

      // Add event listeners to headings
      boardingHeading.addEventListener("click", () => {
        updateView("boarding");
      });

      droppingHeading.addEventListener("click", () => {
        updateView("dropping");
      });

      
        

      // Initialize view with boarding points
      updateView("boarding");
    







        const seatData = busData.seats || {};
        const seatKeys = Object.keys(seatData).sort((a, b) => a - b);
        const totalSeats = seatKeys.length;

        lowerSeatAlignment.innerHTML = "";
        upperSeatAlignment.innerHTML = "";

        // Track selected seats count
        let selectedSeatsCount = 0;


      // Function to update the total amount
      const updateAmount = () => {
        const totalAmount = selectedSeatsCount * amount; // Calculate total based on seats
        amountDisplay.textContent = `Amount: ₹${totalAmount}`;
      };

        // Add event listener for seat selection
        const toggleSeatSelection = (seat) => {
          seat.addEventListener("click", () => {
            if (seat.style.backgroundColor === "rgb(255, 118, 132)") {
              // Deselect seat
              seat.style.backgroundColor = ""; // Revert to original color
              seat.style.color = "";
              selectedSeatsCount--; // Decrement selected seats count

             


              // Hide infoDiv only if no seats are selected
              if (selectedSeatsCount === 0) {
                infoDiv.style.display = "none";
              }
            } else {
              if (selectedSeatsCount >= 6) {
                // Clear existing error messages
                messageContainer.innerHTML = "";

                const messageDiv = document.createElement("div");
                messageDiv.textContent = "You can select a maximum of 6 seats.";
                messageContainer.appendChild(messageDiv);

                messageContainer.style.visibility = "visible";
                setTimeout(() => {
                  messageContainer.classList.add("expand");
                }, 12);

                setTimeout(() => {
                  messageContainer.classList.remove("expand");
                }, 2500);

                setTimeout(() => {
                  messageContainer.style.visibility = "hidden";
                }, 3000);

                return;
              } else {
                // Select seat
                seat.style.backgroundColor = "rgb(255, 118, 132)"; // Change to selected color
                seat.style.color = "white";
                selectedSeatsCount++; // Increment selected seats count
                updateAmount(); // Update amount display


                // Show infoDiv
                infoDiv.style.display = "block";
              }
            }
            updateAmount(); // Update amount display
          });
        };






        // Check the bus type
        if (busType.includes("Seater")) {
          if (totalSeats === 48) {
            const lowerDeckRows = 3; // 3 rows in the lower deck
            const upperDeckRows = 3; // 3 rows in the upper deck
            const lowerDeckSeats = 30; // 12 + 12 + 6 seats in the lower deck
            const upperDeckSeats = 18; // Remaining seats in the upper deck
            const columns = 6; // 6 columns per row

            // Dynamic grid alignment
            lowerSeatAlignment.style.display = "grid";
            lowerSeatAlignment.style.gridTemplateColumns = `repeat(12, 35px)`; // 12 columns for first two rows of lower deck
            upperSeatAlignment.style.gridTemplateColumns = `repeat(6, 80px)`; // 6 columns for upper deck
            lowerSeatAlignment.style.gridTemplateRows = `40px 85px 50px`


            // Render the first row with odd-numbered seats
            let seatIndex = 1; // Start with 1 for odd-numbered seats
            for (let col = 0; col < 12; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${seatIndex}`; // Odd-numbered seats
              toggleSeatSelection(seat); // Attach event listener
              lowerSeatAlignment.appendChild(seat);
              seatIndex += 2; // Increment by 2 for odd numbers
            }

            // Render the second row with even-numbered seats
            seatIndex = 2; // Start with 2 for even-numbered seats
            for (let col = 0; col < 12; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${seatIndex}`; // Even-numbered seats
              toggleSeatSelection(seat); // Attach event listener
              lowerSeatAlignment.appendChild(seat);
              seatIndex += 2; // Increment by 2 for even numbers
            }

            // Update grid alignment for the third row
            const thirdRowContainer = document.createElement("div");
            thirdRowContainer.style.display = "grid";
            thirdRowContainer.style.gridTemplateColumns = `repeat(6, 90px)`; // 6 columns for third row

            // Render the 3rd row of 6 Sleeper seats
            let singleSeatIndex = 0;
            for (let col = 0; col < columns; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seat");
              seat.textContent = `L${singleSeatIndex + 1}`; // Label seat as "L" for Sleeper
              toggleSeatSelection(seat); // Attach event listener
              thirdRowContainer.appendChild(seat);
              singleSeatIndex++;
            }

            lowerSeatAlignment.appendChild(thirdRowContainer); // Append the third row container to the lower deck


            // Render Upper Deck (Column-First)
            for (let row = 0; row < upperDeckRows; row++) {
              for (let col = 0; col < columns; col++) {
                const seatIndex = lowerDeckSeats + col * upperDeckRows + row; // Offset by lowerDeckSeats
                if (seatIndex >= totalSeats) break;

                const seat = document.createElement("div");
                seat.classList.add("seat")
                seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;
                toggleSeatSelection(seat); // Attach event listener
                upperSeatAlignment.appendChild(seat);
              }
            }
          }
          else if (totalSeats === 40) {
            const lowerDeckRows = 3; // 3 rows in the lower deck
            const upperDeckRows = 3; // 3 rows in the upper deck
            const lowerDeckSeats = 25; // 10 + 10 + 5 seats in the lower deck
            const upperDeckSeats = 18; // Remaining seats in the upper deck
            const columns = 5; // 5 columns per row

            // Dynamic grid alignment
            lowerSeatAlignment.style.display = "grid";
            lowerSeatAlignment.style.gridTemplateColumns = `repeat(10, 45px)`; // 12 columns for first two rows of lower deck
            upperSeatAlignment.style.gridTemplateColumns = `repeat(5, 103px)`; // 6 columns for upper deck
            lowerSeatAlignment.style.gridTemplateRows = `40px 85px 50px`


            // Render the first row with odd-numbered seats
            let seatIndex = 1; // Start with 1 for odd-numbered seats
            for (let col = 0; col < 10; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${seatIndex}`; // Odd-numbered seats
              toggleSeatSelection(seat); // Attach event listener
              lowerSeatAlignment.appendChild(seat);
              seatIndex += 2; // Increment by 2 for odd numbers
            }

            // Render the second row with even-numbered seats
            seatIndex = 2; // Start with 2 for even-numbered seats
            for (let col = 0; col < 10; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${seatIndex}`; // Even-numbered seats
              toggleSeatSelection(seat); // Attach event listener
              lowerSeatAlignment.appendChild(seat);
              seatIndex += 2; // Increment by 2 for even numbers
            }

            // Update grid alignment for the third row
            const thirdRowContainer = document.createElement("div");
            thirdRowContainer.style.display = "grid";
            thirdRowContainer.style.gridTemplateColumns = `repeat(5, 113px)`; // 6 columns for third row

            // Render the 3rd row of 6 Sleeper seats
            let singleSeatIndex = 0;
            for (let col = 0; col < columns; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seat");
              seat.textContent = `L${singleSeatIndex + 1}`; // Label seat as "L" for Sleeper
              toggleSeatSelection(seat); // Attach event listener
              thirdRowContainer.appendChild(seat);
              singleSeatIndex++;
            }

            lowerSeatAlignment.appendChild(thirdRowContainer); // Append the third row container to the lower deck


            // Render Upper Deck (Column-First)
            for (let row = 0; row < upperDeckRows; row++) {
              for (let col = 0; col < columns; col++) {
                const seatIndex = lowerDeckSeats + col * upperDeckRows + row; // Offset by lowerDeckSeats
                if (seatIndex >= totalSeats) break;

                const seat = document.createElement("div");
                seat.classList.add("seat")
                seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;
                toggleSeatSelection(seat); // Attach event listener
                upperSeatAlignment.appendChild(seat);
              }
            }
          }
          else if (totalSeats === 55) {
            const lowerDeckRows = 4; // 4 rows in the lower deck
            const upperDeckRows = 3; // 3 rows in the upper deck
            const lowerDeckSeats = 37; // 12 + 12 + 1 + 12 seats in the lower deck
            const upperDeckSeats = 18; // Remaining seats in the upper deck
            const columns = 6; // 6 columns per row

            // Dynamic grid alignment
            lowerSeatAlignment.style.display = "grid";
            lowerSeatAlignment.style.gridTemplateRows = `38px 38px 38px`
            upperSeatAlignment.style.display = "grid";
            upperSeatAlignment.style.gridTemplateColumns = `repeat(6, 80px)`; // 6 columns for upper deck rows

            let firstRowIndex = 1;

            // Render the first row of 12 Seater seats
            const firstRow = document.createElement("div");
            firstRow.style.display = "grid";
            firstRow.style.gridTemplateColumns = `repeat(12, 45px)`; // 12 columns for first row
            for (let col = 0; col < 12; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${firstRowIndex}`; // Label seat as "S" for Seater
              toggleSeatSelection(seat); // Attach event listener
              firstRow.appendChild(seat);
              firstRowIndex += 3;
            }
            lowerSeatAlignment.appendChild(firstRow);



            let secondRowIndex = 2;
            // Render the second row of 12 Seater seats
            const secondRow = document.createElement("div");
            secondRow.style.display = "grid";
            secondRow.style.gridTemplateColumns = `repeat(12, 45px)`; // 12 columns for second row
            for (let col = 0; col < 12; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${secondRowIndex}`; // Label seat as "S" for Seater
              toggleSeatSelection(seat); // Attach event listener
              secondRow.appendChild(seat);
              secondRowIndex += 3;
            }
            lowerSeatAlignment.appendChild(secondRow);

            // Render the third row with 1 Seater seat
            const thirdRow = document.createElement("div");
            thirdRow.style.marginLeft = "495px"
            thirdRow.style.display = "grid";
            thirdRow.style.gridTemplateColumns = `repeat(1, px)`; // Single column for third row
            const singleSeat = document.createElement("div");
            singleSeat.classList.add("seater");
            singleSeat.textContent = `S${secondRowIndex - 2}`; // Label seat as "S" for Seater
            toggleSeatSelection(singleSeat); // Attach event listener
            thirdRow.appendChild(singleSeat);
            lowerSeatAlignment.appendChild(thirdRow);


            let fourthRowIndex = 3;
            // Render the fourth row of 12 Seater seats
            const fourthRow = document.createElement("div");
            fourthRow.style.display = "grid";
            fourthRow.style.gridTemplateColumns = `repeat(12, 45px)`; // 12 columns for fourth row
            for (let col = 0; col < 12; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              if (col === 11) {
                seat.textContent = "S" + 37;
                toggleSeatSelection(seat); // Attach event listener
                fourthRow.appendChild(seat);
              } else {
                seat.textContent = `S${fourthRowIndex}`; // Label seat as "S" for Seater
                toggleSeatSelection(seat); // Attach event listener
                fourthRow.appendChild(seat);
                fourthRowIndex += 3;
              }
            }
            lowerSeatAlignment.appendChild(fourthRow);

            // Render Upper Deck (Column-First)
            for (let row = 0; row < upperDeckRows; row++) {
              for (let col = 0; col < columns; col++) {
                const seatIndex = lowerDeckSeats + col * upperDeckRows + row; // Offset by lowerDeckSeats
                if (seatIndex >= totalSeats) break;

                const seat = document.createElement("div");
                seat.classList.add("seat");
                seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;
                toggleSeatSelection(seat); // Attach event listener
                upperSeatAlignment.appendChild(seat);
              }
            }
          }
          else if (totalSeats === 46) {
            const lowerDeckRows = 4; // 4 rows in the lower deck
            const upperDeckRows = 3; // 3 rows in the upper deck
            const lowerDeckSeats = 31; // 10 + 10 + 1 + 10 seats in the lower deck
            const upperDeckSeats = 15; // Remaining seats in the upper deck
            const columns = 5; // 6 columns per row

            // Dynamic grid alignment
            lowerSeatAlignment.style.display = "grid";
            lowerSeatAlignment.style.gridTemplateRows = `38px 38px 38px`
            upperSeatAlignment.style.display = "grid";
            upperSeatAlignment.style.gridTemplateColumns = `repeat(5, 103px)`; // 6 columns for upper deck rows

            let firstRowIndex = 1;

            // Render the first row of 12 Seater seats
            const firstRow = document.createElement("div");
            firstRow.style.display = "grid";
            firstRow.style.gridTemplateColumns = `repeat(10, 55px)`; // 12 columns for first row
            for (let col = 0; col < 10; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${firstRowIndex}`; // Label seat as "S" for Seater
              toggleSeatSelection(seat); // Attach event listener
              firstRow.appendChild(seat);
              firstRowIndex += 3;
            }
            lowerSeatAlignment.appendChild(firstRow);



            let secondRowIndex = 2;
            // Render the second row of 12 Seater seats
            const secondRow = document.createElement("div");
            secondRow.style.display = "grid";
            secondRow.style.gridTemplateColumns = `repeat(12, 55px)`; // 12 columns for second row
            for (let col = 0; col < 10; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              seat.textContent = `S${secondRowIndex}`; // Label seat as "S" for Seater
              toggleSeatSelection(seat); // Attach event listener
              secondRow.appendChild(seat);
              secondRowIndex += 3;
            }
            lowerSeatAlignment.appendChild(secondRow);

            // Render the third row with 1 Seater seat
            const thirdRow = document.createElement("div");
            thirdRow.style.marginLeft = "495px"
            thirdRow.style.display = "grid";
            thirdRow.style.gridTemplateColumns = `repeat(1, px)`; // Single column for third row
            const singleSeat = document.createElement("div");
            singleSeat.classList.add("seater");
            singleSeat.textContent = `S${secondRowIndex - 2}`; // Label seat as "S" for Seater
            toggleSeatSelection(singleSeat); // Attach event listener
            thirdRow.appendChild(singleSeat);
            lowerSeatAlignment.appendChild(thirdRow);


            let fourthRowIndex = 3;
            // Render the fourth row of 12 Seater seats
            const fourthRow = document.createElement("div");
            fourthRow.style.display = "grid";
            fourthRow.style.gridTemplateColumns = `repeat(12, 55px)`; // 12 columns for fourth row
            for (let col = 0; col < 10; col++) {
              const seat = document.createElement("div");
              seat.classList.add("seater");
              if (col === 9) {
                seat.textContent = "S" + 31;
                toggleSeatSelection(seat); // Attach event listener
                fourthRow.appendChild(seat);
              } else {
                seat.textContent = `S${fourthRowIndex}`; // Label seat as "S" for Seater
                toggleSeatSelection(seat); // Attach event listener
                fourthRow.appendChild(seat);
                fourthRowIndex += 3;
              }
            }
            lowerSeatAlignment.appendChild(fourthRow);

            // Render Upper Deck (Column-First)
            for (let row = 0; row < upperDeckRows; row++) {
              for (let col = 0; col < columns; col++) {
                const seatIndex = lowerDeckSeats + col * upperDeckRows + row; // Offset by lowerDeckSeats
                if (seatIndex >= totalSeats) break;

                const seat = document.createElement("div");
                seat.classList.add("seat");
                toggleSeatSelection(seat); // Attach event listener
                seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;
                upperSeatAlignment.appendChild(seat);
              }
            }
          }

        }
        else {
          const rows = 3; // Fixed number of rows
          const columns = Math.ceil(totalSeats / (2 * rows)); // Columns for both decks
          const lowerDeckSeats = Math.floor(totalSeats / 2);
          const upperDeckSeats = totalSeats - lowerDeckSeats;
          lowerSeatAlignment.style.gridTemplateColumns = `repeat(6, 80px)`;

          lowerSeatAlignment.style.gridTemplateRows = `40px 85px 50px`
          // Dynamic grid alignment
          if (totalSeats === 30) {
            lowerSeatAlignment.style.gridTemplateRows = `40px 85px 50px`
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
              toggleSeatSelection(seat); // Attach event listener
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
              toggleSeatSelection(seat); // Attach event listener
              upperSeatAlignment.appendChild(seat);
            }
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
