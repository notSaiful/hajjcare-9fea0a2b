/**
 * Rebuild supabase/functions/_shared/knowledge.json from src/data.
 * Run: node scripts/build-zoya-knowledge.mjs
 */
import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outfile = path.join(root, "scripts/.tmp-extract-zoya-knowledge.mjs");

const aliasPlugin = {
  name: "hajcare-alias",
  setup(build) {
    build.onResolve({ filter: /^@\/contexts\/LanguageContext$/ }, () => ({
      path: path.join(root, "scripts/shims/language-context.ts"),
    }));
    build.onResolve({ filter: /^@\// }, (args) => {
      const rel = args.path.slice(2);
      const base = path.join(root, "src", rel);
      return { path: base.endsWith(".ts") || base.endsWith(".tsx") ? base : `${base}.ts` };
    });
  },
};

await esbuild.build({
  entryPoints: [path.join(root, "scripts/extract-zoya-knowledge.entry.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile,
  plugins: [aliasPlugin],
  logLevel: "info",
});

const mod = await import(pathToFileUrl(outfile));
await mod.writeKnowledge(path.join(root, "supabase/functions/_shared/knowledge.json"));

function pathToFileUrl(file) {
  return new URL(`file://${file}`);
}
