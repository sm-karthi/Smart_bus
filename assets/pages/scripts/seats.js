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

      const headingDiv = document.createElement("div");
      headingDiv.id = "headingDiv";


      const headings = document.createElement("h3");
      headings.id = "headings";
      headings.textContent = "Select boarding and dropping point";
      infoDiv.appendChild(headings);

      const firstLine = document.createElement("div");
      firstLine.id = "firstLine";
      infoDiv.appendChild(firstLine);

      const headingsContainer = document.createElement("div");
      headingsContainer.id = "headingsContainer";
      infoDiv.appendChild(headingsContainer);

      const underline = document.createElement("div");
      underline.id = "underLine";
      infoDiv.appendChild(underline);



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


      infoDiv.appendChild(headingDiv);

      const pointsContainer = document.createElement("div");
      pointsContainer.id = "pointsContainer"
      infoDiv.appendChild(pointsContainer);

      const amountDisplay = document.createElement("div");
      amountDisplay.id = "amountDisplay";
      amountDisplay.textContent = `Total Amount: ₹0`;
      infoDiv.appendChild(amountDisplay);

      let selectedBoardingPoint = null;
      let selectedDroppingPoint = null;
      let selectedSeats = []; // Array to store selected seat numbers

      const updateAmount = () => {
        const totalAmount = selectedSeats.length * amount;
        amountDisplay.textContent = `Total Amount: ₹${totalAmount}`;
      };

      const updateView = (type) => {
        pointsContainer.innerHTML = "";

        const points = type === "boarding" ? boardingPoints : droppingPoints;
        points.forEach((point) => {
          const pointDiv = document.createElement("div");
          pointDiv.classList.add("pointDiv");
          pointDiv.textContent = point;

          if (type === "boarding" && point === selectedBoardingPoint) {
            pointDiv.classList.add("selected");
          } else if (type === "dropping" && point === selectedDroppingPoint) {
            pointDiv.classList.add("selected");
          }

          pointDiv.addEventListener("click", () => {
            const selectedPointDiv = document.querySelector(".pointDiv.selected");
            if (selectedPointDiv) {
              selectedPointDiv.classList.remove("selected");
            }

            pointDiv.classList.add("selected");

            if (type === "boarding") {
              selectedBoardingPoint = point;
              updateView("dropping");
            } else {
              selectedDroppingPoint = point;

              // Hide the headings and underline, show the final section
              headings.style.display = "none";
              headingsContainer.style.display = "none";
              underline.style.display = "none";
              firstLine.style.display = "none";
              amountDisplay.style.display = "none";

              // Display final details without calling updateAmount
              displayFinalDetails();
            }
          });

          pointsContainer.appendChild(pointDiv);
        });

        underline.style.transform =
          type === "boarding" ? "translateX(0%)" : "translateX(135%)";
      };

      const displayFinalDetails = () => {
        const finalDetailsContainer = document.createElement("div");
        finalDetailsContainer.id = "finalDetails";

        // Add heading to final section
        const finalHeading = document.createElement("h3");
        finalHeading.textContent = "Boarding & Dropping";
        finalHeading.id = "headingForFinal";
        finalDetailsContainer.appendChild(finalHeading);

        const boardingDisplay = document.createElement("p");
        boardingDisplay.textContent = `${selectedBoardingPoint}`;
        boardingDisplay.id = "finalBoarding";
        finalDetailsContainer.appendChild(boardingDisplay);

        const droppingDisplay = document.createElement("p");
        droppingDisplay.textContent = `${selectedDroppingPoint}`;
        droppingDisplay.id = "finalDropping";
        finalDetailsContainer.appendChild(droppingDisplay);

        // Display selected seats
        const seatsDisplay = document.createElement("p");
        seatsDisplay.id = "finalSeatNo";
        seatsDisplay.textContent = `Seat No: ${selectedSeats.join(", ")}`; // Display all selected seats
        finalDetailsContainer.appendChild(seatsDisplay);

        // Manually calculate the total amount
        const totalAmount = selectedSeats.length * amount;
        const totalAmountDisplay = document.createElement("p");
        totalAmountDisplay.id = "finalAmount";
        totalAmountDisplay.textContent = `Total Amount: ₹${totalAmount}`;
        finalDetailsContainer.appendChild(totalAmountDisplay);

        // Add Change option
        const changeButton = document.createElement("button");
        changeButton.textContent = "Change";
        changeButton.id = "changeButton";
        finalDetailsContainer.appendChild(changeButton);

        const confirmButton = document.createElement("button");
        confirmButton.textContent = "PROCEED TO BOOK";
        confirmButton.id = "confirmButton";
        finalDetailsContainer.appendChild(confirmButton);

        // Add event listener to change the boarding point
        changeButton.addEventListener("click", () => {
          // Show the headings and underline again
          headings.style.display = "block";
          headingsContainer.style.display = "block";
          underline.style.display = "block";
          firstLine.style.display = "block";
          amountDisplay.style.display = "block";

          headingsContainer.style.display = "flex";
          headingsContainer.style.justifyContent = "space around";

          // Reset the final section
          pointsContainer.innerHTML = "";

          // Reinitialize boarding point selection and automatically select the previously selected boarding point
          updateView("boarding");

          // Select the previously selected boarding point
          const selectedBoardingDiv = document.querySelectorAll(".pointDiv");
          selectedBoardingDiv.forEach((div) => {
            if (div.textContent === selectedBoardingPoint) {
              div.classList.add("selected");
            }
          });
        });

        // Replace existing points container with final details
        pointsContainer.innerHTML = "";
        pointsContainer.appendChild(finalDetailsContainer);

        // Add functionality to confirm button
        confirmButton.addEventListener("click", () => {


          // Create the form dynamically based on the selected seats
          const formContainer = document.createElement("div");
          formContainer.id = "formContainer";


          // Create an overlay for passenger details
          const overlay = document.createElement("div");
          overlay.id = "overlay";
          overlay.classList.add("overlay");
          document.body.appendChild(overlay);

          // Create a container for passenger forms
          const formContainerInner = document.createElement("div");
          formContainerInner.id = "formContainerInner";

          const passengerDetailsHeading = document.createElement("h2");
          passengerDetailsHeading.textContent = "Passenger Details";
          passengerDetailsHeading.id = "headingForPassengerDiv"
          formContainer.appendChild(passengerDetailsHeading)

          // Add an "X" button to close the form
          const closeButton = document.createElement("button");
          closeButton.textContent = "X";
          closeButton.classList.add("closeButton");
          formContainer.appendChild(closeButton);

          formContainerInner.appendChild(formContainer);

          // Create a form for each selected seat
          selectedSeats.forEach((seat, index) => {
            const seatForm = document.createElement("form");
            seatForm.classList.add("seatForm");

            // Create a label and input for name
            const countOfPassenger = document.createElement("div");
            countOfPassenger.textContent = `Passenger ${index + 1} | Seat ${seat}`;
            countOfPassenger.id = "countOfPassenger"
            seatForm.appendChild(countOfPassenger);


            const nameLabel = document.createElement("label");
            nameLabel.textContent = "Name"; // Updated label format
            seatForm.appendChild(nameLabel);
            const nameInput = document.createElement("input");
            nameInput.id = "passengerNameInput"
            nameInput.autocomplete = "off";
            nameInput.type = "text";
            nameInput.placeholder = "Enter Name";
            const nameError = document.createElement("span");
            nameError.id = "nameError";
            seatForm.appendChild(nameInput);
            seatForm.appendChild(nameError);


            // Create a label and input for age
            const ageLabel = document.createElement("label");
            ageLabel.textContent = `Age`;
            seatForm.appendChild(ageLabel);
            const ageInput = document.createElement("input");
            ageInput.id = "passengerAgeInput"
            ageInput.autocomplete = "off";
            ageInput.type = "number";
            ageInput.placeholder = "Enter Age";
            const AgeError = document.createElement("span");
            AgeError.id = "ageError";
            seatForm.appendChild(ageInput);
            seatForm.appendChild(AgeError);


            // Create a label and input for gender
            const genderLabel = document.createElement("label");
            genderLabel.textContent = `Gender`;
            seatForm.appendChild(genderLabel);
            const genderSelect = document.createElement("select");
            const maleOption = document.createElement("option");
            maleOption.value = "Male";
            maleOption.textContent = "Male";
            const femaleOption = document.createElement("option");
            femaleOption.value = "Female";
            femaleOption.textContent = "Female";

            genderSelect.appendChild(maleOption);
            genderSelect.appendChild(femaleOption);
            seatForm.appendChild(genderSelect);

            formContainerInner.appendChild(seatForm);
          });

          // Add email and contact fields after seat forms
          const emailLabel = document.createElement("label");
          emailLabel.textContent = "Email";
          emailLabel.id = "emailLabel"
          formContainerInner.appendChild(emailLabel);
          const emailInput = document.createElement("input");
          emailInput.id = "emailInput";
          emailInput.autocomplete = "off";
          emailInput.type = "email";
          emailInput.placeholder = "Enter email";
          const emailError = document.createElement("span");
          emailError.id = "emailError";
          formContainerInner.appendChild(emailInput);
          formContainerInner.appendChild(emailError);


          const contactDiv = document.createElement("div");
          contactDiv.id = "contactDiv";
          const contactLabel = document.createElement("label");
          contactLabel.textContent = "Contact Number";
          contactDiv.appendChild(contactLabel);
          const contactInput = document.createElement("input");
          contactInput.id = "contact"
          contactInput.autocomplete = "off";
          contactInput.type = "tel";
          contactInput.placeholder = "Enter contact number";
          const contactError = document.createElement("span");
          contactError.id = "contactError";
          contactDiv.appendChild(contactInput);
          contactDiv.appendChild(contactError);

          formContainerInner.appendChild(contactDiv)

          const payButtonDiv = document.createElement("div");
          payButtonDiv.id = "payButtonDiv";

          // Add total amount display section
          const totalAmountDisplayForm = document.createElement("div");
          totalAmountDisplayForm.id = "totalAmountDisplayForm";
          totalAmountDisplayForm.textContent = `Total Amount: ₹${selectedSeats.length * amount}`;
          payButtonDiv.appendChild(totalAmountDisplayForm);

          const payButton = document.createElement("button");
          payButton.id = "payButton";
          payButton.textContent = "PROCEED TO PAY";
          payButtonDiv.appendChild(payButton);






          formContainerInner.appendChild(payButtonDiv);

          // Append the form container to the body
          document.body.appendChild(formContainerInner);

          // Hide the overlay and form when "X" button is clicked
          closeButton.addEventListener("click", () => {
            overlay.style.display = "none";
            formContainerInner.style.display = "none";
          });


          // Validate email format
          function validateEmail(email) {
            const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);
          }

          // Validate name format
          function validateName(name) {
            const namePattern = /^[a-zA-Z\s]+$/;
            return namePattern.test(name);
          }

          // Validate age format
          function validateAge(age) {
            const agePattern = /^(?:[1-9][0-9]?|100)$/; // Allows 1-100
            return agePattern.test(age);
          }

          const contactRegex = /^[6-9]\d{9}$/; // Indian mobile number format


          // Pay button click event for validation
          payButton.addEventListener("click", () => {


           
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll("#nameError").forEach((el) => (el.textContent = ""));
            document.querySelectorAll("#ageError").forEach((el) => (el.textContent = ""));
            emailError.textContent = "";
            contactError.textContent = "";

            // Validate each passenger's name
            document.querySelectorAll("#passengerNameInput").forEach((input, index) => {
              const error = document.querySelectorAll("#nameError")[index];
              if (!input.value.trim()) {
                error.textContent = "Name is required.";
                isValid = false;
              } else if (!validateName(input.value.trim())) {
                error.textContent = "Enter valid name.";
                isValid = false;
              }
            });

            // Validate each passenger's age
            document.querySelectorAll("#passengerAgeInput").forEach((input, index) => {
              const error = document.querySelectorAll("#ageError")[index];
              if (!input.value.trim()) {
                error.textContent = "Age is required.";
                isValid = false;
              } else if (!validateAge(input.value.trim())) {
                error.textContent = "Age must be between 1 and 100.";
                isValid = false;
              }
            });

            // Validate email
            if (!emailInput.value.trim()) {
              emailError.textContent = "Email is required.";
              isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
              emailError.textContent = "Enter a valid email.";
              isValid = false;
            }

            // Validate contact number
            if (!contactInput.value.trim()) {
              contactError.textContent = "Contact number is required.";
              isValid = false;
            }
            else if (!contactRegex.test(contactInput.value.trim())) {
              contactError.textContent = "Please enter a valid mobile number.";
              isValid = false;
            }

           

            // Proceed if all validations pass
            if (isValid) {
            
              // Redirect to the ticket page
              window.location.href = "../html/ticket.html";
            }
            });

        });
      };




      // Add event listeners for headings to toggle the views
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

      const toggleSeatSelection = (seat) => {
        seat.addEventListener("click", () => {
          if (seat.style.backgroundColor === "rgb(255, 118, 132)") {
            seat.style.backgroundColor = "";
            seat.style.color = "";
            selectedSeats = selectedSeats.filter(s => s !== seat.textContent); // Remove seat from array
            if (selectedSeats.length === 0) {
              // Add the 'show' class to display the profile container
              setTimeout(() => {
                infoDiv.classList.toggle("show");
              }, 10); // Ensure the animation starts after appending
            }
          } else {
            if (selectedSeats.length >= 6) {
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
              seat.style.backgroundColor = "rgb(255, 118, 132)";
              seat.style.color = "white";
              selectedSeats.push(seat.textContent); // Add seat to array
              infoDiv.classList.add("show");
            }
          }
          updateAmount();

          // Update the seat display in the final section
          const seatsDisplay = document.getElementById("finalSeatNo");
          seatsDisplay.textContent = `Seat No: ${selectedSeats.join(", ")}`;

          const totalAmount = selectedSeats.length * amount;
          const totalAmountDisplay = document.getElementById("finalAmount");
          totalAmountDisplay.textContent = `Total Amount: ₹${totalAmount}`;
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
          lowerSeatAlignment.style.gridTemplateRows = `40px 85px 50px`;

          let allSeatIndex = 1;

          // Render the first row with odd-numbered seats
          let seatIndex = 1; // Start with 1 for odd-numbered seats
          for (let col = 0; col < 12; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seater");
            seat.textContent = `S${seatIndex}`; // Odd-numbered seats

            // Check seat availability
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(135, 135, 135)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener with seat number
            lowerSeatAlignment.appendChild(seat);
            seatIndex += 2; // Increment by 2 for odd numbers
            allSeatIndex++;
          }

          // Render the second row with even-numbered seats
          seatIndex = 2; // Start with 2 for even-numbered seats
          for (let col = 0; col < 12; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seater");
            seat.textContent = `S${seatIndex}`; // Even-numbered seats

            // Check seat availability
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(135, 135, 135)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener with seat number
            lowerSeatAlignment.appendChild(seat);
            seatIndex += 2; // Increment by 2 for even numbers
            allSeatIndex++;
          }

          // Render the 3rd row of 6 Sleeper seats
          const thirdRowContainer = document.createElement("div");
          thirdRowContainer.style.display = "grid";
          thirdRowContainer.style.gridTemplateColumns = `repeat(6, 90px)`; // 6 columns for third row
          let singleSeatIndex = 0;
          for (let col = 0; col < columns; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.textContent = `L${singleSeatIndex + 1}`; // Label seat as "L" for Sleeper

            // Check seat availability for sleeper seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(135, 135, 135)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener with seat number
            thirdRowContainer.appendChild(seat);
            singleSeatIndex++;
            allSeatIndex++;
          }

          lowerSeatAlignment.appendChild(thirdRowContainer); // Append the third row container to the lower deck

          // Render Upper Deck (Column-First)
          for (let row = 0; row < upperDeckRows; row++) {
            for (let col = 0; col < columns; col++) {
              const seatIndex = lowerDeckSeats + col * upperDeckRows + row; // Offset by lowerDeckSeats
              if (seatIndex >= totalSeats) break;

              const seat = document.createElement("div");
              seat.classList.add("seat");
              seat.textContent = `U${seatIndex - lowerDeckSeats + 1}`;

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              toggleSeatSelection(seat); // Attach event listener with seat number
              upperSeatAlignment.appendChild(seat);
              allSeatIndex++;
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

          let allSeatIndex = 1;


          // Render the first row with odd-numbered seats
          let seatIndex = 1; // Start with 1 for odd-numbered seats
          for (let col = 0; col < 10; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seater");
            seat.textContent = `S${seatIndex}`; // Odd-numbered seats

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            lowerSeatAlignment.appendChild(seat);
            seatIndex += 2; // Increment by 2 for odd numbers
            allSeatIndex++;
          }

          // Render the second row with even-numbered seats
          seatIndex = 2; // Start with 2 for even-numbered seats
          for (let col = 0; col < 10; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seater");
            seat.textContent = `S${seatIndex}`; // Even-numbered seats

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            lowerSeatAlignment.appendChild(seat);
            seatIndex += 2; // Increment by 2 for even numbers
            allSeatIndex++;
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

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            thirdRowContainer.appendChild(seat);
            singleSeatIndex++;
            allSeatIndex++;
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

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              toggleSeatSelection(seat); // Attach event listener
              upperSeatAlignment.appendChild(seat);
              allSeatIndex++;
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

          let allSeatIndex = 1;

          let firstRowIndex = 1;

          // Render the first row of 12 Seater seats
          const firstRow = document.createElement("div");
          firstRow.style.display = "grid";
          firstRow.style.gridTemplateColumns = `repeat(12, 45px)`; // 12 columns for first row
          for (let col = 0; col < 12; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seater");
            seat.textContent = `S${firstRowIndex}`; // Label seat as "S" for Seater

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            firstRow.appendChild(seat);
            firstRowIndex += 3;
            allSeatIndex++;
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

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            secondRow.appendChild(seat);
            secondRowIndex += 3;
            allSeatIndex++;
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

          // Check seat availability for upper deck seats
          if (seatData[allSeatIndex] === false) {
            singleSeat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
            singleSeat.style.pointerEvents = "none"; // Disable click on unavailable seat
            singleSeat.textContent = "";
          }

          toggleSeatSelection(singleSeat); // Attach event listener
          thirdRow.appendChild(singleSeat);
          lowerSeatAlignment.appendChild(thirdRow);
          allSeatIndex++;


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

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              toggleSeatSelection(seat); // Attach event listener
              fourthRow.appendChild(seat);
              allSeatIndex++;
            } else {
              seat.textContent = `S${fourthRowIndex}`; // Label seat as "S" for Seater
              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }
              toggleSeatSelection(seat); // Attach event listener
              fourthRow.appendChild(seat);
              fourthRowIndex += 3;
              allSeatIndex++;
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

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              toggleSeatSelection(seat); // Attach event listener
              upperSeatAlignment.appendChild(seat);
              allSeatIndex++;
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

          let allSeatIndex = 1;

          let firstRowIndex = 1;

          // Render the first row of 12 Seater seats
          const firstRow = document.createElement("div");
          firstRow.style.display = "grid";
          firstRow.style.gridTemplateColumns = `repeat(10, 55px)`; // 12 columns for first row
          for (let col = 0; col < 10; col++) {
            const seat = document.createElement("div");
            seat.classList.add("seater");
            seat.textContent = `S${firstRowIndex}`; // Label seat as "S" for Seater

            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            firstRow.appendChild(seat);
            firstRowIndex += 3;
            allSeatIndex++;
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

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            secondRow.appendChild(seat);
            secondRowIndex += 3;
            allSeatIndex++;
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

          // Check seat availability for upper deck seats
          if (seatData[allSeatIndex] === false) {
            singleSeat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
            singleSeat.style.pointerEvents = "none"; // Disable click on unavailable seat
            singleSeat.textContent = "";
          }

          toggleSeatSelection(singleSeat); // Attach event listener
          thirdRow.appendChild(singleSeat);
          lowerSeatAlignment.appendChild(thirdRow);
          allSeatIndex++;


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

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              toggleSeatSelection(seat); // Attach event listener
              fourthRow.appendChild(seat);
              allSeatIndex++;
            } else {
              seat.textContent = `S${fourthRowIndex}`; // Label seat as "S" for Seater

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              toggleSeatSelection(seat); // Attach event listener
              fourthRow.appendChild(seat);
              fourthRowIndex += 3;
              allSeatIndex++;
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

              // Check seat availability for upper deck seats
              if (seatData[allSeatIndex] === false) {
                seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
                seat.style.pointerEvents = "none"; // Disable click on unavailable seat
                seat.textContent = "";
              }

              upperSeatAlignment.appendChild(seat);
              allSeatIndex++;
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

        let allSeatIndex = 1;

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

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            lowerSeatAlignment.appendChild(seat);
            allSeatIndex++;
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

            // Check seat availability for upper deck seats
            if (seatData[allSeatIndex] === false) {
              seat.style.backgroundColor = "rgb(171, 171, 171)"; // Gray color for unavailable seats
              seat.style.pointerEvents = "none"; // Disable click on unavailable seat
              seat.textContent = "";
            }

            toggleSeatSelection(seat); // Attach event listener
            upperSeatAlignment.appendChild(seat);
            allSeatIndex++;
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
