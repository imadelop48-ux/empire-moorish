
const fs = require("fs");
const path = require("path");
const { ARTICLES } = require("./articles.js");

const BASE_URL = "https://imadelop48-ux.github.io/empire-moorish";
const OUTPUT_DIR = path.join(__dirname, "articles");

if (!Array.isArray(ARTICLES)) {
    throw new Error("ARTICLES data was not loaded correctly.");
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function escapeHTML(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function absoluteImageUrl(image) {
    return `${BASE_URL}/${String(image).replace(/^\/+/, "")}`;
}

function createArticlePage(article) {
    const title = escapeHTML(article.title);
    const category = escapeHTML(article.category);
    const date = escapeHTML(article.date);
    const image = escapeHTML("../" + article.image);
    const canonical = `${BASE_URL}/articles/${article.id}.html`;

    const paragraphs = (article.content || [])
        .map(paragraph => `<p>${escapeHTML(paragraph)}</p>`)
        .join("\n");

    const description = escapeHTML(
        article.excerpt || article.title
    );

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt || article.title,
        "image": [absoluteImageUrl(article.image)],
        "datePublished": new Date(article.date).toISOString(),
        "articleSection": article.category,
        "articleBody": (article.content || []).join("\n\n"),
        "mainEntityOfPage": canonical,
        "author": {
            "@type": "Organization",
            "name": "Empire Moorish"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Empire Moorish"
        }
    };

    const jsonLD = JSON.stringify(structuredData)
        .replace(/</g, "\\u003c");

    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${title} | Empire Moorish</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">

    <link rel="canonical" href="${canonical}">
    <link rel="stylesheet" href="../style.css">

    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Empire Moorish">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${absoluteImageUrl(article.image)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${absoluteImageUrl(article.image)}">

    <script type="application/ld+json">${jsonLD}</script>
</head>

<body>
    <header>
        <h1>EMPIRE MOORISH</h1>
        <p>Moroccan History, Imperial Dynasties & Architectural Heritage</p>
    </header>

    <nav>
        <a href="../index.html">Home</a>
        <a href="../quiz.html">History Quiz</a>
    </nav>

    <main class="container">
        <article class="article-single">
            <span class="cat-tag">${category}</span>

            <h1>${title}</h1>

            <div class="meta-line">
                Published on ${date}
            </div>

            <img src="${image}" alt="${title}">

            <div class="article-body">
                ${paragraphs}
            </div>

            ${
                article.gallery?.length
                ? `<section class="article-gallery">
                    ${article.gallery.map(item => `
                        <figure>
                            <img src="../${escapeHTML(item.src)}"
                                 alt="${escapeHTML(item.caption || article.title)}">
                            <figcaption>${escapeHTML(item.caption || "")}</figcaption>
                        </figure>
                    `).join("")}
                </section>`
                : ""
            }

            <a href="../index.html" class="btn-gold">
                ← Explore More Articles
            </a>
        </article>
    </main>

    <footer>
        <div class="copyright">
            © 2026 Empire Moorish · All Rights Reserved
        </div>
    </footer>
</body>
</html>`;
}

const urls = [];

for (const article of ARTICLES) {
    if (!article.id || !article.title || !Array.isArray(article.content)) {
        throw new Error(`Invalid article data: ${article.id || "unknown"}`);
    }

    const html = createArticlePage(article);
    const filePath = path.join(OUTPUT_DIR, `${article.id}.html`);

    fs.writeFileSync(filePath, html, "utf8");

    urls.push(`${BASE_URL}/articles/${article.id}.html`);

    console.log(`Generated: ${article.id}.html`);
}

const sitemapEntries = urls.map(url => `
    <url>
        <loc>${escapeHTML(url)}</loc>
    </url>`).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}/</loc>
    </url>
    ${sitemapEntries}
</urlset>`;

fs.writeFileSync(
    path.join(__dirname, "sitemap.xml"),
    sitemap,
    "utf8"
);

console.log(`Successfully generated ${ARTICLES.length} article pages.`);
console.log("Sitemap updated.");
