const heightOutput = document.querySelector("#height");
const widthOutput = document.querySelector("#width");

function updateSize() {
    heightOutput.textContent = window.innerHeight;
    widthOutput.textContent = window.innerWidth;
}

updateSize();
window.addEventListener("resize", updateSize);