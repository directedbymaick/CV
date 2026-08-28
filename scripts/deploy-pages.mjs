// Static export + deploy to GitHub Pages (gh-pages branch).
// The app is a fully client-hydrated single page, so the SSR HTML of "/"
// plus the client assets form a complete static site.
// Usage: npm run deploy:pages
import { execSync, spawn } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://rayanmpondo.mad-makers.fr";
const CNAME = "rayanmpondo.mad-makers.fr";
const REPO = "https://github.com/directedbymaick/CV.git";
const PORT = 4732;
const root = fileURLToPath(new URL("..", import.meta.url));
const env = { ...process.env, SITE_ORIGIN: ORIGIN, PORT: String(PORT) };

execSync("npm run build", { cwd: root, stdio: "inherit", env });
console.log("[deploy] build done, starting server...");

const server = spawn(process.execPath, [join(root, "node_modules/vinext/dist/cli.js"), "start"], { cwd: root, env, stdio: "ignore" });
let html = null;
try {
  for (let i = 0; i < 60 && html === null; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/`);
      if (res.ok) html = await res.text();
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
} finally {
  server.kill();
}
console.log("[deploy] html captured:", html?.length ?? null);
if (html === null) throw new Error("Production server never answered; static export aborted.");
if (!html.includes("_next/static")) throw new Error("Rendered HTML looks incomplete; static export aborted.");

// Node's native cpSync crashes on this machine's non-ASCII paths; copy by hand.
const SKIP = new Set([".vite", "_headers", ".assetsignore", "vinext-client-entry-manifest.json"]);
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const src = join(from, entry.name);
    const dst = join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else copyFileSync(src, dst);
  }
}
const staging = mkdtempSync(join(tmpdir(), "cv-pages-"));
copyDir(join(root, "dist/client"), staging);
writeFileSync(join(staging, "index.html"), html);
writeFileSync(join(staging, "404.html"), html);
writeFileSync(join(staging, "CNAME"), `${CNAME}\n`);
writeFileSync(join(staging, ".nojekyll"), "");

const git = (args) => execSync(`git ${args}`, { cwd: staging, stdio: "inherit" });
git("init -b gh-pages");
git("add -A");
git('commit -m "Deploy static CV site"');
git(`push --force ${REPO} gh-pages`);
rmSync(staging, { recursive: true, force: true });
console.log(`\nDeployed to ${ORIGIN} (GitHub Pages, branch gh-pages).`);
