async function loadWritingList() {
  try {
    const response = await fetch("assets/writing/manifest.json");
    const writings = await response.json();

    const listContainer = document.getElementById("writing-list");

    writings
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
      .forEach((item) => {
        const entry = document.createElement("div");
        entry.classList.add("writing-entry");

        const link = document.createElement("a");
        link.href = item.path;
        link.textContent = item.title;

        const date = document.createElement("span");
        date.classList.add("writing-date");
        date.textContent = new Date(item.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        entry.appendChild(link);
        entry.appendChild(date);
        listContainer.appendChild(entry);
      });
  } catch (error) {
    console.error("Error loading writing list:", error);
  }
}

loadWritingList();
