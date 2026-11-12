import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { supabaseHttpsOrigin } from "./src/lib/supabaseOrigin";
import { assertTrainingProjectUrl } from "./src/training/project";
import { assertVolunteerProjectUrl } from "./src/volunteer/project";
import { trainingConfigSource } from "./src/training/publicKey";
import { trainingRegisterConfigSource } from "./src/training/registerKey";

/** Match vercel.json: demo at /, /explore, /library; React app for other extension-less routes. */
function demoRouting(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, res, next) => {
    const raw = req.url || "/";
    const q = raw.indexOf("?");
    const pathOnly = q === -1 ? raw : raw.slice(0, q);
    const search = q === -1 ? "" : raw.slice(q);
    let nextPath = pathOnly;
    if (pathOnly === "/training" || pathOnly === "/100-days" || pathOnly === "/100-day") {
      res.statusCode = 302;
      res.setHeader("Location", "/classroom");
      res.end();
      return;
    }
    if (pathOnly === "/explore") nextPath = "/explore.html";
    else if (pathOnly === "/library") nextPath = "/library.html";
    else if (pathOnly === "/visitors") nextPath = "/visitors.html";
    else if (pathOnly === "/" || pathOnly === "/index.html") nextPath = "/index.html";
    else if (pathOnly === "/auth" || pathOnly === "/volunteer" || pathOnly === "/volunteer/training" || pathOnly === "/service-fee" || pathOnly === "/classroom") nextPath = "/app.html";
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

/** Inject the training publishable key without using VITE_SUPABASE_URL. */
function trainingClientConfig(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  if (env.VITE_TRAINING_SUPABASE_URL?.trim()) assertTrainingProjectUrl(env.VITE_TRAINING_SUPABASE_URL);
  const source = trainingConfigSource(env.VITE_TRAINING_SUPABASE_PUBLISHABLE_KEY);
  const serve: Connect.NextHandleFunction = (req, res, next) => {
    const pathOnly = (req.url || "").split("?")[0];
    if (pathOnly !== "/training-config.js") return next();
    res.setHeader("content-type", "application/javascript; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(source);
  };
  return {
    name: "hajcare-training-config",
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
    closeBundle() {
      const file = path.resolve(process.cwd(), "dist/training-config.js");
      if (!fs.existsSync(path.dirname(file))) return;
      fs.writeFileSync(file, source);
    },
  };
}

/** Inject the hajjcare-live publishable key for login-free training registration. */
function trainingRegisterClientConfig(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const source = trainingRegisterConfigSource(env.VITE_TRAINING_REGISTER_PUBLISHABLE_KEY);
  const serve: Connect.NextHandleFunction = (req, res, next) => {
    const pathOnly = (req.url || "").split("?")[0];
    if (pathOnly !== "/training-register-config.js") return next();
    res.setHeader("content-type", "application/javascript; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(source);
  };
  return {
    name: "hajcare-training-register-config",
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
    closeBundle() {
      const file = path.resolve(process.cwd(), "dist/training-register-config.js");
      if (!fs.existsSync(path.dirname(file))) return;
      fs.writeFileSync(file, source);
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
export default defineConfig(({ mode }) => {
  const volunteerEnv = loadEnv(mode, process.cwd(), "VITE_");
  if (volunteerEnv.VITE_VOLUNTEER_SUPABASE_URL?.trim()) {
    assertVolunteerProjectUrl(volunteerEnv.VITE_VOLUNTEER_SUPABASE_URL);
  }
  return {
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), demoRouting(), trainingClientConfig(mode), trainingRegisterClientConfig(mode), supabasePreconnect(mode), mode === "development" && componentTagger()].filter(Boolean),
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
  };
});
