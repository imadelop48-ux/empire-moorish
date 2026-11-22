
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://imadelop48-ux.github.io/empire-moorish";

const rootDir = __dirname;
const articlesDir = path.join(rootDir, "articles");

const urls = [
    {
        loc: `${SITE_URL}/`,
        priority: "1.0"
    }
];

// Add existing static HTML pages from the root directory.
const excludedFiles = [
    "article.html"
];

const rootFiles = fs.readdirSync(rootDir);

for (const file of rootFiles) {
    if (
        file.endsWith(".html") &&
        file !== "index.html" &&
        !excludedFiles.includes(file)
    ) {
        urls.push({
            loc: `${SITE_URL}/${file}`,
            priority: "0.7"
        });
    }
}

// Add generated article pages.
if (fs.existsSync(articlesDir)) {
    const articleFiles = fs.readdirSync(articlesDir);

    for (const file of articleFiles) {
        if (file.endsWith(".html")) {
            urls.push({
                loc: `${SITE_URL}/articles/${file}`,
                priority: "0.8"
            });
        }
    }
}

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${today}</lastmod>
        <priority>${url.priority}</priority>
    </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(
    path.join(rootDir, "sitemap.xml"),
    sitemap,
    "utf8"
);

console.log(`Sitemap generated successfully with ${urls.length} URLs.`);

