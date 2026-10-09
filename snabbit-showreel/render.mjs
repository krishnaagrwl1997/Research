// Renders showreel.html frame by frame and pipes JPEGs into ffmpeg (muxing soundtrack.wav if present).
// Usage: node render.mjs [out.mp4]            full 20s video
//        node render.mjs out.png --sheet      contact sheet
//        node render.mjs out.png --at 1.5,2.0 contact sheet of specific times
import { createRequire } from 'module';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const dir = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const out = argv[0] && !argv[0].startsWith('--') ? argv[0] : path.join(dir, 'snabbit-showreel.mp4');
const atI = argv.indexOf('--at');
const at = atI >= 0 ? argv[atI + 1].split(',').map(Number) : null;
const sheet = argv.includes('--sheet') || !!at;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await page.goto('file://' + path.join(dir, 'showreel.html') + '?render');
await page.evaluate(() => window.ready);
const { dur, fps } = await page.evaluate(() => ({ dur: window.DURATION, fps: window.FPS }));

let times = [];
if (at) times = at;
else if (sheet) for (let i = 0; i < 30; i++) times.push(0.1 + i * dur / 30);
else for (let f = 0; f < Math.round(dur * fps); f++) times.push(f / fps);

const cols = sheet ? Math.min(6, times.length) : 0, rows = sheet ? Math.ceil(times.length / cols) : 0;
const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(sheet ? 1 : fps), '-i', '-'];
const audio = path.join(dir, 'soundtrack.wav');
if (sheet) args.push('-vf', `scale=360:-1,tile=${cols}x${rows}`, '-frames:v', '1', out);
else {
  if (existsSync(audio)) args.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
}
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < times.length; i++) {
  const url = await page.evaluate(t => window.renderFrame(t), times[i]);
  const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 300 === 0) process.stderr.write(`frame ${i}/${times.length}\n`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out);
