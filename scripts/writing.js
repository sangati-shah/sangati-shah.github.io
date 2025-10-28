// Get ?file=filename.md from URL
const params = new URLSearchParams(window.location.search);
const file = params.get("file");
const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");

if (!file) {
  titleEl.textContent = "Select a post to read";
  contentEl.style.opacity = 1;
} else {
  titleEl.textContent = file.replace(".md", "");

  fetch(`https://raw.githubusercontent.com/sangati-shah/writing/main/posts/${file}`)
    .then(res => res.text())
    .then(text => {
      contentEl.innerHTML = marked.parse(text);

      // Fade-in animation
      requestAnimationFrame(() => {
        contentEl.style.opacity = 1;
      });
    })
    .catch(() => {
      contentEl.textContent = "Error loading post.";
      contentEl.style.opacity = 1;
    });
}
