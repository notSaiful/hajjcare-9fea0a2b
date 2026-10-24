import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(readFileSync(join(root, "src/seo/routes.json"), "utf8"));
const lastmod = "2026-10-24";
const urls = routes
  .map((route) => {
    const loc = `https://hajjcare.in${route.path === "/" ? "/" : route.path}`;
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Wrote ${routes.length} sitemap URLs`);
