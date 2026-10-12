// Renders the photoreal can/bottle assets into public/3d/ with headless Chromium (WebGL via SwiftShader).
// Usage: node render3d/render.mjs [--only=spin,open,crushed,clink] [--test]
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', '3d');
const only = (process.argv.find((a) => a.startsWith('--only=')) || '--only=spin,open,crushed,clink').slice(7).split(',');
const test = process.argv.includes('--test');
fs.mkdirSync(out, { recursive: true });

const types = { '.js': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2' };
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
page.on('console', (m) => m.type() === 'error' && console.error('page:', m.text()));
page.on('pageerror', (e) => console.error('pageerror:', e.message));
await page.route('http://local/**', (route) => {
  const p = path.join(root, decodeURIComponent(new URL(route.request().url()).pathname));
  if (!p.startsWith(root) || !fs.existsSync(p)) return route.fulfill({ status: 404, body: '' });
  route.fulfill({ body: fs.readFileSync(p), contentType: types[path.extname(p)] || 'application/octet-stream' });
});
await page.goto('http://local/render3d/index.html');
await page.waitForFunction(() => window.api);
console.log('fonts:', await page.evaluate(() => window.api.ready));

const save = (file, url) => fs.writeFileSync(path.join(out, file), Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
const bbox = (url) =>
  page.evaluate(async (u) => {
    const img = new Image(); img.src = u; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 20) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return { w: c.width, h: c.height, x0, y0, x1, y1 };
  }, url);

const meta = fs.existsSync(path.join(out, 'meta.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'meta.json'))) : {};
const t0 = Date.now();
const log = (s) => console.log(`${((Date.now() - t0) / 1000).toFixed(1)}s ${s}`);

if (only.includes('spin')) {
  const n = test ? 2 : 48;
  for (let i = 0; i < n; i++) {
    const url = await page.evaluate(([i, n]) => window.api.canSpin(i, n), [i, 48]);
    if (i === 0) meta.spin = await bbox(url);
    save(`spin_${String(i).padStart(2, '0')}.webp`, url);
  }
  meta.spinCount = 48;
  log('spin');
}
if (only.includes('open')) {
  const n = test ? 1 : 16;
  for (let i = 0; i < n; i++) {
    const url = await page.evaluate((t) => window.api.canOpen(t), (test ? 6 : i) / 16);
    if (i === 0) meta.open = await bbox(url);
    save(`open_${String(test ? 6 : i).padStart(2, '0')}.webp`, url);
  }
  log('open');
}
if (only.includes('crushed')) {
  const url = await page.evaluate(() => window.api.canCrushed());
  meta.crushed = await bbox(url);
  save('crushed.webp', url);
  log('crushed');
}
if (only.includes('clink')) {
  const frames = test ? [10, 22] : Array.from({ length: 48 }, (_, i) => i);
  for (const f of frames) save(`clink_${String(f).padStart(2, '0')}.jpg`, await page.evaluate((f) => window.api.clink(f), f));
  meta.clinkContact = await page.evaluate(() => window.api.clinkContact());
  log('clink');
}
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 1));
await browser.close();
