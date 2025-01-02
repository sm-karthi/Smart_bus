/* // Get the tick container
const tickContainer = document.getElementById("tickContainer");

// Function to show and hide the tick animation
function showTickAnimation() {
  // Display the tick container
  tickContainer.style.display = "flex";
  tickContainer.classList.remove("hidden");

  // Hide the tick container after 3 seconds
  setTimeout(() => {
    tickContainer.style.display = "none";
    tickContainer.classList.add("hidden");
  }, 3000); // 3 seconds
}

// Check if the animation should be shown
document.addEventListener("DOMContentLoaded", () => {
  const isPageReload = performance.navigation.type === performance.navigation.TYPE_RELOAD;

  if (!isPageReload) {
    // If it's not a reload, show the tick animation
    showTickAnimation();
  }
}); */


