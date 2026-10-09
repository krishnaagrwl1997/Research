# Motion Showreel (15s)

A 15-second, 1920×1080, 60fps motion design showreel. Every cut lands on a 120 BPM beat grid,
and the frames use real sub-frame motion blur (5 samples per frame, 180° shutter).

| Time | Scene | What it shows |
|---|---|---|
| 0–2s | 01 Genesis | A dot pulses, snaps into a line, then opens into a band that reveals the kinetic type |
| 2–4s | 02 Form | Shape morphs on every beat (circle → square → triangle → star), echo trails, circle-wipe colour changes |
| 4–6s | 03 Kinetic Type | MAKE / IT / MOVE: slam-in letters, a rotating outline echo, marquee rows, then a slice wipe out |
| 6–8s | 04 Particles | 4,200 particles swirl, form IDEAS and warp out toward the camera |
| 8–10s | 05 Dimension | A 3D tunnel and a flat-shaded cube that snaps on the beats, then a fly-through |
| 10–12s | 06 Interface | Full-screen colour shrinks into a phone; spring-staggered cards, chart, toggle, like burst, cursor clicks |
| 12–13.5s | 07 Recap | A glitch transition, three statement slams, then a grid of every scene collapsing to the dot |
| 13.5–15s | 08 Hello | The dot becomes the underline, and the name and title card resolve |

## Build
1. `node render.mjs [--name="YOUR NAME"]` renders `reel.html` to `build/video-only.mp4`. Add `--sheet` for a contact sheet.
2. `python audio/mix.py build/soundtrack.wav` synthesizes the soundtrack (needs numpy, scipy, soundfile).
3. Mux:
   `ffmpeg -i build/video-only.mp4 -i build/soundtrack.wav -af loudnorm=I=-14:TP=-1.5 -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 192k -t 15 showreel.mp4`

For a silent live preview, open `reel.html` in a browser. Append `?name=Your+Name` to change the name, or `?t=8.5` to freeze on a frame.
