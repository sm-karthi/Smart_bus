const arrow = document.querySelector(".stack");
const from_input = document.getElementById("from");
const to_input = document.getElementById("to");

arrow.addEventListener("click", () => {
    const temp = from_input.value;
    from_input.value = to_input.value;
    to_input.value = temp;
});