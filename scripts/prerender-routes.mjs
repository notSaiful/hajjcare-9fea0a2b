/**
 * Copy dist/index.html to each public route with that route's title,
 * description, canonical, and visible loader text.
 *
 * Lovable and many SPA hosts rewrite every path to the root index.html.
 * Those hosts still serve this root file, so crawlers that do not run JS
 * see the home title and description instead of "Loading...".
 * Hosts that serve path/index.html (Vercel static output, for example)
 * also get a unique head per route. This script does not launch a browser,
 * so it does not change how the Vite app boots.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(readFileSync(join(root, "src/seo/routes.json"), "utf8"));
const html = readFileSync(join(root, "dist/index.html"), "utf8");

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function replaceMeta(page, attr, key, value) {
  const pattern = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (pattern.test(page)) {
    return page.replace(pattern, `$1${escapeAttr(value)}$2`);
  }
  return page.replace("</head>", `    <meta ${attr}="${key}" content="${escapeAttr(value)}" />\n  </head>`);
}

function render(route) {
  const url = `https://hajjcare.in${route.path === "/" ? "/" : route.path}`;
  const title = route.title.includes("HajCare") ? route.title : `${route.title} — HajCare`;
  let page = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
  page = replaceMeta(page, "name", "description", route.description);
  page = replaceMeta(page, "property", "og:title", title);
  page = replaceMeta(page, "property", "og:description", route.description);
  page = replaceMeta(page, "property", "og:url", url);
  page = replaceMeta(page, "name", "twitter:title", title);
  page = replaceMeta(page, "name", "twitter:description", route.description);
  if (page.includes('rel="canonical"')) {
    page = page.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeAttr(url)}$2`);
  } else {
    page = page.replace("</head>", `    <link rel="canonical" href="${escapeAttr(url)}" />\n  </head>`);
  }
  page = page.replace(
    /<p class="app-loader-text">[^<]*<\/p>/,
    `<p class="app-loader-text">${escapeAttr(route.description)}</p>`,
  );
  return page;
}

for (const route of routes) {
  const page = render(route);
  if (route.path === "/") {
    writeFileSync(join(root, "dist/index.html"), page);
    continue;
  }
  const out = join(root, "dist", route.path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
}

console.log(`Prerendered ${routes.length} public routes`);
