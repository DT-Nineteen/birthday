import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync } from "node:fs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const serverDir = join(dist, "server");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (path.includes(`${sep}.git${sep}`) || path.includes(`${sep}dist${sep}`)) {
      return [];
    }
    const stat = statSync(path);
    return stat.isDirectory() ? walk(path) : [path];
  });
}

function mimeFor(path) {
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
}

const sourceFiles = walk(root).filter((path) => {
  const rel = relative(root, path).replaceAll(sep, "/");
  return (rel.endsWith(".html") && !rel.includes("/")) || rel === "style.css" || rel.startsWith("images/");
});

const entries = {};
for (const path of sourceFiles) {
  const rel = relative(root, path).replaceAll(sep, "/");
  const route = `/${rel}`;
  const buffer = await readFile(path);
  entries[route] = {
    mime: mimeFor(path),
    base64: buffer.toString("base64")
  };

  if (rel.endsWith(".html")) {
    const cleanRoute = `/${rel.replace(/\.html$/, "")}`;
    entries[cleanRoute] = entries[route];
  }
}
entries["/"] = entries["/index.html"];
entries["/hibeo"] = entries["/index.html"];

const worker = `const assets = ${JSON.stringify(entries)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const asset = assets[url.pathname] || assets[decodeURIComponent(url.pathname)];
    if (!asset) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(decodeBase64(asset.base64), {
      headers: {
        "content-type": asset.mime,
        "cache-control": url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname.endsWith(".css")
          ? "no-cache"
          : "public, max-age=31536000, immutable"
      }
    });
  }
};
`;

await rm(dist, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await writeFile(join(serverDir, "index.js"), worker);
console.log(`Built ${Object.keys(entries).length} static routes.`);
