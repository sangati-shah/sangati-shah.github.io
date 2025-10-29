// // Update footer year
// document.getElementById("year").textContent = new Date().getFullYear();

// // 🌈 Smooth ambient gradient background
// const colors = [
//   "#ff9a9e",
//   "#fad0c4",
//   "#a1c4fd",
//   "#c2e9fb",
//   "#fbc2eb",
//   "#a6c1ee",
//   "#d4fc79",
//   "#96e6a1"
// ];
// let step = 0;
// const gradientSpeed = 0.0015;

// function updateGradient() {
//   const c0 = colors[Math.floor(step) % colors.length];
//   const c1 = colors[(Math.floor(step) + 1) % colors.length];
//   document.body.style.background = `linear-gradient(120deg, ${c0}, ${c1})`;
//   step += gradientSpeed;
//   requestAnimationFrame(updateGradient);
// }
// requestAnimationFrame(updateGradient);
const dateDisplayElement = document.getElementById("currentDateDisplay");
const currentDate = new Date();
const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
  .toLocaleDateString("en-GB", options)
dateDisplayElement.innerHTML = formattedDate;