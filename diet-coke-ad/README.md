# Diet Coke Paglu: 24s spec ad (unofficial concept)

A 24-second, 1920×1080, 30fps ad built in [Remotion](https://www.remotion.dev/). The cans and the
bottle clink shot are photoreal Three.js renders (chrome aluminium under studio softboxes, cold
condensation, a working ring-pull, real glass with cola inside); the IV bag, eyes, lips, charms and type are
CSS/SVG. The soundtrack (music and sound effects, including a ring-pull can opening built from its
physical parts) is synthesized in Python and timed to the same frame grid.
Not affiliated with The Coca-Cola Company. The can and bottle are modelled on the packaging in the mood board; the wordmark is set in stock fonts (Playfair Display +
Yellowtail), not the real logo. Swap in official artwork only if you have the rights.

Output: `diet-coke-paglu.mp4`

## The idea
An ad about being obsessed with Diet Coke ("paglu" means crazy), built from the mood-board references:
IV drip, ink eyes, a pack of cans, a Y2K glam collage, clinking glass bottles.
The music is 150 BPM, so one beat is exactly 12 frames and every cut and stamp lands on a beat.

| Time | Scene | What happens |
|---|---|---|
| 0.0–1.6s | Drip | Cola IV bag ("intravenously optimized"), heart monitor speeding up; a big drop falls |
| 1.6–3.2s | Eyes | Red ink eyes snap left and right; **Diet Coke Paglu** slams in; dive into a pupil |
| 3.2–6.4s | Cola | Bubble-ring tunnel inside the drink: ZERO *sugar.* ZERO *calories.* ZERO *chill.* FULL *paglu.* |
| 6.4–9.6s | Pack | "A pack a day. (of cans. relax.)": the pack flips open, then the cans multiply ×9 up to ×144 |
| 9.6–12.8s | Glam | Pink stripes, lips, heart charm, crushed can; the world flips: "It's not a phase." → "It's a lifestyle." |
| 12.8–16.0s | Marquee | PAGLU / Diet Coke ♥ rows race in opposite directions; a can floats up like a bubble |
| 16.0–19.2s | Strobe | 6-frame cuts through every motif, speeding up to P-A-G-L-U-! |
| 19.2–20.8s | Clink | Silence. Two bottles clink: "how will i go back to normal cans when i know this exists?" |
| 20.8–24.0s | Finale | Can slams down, shockwave, yellow wordmark: 0 calories. 0 sugar. **100% obsessed.** |

## Build
```bash
npm install
node render3d/render.mjs                               # 3D cans + bottle shot → public/3d (~6 min, needs Playwright)
python3 audio/soundtrack.py public/soundtrack.wav     # needs numpy, scipy, soundfile
npx remotion studio                                    # live preview
REMOTION_BROWSER=/path/to/chrome-headless-shell npx remotion render DietCokeAd out/raw.mp4 --crf=18
ffmpeg -i out/raw.mp4 -c:v libx264 -preset slow -crf 23 -af loudnorm=I=-14:TP=-1.5:LRA=7 -c:a aac -b:a 192k -movflags +faststart diet-coke-paglu.mp4
```
`REMOTION_BROWSER` is optional. Without it, Remotion downloads its own headless Chrome.

## Files
- `src/lib.ts`: timing grid, scene boundaries, palette, easing and shake helpers
- `src/Scenes.tsx`: the nine scenes; `src/Ad.tsx` sequences them and adds shake and flashes
- `render3d/scene.js`: the Three.js can (label, condensation, lid, tab, crushed variant) and bottle shot; `render3d/render.mjs` renders them headless
- `src/Can.tsx`: places the rendered can frames (spin, tab opening, crushed)
- `src/Props.tsx`, `src/Wordmark.tsx`: the drawn props
- `src/FX.tsx`: bubbles, RGB-split type, speed lines
- `audio/soundtrack.py`: music and SFX locked to the same frames
