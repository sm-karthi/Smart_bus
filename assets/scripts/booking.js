// Handle left arrow
document.getElementById("leftArrow").addEventListener("click", () => {
    window.location.href = "../pages/home.html";
})

document.addEventListener("DOMContentLoaded", () => {
    // Function to retrieve booked tickets from localStorage
    function getBookedTickets() {
        const tickets = JSON.parse(localStorage.getItem("bookedTickets")) || [];
        console.log("Retrieved booked tickets:", tickets);
        return tickets;
    }

    // Function to display tickets on the page
    function displayBookedTickets(tickets) {
        const upcomingContainer = document.getElementById("upcomingTickets");
        const pastContainer = document.getElementById("pastTickets");

        if (tickets.length === 0) {
            const noTicketsMessage = document.createElement("h3");
            noTicketsMessage.textContent = "No tickets booked yet.";
            noTicketsMessage.style.color = "red";
            document.body.appendChild(noTicketsMessage);
        } else {
            const now = new Date(); // Current date and time
            let upcomingIndex = 1; // Counter for upcoming tickets
            let pastIndex = 1; // Counter for past tickets

            tickets.forEach((ticket) => {
                const ticketDiv = document.createElement("div");
                ticketDiv.classList.add("ticket-container");

                // Combine date and time for comparison
                const departureDateTime = combineDateAndTime(ticket.departureDate, ticket.departureTime);

                // Determine ticket type (upcoming or past) and assign index
                let ticketIndex;
                let container;
                if (departureDateTime > now) {
                    ticketIndex = upcomingIndex++;
                    container = upcomingContainer;
                } else {
                    ticketIndex = pastIndex++;
                    container = pastContainer;
                }

                // Create ticket title
                const ticketTitle = document.createElement("h3");
                ticketTitle.textContent = `Ticket ${ticketIndex}`;
                ticketTitle.classList.add("ticket-title");

                // Other ticket details
                const busName = document.createElement("h2");
                busName.classList.add("bus-name");
                busName.innerHTML = `${ticket.busName}`;

                const boardingPoint = document.createElement("p");
                boardingPoint.innerHTML = `<strong>Boarding Point:</strong> ${ticket.boardingPoint}`;

                const droppingPoint = document.createElement("p");
                droppingPoint.innerHTML = `<strong>Dropping Point:</strong> ${ticket.droppingPoint}`;

                const departureDate = document.createElement("p");
                departureDate.innerHTML = `<strong>Date:</strong> ${formatDateToDDMMYYYY(ticket.departureDate)}`;

                const selectedSeats = document.createElement("p");
                let selectedSeatsForDisplay = ticket.selectedSeats.map(seat => {
                    if (seat.includes("f")) {
                      // Remove the 'f' from the seat number
                      return seat.slice(0, -1);
                    }
                    if (seat.includes("o")) {
                      // Remove the 'f' from the seat number
                      return seat.slice(0, -1);
                    }
                    return seat;
                  });
                selectedSeats.innerHTML = `<strong>Selected Seats:</strong> ${Array.isArray(selectedSeatsForDisplay) ? selectedSeatsForDisplay.join(", ") : selectedSeatsForDisplay
                    }`;

                const passengerDetails = document.createElement("div");
                passengerDetails.innerHTML = `<strong>Passenger Details:</strong>`;
                passengerDetails.style.marginTop = "10px";

                if (ticket.passengerDetails.length > 0) {
                    const passengerList = document.createElement("ul");
                    ticket.passengerDetails.forEach((passenger) => {
                        const abbreviatedGender =
                            passenger.gender === "Male" ? "M" :
                                passenger.gender === "Female" ? "F" :
                                    passenger.gender === "Other" ? "O" : passenger.gender;
                        const passengerItem = document.createElement("li");
                        passengerItem.textContent = `${passenger.name} (${passenger.age}, ${abbreviatedGender})`;
                        passengerList.appendChild(passengerItem);
                    });
                    passengerDetails.appendChild(passengerList);
                } else {
                    passengerDetails.textContent += " None";
                }

                // Append all elements to the ticket div
                ticketDiv.appendChild(ticketTitle);
                ticketDiv.appendChild(busName);
                ticketDiv.appendChild(boardingPoint);
                ticketDiv.appendChild(droppingPoint);
                ticketDiv.appendChild(departureDate);
                ticketDiv.appendChild(selectedSeats);
                ticketDiv.appendChild(passengerDetails);

                // Append ticket div to the respective container
                container.appendChild(ticketDiv);
            });
        }
    }

    // Helper function to format date
    function formatDateToDDMMYYYY(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Helper function to combine date and time into a valid Date object
    function combineDateAndTime(date, time) {
        if (!time || !date) {
            console.error("Invalid date or time:", date, time);
            return new Date(); // Return current date if invalid
        }

        // Check if time is in the expected format "HH:mm"
        const timeParts = time.split(":");
        if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
            console.error("Invalid time format:", time);
            return new Date(); // Return current date if invalid time format
        }

        const [hours, minutes] = timeParts;

        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(hours);
        combinedDateTime.setMinutes(minutes);
        combinedDateTime.setSeconds(0);
        return combinedDateTime;
    }

    // Get tickets from localStorage and display them
    const tickets = getBookedTickets();
    displayBookedTickets(tickets);
});
