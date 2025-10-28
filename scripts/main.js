// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// 🌈 Smooth gradient background animation
const colors = [
  "#ff9a9e",
  "#fad0c4",
  "#a1c4fd",
  "#c2e9fb",
  "#fbc2eb",
  "#a6c1ee",
  "#d4fc79",
  "#96e6a1"
];
let step = 0;
const gradientSpeed = 0.0015;

function updateGradient() {
  const c0 = colors[Math.floor(step) % colors.length];
  const c1 = colors[(Math.floor(step) + 1) % colors.length];
  document.body.style.background = `linear-gradient(120deg, ${c0}, ${c1})`;
  step += gradientSpeed;
  requestAnimationFrame(updateGradient);
}
requestAnimationFrame(updateGradient);

// 📝 Optional: dynamically load list of writing posts
fetch("https://api.github.com/repos/sangati-shah/writing/contents/posts")
  .then(res => res.json())
  .then(files => {
    const list = document.getElementById("postList");
    if (!list) return;
    files
      .filter(f => f.name.endsWith(".md"))
      .forEach(f => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="writing.html?file=${f.name}">${f.name.replace(".md","")}</a>`;
        list.appendChild(li);
      });
  })
  .catch(console.error);
