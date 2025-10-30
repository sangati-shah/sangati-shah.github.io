const dateDisplayElement = document.getElementById("currentDateDisplay");
const currentDate = new Date();
const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
  .toLocaleDateString("en-GB", options)
dateDisplayElement.innerHTML = formattedDate;