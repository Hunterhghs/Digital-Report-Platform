// Local preview server for dist/.
//
//   npm run dev     build, then serve
//   npm run serve   serve whatever is already built
//
// Resolves clean URLs the way Cloudflare Pages does — /reports/foo/ serves
// reports/foo/index.html — so what you see locally matches what deploys.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

if (!fs.existsSync(ROOT)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let rel = decodeURIComponent(url.pathname);

  // Contain every request inside dist/, whatever the path claims.
  const target = path.normalize(path.join(ROOT, rel));
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let file = target;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  else if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const notFound = path.join(ROOT, '404.html');
    if (fs.existsSync(notFound)) {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(fs.readFileSync(notFound));
    } else {
      res.writeHead(404).end('Not found');
    }
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(fs.readFileSync(file));
});

server.listen(PORT, () => {
  console.log(`→ http://localhost:${PORT}`);
});
