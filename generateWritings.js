const fs = require("fs");
const path = require("path");

const writingDir = "./assets/writing";
const manifestPath = path.join(writingDir, "manifest.json");

const files = fs.readdirSync(writingDir)
  .filter(f => f.endsWith(".html"))
  .map(f => {
    const filePath = path.join(writingDir, f);
    const html = fs.readFileSync(filePath, "utf8");

    // Match title inside <h1 class="post-title">...</h1>
    const titleMatch = html.match(/<h1[^>]*class=["']post-title["'][^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].trim() : f.replace(".html", "");

    // Match date from <time datetime="YYYY-MM-DD">...</time>
    const dateMatch = html.match(/<time[^>]*datetime=["']([\d-]+)["'][^>]*>/i);
    const date = dateMatch ? dateMatch[1] : fs.statSync(filePath).mtime.toISOString().split("T")[0];

    return {
      title,
      date,
      path: `${writingDir}/${f}`,
    };
  });

// Sort newest first
files.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));
console.log(`✅ Manifest generated with ${files.length} entries at ${manifestPath}`);
