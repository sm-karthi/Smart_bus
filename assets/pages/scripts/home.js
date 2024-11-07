const arrow = document.querySelector(".stack");
const from_input = document.getElementById("from");
const to_input = document.getElementById("to");

arrow.addEventListener("click", () => {
    const temp = from_input.value;
    from_input.value = to_input.value;
    to_input.value = temp;
});


// Retrieve the username from localStorage
let userName = localStorage.getItem("username");

const profile = document.getElementById("profile");

profile.addEventListener("click", (e) => {
    // Prevent the event from propagating to the document click handler
    e.stopPropagation();

    // Check if the profileContainer already exists
    let profileContainer = document.getElementById("profileContainer");

    if (!profileContainer) {
        // Create a new div to serve as the container if it doesn't exist
        profileContainer = document.createElement("div");
        profileContainer.setAttribute("id", "profileContainer");
        profileContainer.classList.add("profileManage");

        // Display the username in the container
        profileContainer.innerText = userName ? `Hello, ${userName}!` : "No username found. Please sign up.";

        // Append the container to the body (or to another element if desired)
        document.body.appendChild(profileContainer);
    } else {
        // Toggle visibility by adding/removing the "h" class
        profileContainer.classList.toggle("h");
    }
});

// Close the profile container if clicking anywhere outside of it
document.addEventListener("click", (e) => {
    let profileContainer = document.getElementById("profileContainer");
    if (profileContainer && !profileContainer.contains(e.target) && e.target !== profile) {
        profileContainer.classList.add("h"); // Hide the profile container
    }
});




