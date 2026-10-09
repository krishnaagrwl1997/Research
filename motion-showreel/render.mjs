// Renders reel.html frame by frame (with sub-frame motion blur) and pipes JPEGs into ffmpeg.
// Usage: node render.mjs [out.mp4] [--sheet] [--name="YOUR NAME"]   (--sheet writes a contact sheet instead)
import { createRequire } from 'module';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const dir = path.dirname(fileURLToPath(import.meta.url));
const args_ = process.argv.slice(2);
const out = args_.find(a => !a.startsWith('--')) || path.join(dir, 'build', 'video-only.mp4');
const sheet = args_.includes('--sheet');
const name = (args_.find(a => a.startsWith('--name=')) || '').slice(7);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => { console.error(e); process.exit(1); });
await page.goto('file://' + path.join(dir, 'reel.html') + '?render' + (name ? '&name=' + encodeURIComponent(name) : ''));
await page.evaluate(() => window.ready);
const { dur, fps } = await page.evaluate(() => ({ dur: window.DURATION, fps: window.FPS }));

const times = [];
if (sheet) for (let t = 0.1; t < dur; t += dur / 36) times.push(t);
else for (let f = 0; f < Math.round(dur * fps); f++) times.push(f / fps);

const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(sheet ? 1 : fps), '-i', '-'];
if (sheet) args.push('-vf', 'scale=480:-1,tile=6x6', '-frames:v', '1', out);
else args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });

for (let i = 0; i < times.length; i++) {
  const url = await page.evaluate(t => window.renderFrame(t), times[i]);
  const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 120 === 0) process.stderr.write(`frame ${i}/${times.length}\n`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out);
