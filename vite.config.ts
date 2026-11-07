import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { supabaseHttpsOrigin } from "./src/lib/supabaseOrigin";

/** Match vercel.json: demo at /, /explore, /library; React app for other extension-less routes. */
function demoRouting(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const raw = req.url || "/";
    const q = raw.indexOf("?");
    const pathOnly = q === -1 ? raw : raw.slice(0, q);
    const search = q === -1 ? "" : raw.slice(q);
    let nextPath = pathOnly;
    if (pathOnly === "/explore") nextPath = "/explore.html";
    else if (pathOnly === "/library") nextPath = "/library.html";
    else if (pathOnly === "/" || pathOnly === "/index.html") nextPath = "/index.html";
    else if (pathOnly === "/auth" || pathOnly === "/volunteer") nextPath = "/app.html";
    else if (!pathOnly.includes(".") && !pathOnly.startsWith("/@") && !pathOnly.startsWith("/src/") && !pathOnly.startsWith("/node_modules/")) {
      nextPath = "/index.html";
    }
    if (nextPath !== pathOnly) req.url = nextPath + search;
    next();
  };
  return {
    name: "hajcare-demo-routing",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

/** Preconnect the React shell to the Supabase origin from VITE_SUPABASE_URL. */
function supabasePreconnect(mode: string): Plugin {
  return {
    name: "hajcare-supabase-preconnect",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        if (!ctx.filename.endsWith(`${path.sep}app.html`) && !ctx.filename.endsWith("/app.html")) {
          return html;
        }
        const env = loadEnv(mode, process.cwd(), "VITE_");
        const origin = supabaseHttpsOrigin(env.VITE_SUPABASE_URL);
        if (!origin) return html;
        const anchor = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />';
        const tag = `    <link rel="preconnect" href="${origin}" crossorigin />`;
        if (!html.includes(anchor) || html.includes(tag)) return html;
        return html.replace(anchor, `${anchor}\n${tag}`);
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), demoRouting(), supabasePreconnect(mode), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // The public homepage is the static demo (public/index.html).
  // The existing React app is built from app.html and served for its routes.
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "app.html"),
    },
  },
}));
