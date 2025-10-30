// generate-sketches.js
const fs = require("fs");
const path = require("path");

const sketchesDir = path.resolve("assets/sketches");
const outputFile = path.resolve("sketches.html");

function getHtmlFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getHtmlFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

const htmlFiles = getHtmlFiles(sketchesDir);

const linksHtml = htmlFiles
  .map(file => {
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, "/");
    const displayName = path.basename(file, ".html").replace(/-/g, " ");
    return `<li><a href="${relativePath}" target="_blank">${displayName}</a></li>`;
  })
  .join("\n");

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sketches</title>
  <style>
    :root {
      --orange: #ff8c42;
      --magenta: #d6227e;
    }

    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 0;
      color: #222;
    }

    .nav {
      position: fixed;
      top: 0;
      width: 100%;
      padding: 1rem 2rem;
      z-index: 1000;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(45deg, var(--orange), var(--magenta));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    main {
      max-width: 700px;
      margin: 6rem auto 2rem; /* push content below fixed nav */
      padding: 0 1rem;
      line-height: 1.6;
    }

    h1 { text-align: center; margin-bottom: 2rem; }

    ul { list-style: none; padding: 0; }
    li { margin: 1rem 0; }
    a {
      font-size: 1.2rem;
      font-weight: 500;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      transition: text-decoration 0.2s ease;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-content">
        <a href="/"><div class="nav-logo">&lt;S /&gt;</div></a>
    </div>
  </nav>

  <main>
    <h1>Sketches</h1>
    <ul>
      ${linksHtml}
    </ul>
  </main>
</body>
</html>`;

fs.writeFileSync(outputFile, htmlTemplate);
console.log(`✅ Generated sketches.html with ${htmlFiles.length} sketches and navigation bar.`);
