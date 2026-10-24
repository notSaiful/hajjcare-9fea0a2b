# SEO

Crawlers that do not run JavaScript used to see only the word "Loading..." in `index.html`. The root document now includes a real title, description, canonical URL, Open Graph image, and Twitter large-image card. `src/components/SEO.tsx` sets the same tags per route. `RouteFallbackSEO` covers routes that do not render their own tags, and adds `noindex` on auth, error, admin, and unknown paths. `/inspector-directory` stays indexable because the private prefix match is segment-aware (`/inspector` does not match `/inspector-directory`).

`public/robots.txt` disallows `/admin`, `/auth`, and `/error` (plus other signed-in areas). `public/sitemap.xml` is generated from `src/seo/routes.json` by `scripts/generate-sitemap.mjs`. Auth and admin URLs are not in the sitemap. Duplicate paths redirect to one canonical URL (`/food` to `/food-guide`, `/counter` to `/tawaf-counter`, `/open` to `/share`, `/mina-tent-locations` to `/mina-tents`, `/inspector-register` to `/haj-inspector-register`, `/lost` to `/return-to-camp`, `/login` to `/auth`).

## Prerender

`npm run build` runs Vite, then `scripts/prerender-routes.mjs`. The script copies `dist/index.html` to `dist/<route>/index.html` and rewrites the title, description, canonical, and the visible loader sentence. It does not launch a browser, so it does not change the Lovable Vite build.

Lovable's SPA fallback may still serve the root `index.html` for every path. In that case only the home document is what a non-JS crawler sees, and it is no longer "Loading...". A host that serves the prerendered files (static `path/index.html`) gets a unique head per public route. A full Puppeteer prerender is a later option if the host ignores those files and per-route HTML is required; it is not part of this build because it is brittle inside Lovable.
