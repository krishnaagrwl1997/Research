// Renders video.html frame by frame with headless Chromium and pipes the frames into ffmpeg.
// Usage: node render.mjs out.mp4            -> full video
//        node render.mjs --stills dir t1 t2  -> PNG stills at given seconds
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const FPS = 24, DURATION = 20.5;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 720 } });
await page.goto('file://' + path.join(here, 'video.html'));
await page.evaluate(() => window.ready);
const grab = async (t, fmt) => Buffer.from((await page.evaluate(([t, fmt]) => { render(t); return document.getElementById('c').toDataURL(fmt, 0.95); }, [t, fmt])).split(',')[1], 'base64');

const args = process.argv.slice(2);
if (args[0] === '--stills') {
  mkdirSync(args[1], { recursive: true });
  for (const t of args.slice(2)) writeFileSync(path.join(args[1], `t${(+t).toFixed(2)}.png`), await grab(+t, 'image/png'));
} else {
  const out = args[0] || 'wake-me-up.mp4';
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(DURATION * FPS);
  for (let i = 0; i < n; i++) {
    const buf = await grab(i / FPS, 'image/jpeg');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('wrote', out, n, 'frames');
}
await browser.close();
