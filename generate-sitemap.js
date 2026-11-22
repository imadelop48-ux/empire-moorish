
const fs = require("fs");
const path = require("path");
const { ARTICLES } = require("./articles.js");

const BASE = "https://imadelop48-ux.github.io/empire-moorish";

const staticPages = [
    "",
    "quiz.html",
    "archive.html",
    "idrissids.html",
    "almoravids.html",
    "almohads.html",
    "alaouites.html"
];

// Add only pages that actually exist.
const urls = staticPages
    .filter(page => fs.existsSync(path.join(__dirname, page || "index.html")))
    .map(page => `${BASE}/${page}`);

for (const article of ARTICLES) {
    const file = path.join(
        __dirname,
        "articles",
        `${article.id}.html`
    );

    if (fs.existsSync(file)) {
        urls.push(`${BASE}/articles/${article.id}.html`);
    }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

fs.writeFileSync(
    path.join(__dirname, "sitemap.xml"),
    xml,
    "utf8"
);

console.log(`Sitemap created with ${urls.length} URLs.`);

const fs = require("fs");
const path = require("path");
const { ARTICLES } = require("./articles.js");

const BASE = "https://imadelop48-ux.github.io/empire-moorish";

const staticPages = [
    "",
    "quiz.html",
    "archive.html",
    "idrissids.html",
    "almoravids.html",
    "almohads.html",
    "alaouites.html"
];

// Add only pages that actually exist.
const urls = staticPages
    .filter(page => fs.existsSync(path.join(__dirname, page || "index.html")))
    .map(page => `${BASE}/${page}`);

for (const article of ARTICLES) {
    const file = path.join(
        __dirname,
        "articles",
        `${article.id}.html`
    );

    if (fs.existsSync(file)) {
        urls.push(`${BASE}/articles/${article.id}.html`);
    }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

fs.writeFileSync(
    path.join(__dirname, "sitemap.xml"),
    xml,
    "utf8"
);

console.log(`Sitemap created with ${urls.length} URLs.`);
