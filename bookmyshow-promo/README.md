# Kernel's Friday Night: BookMyShow spec promo (unofficial concept)

A ~39s, 1920×1080 social promo for bookmyshow.com, narrated by an original mascot,
Kernel the popcorn bucket. Not affiliated with BookMyShow; the mascot, script, music
and all film/event names are original.

## Pipeline
1. `audio/script.json`: Kernel's lines.
2. `audio/voice.py <kokoro_model_dir> audio/`: voices the lines with Kokoro (voice `af_heart`,
   pitched up) and writes `audio/*.wav` + per-frame mouth data (`voice.json`, then `voice.js` for the page).
3. `node render.mjs`: renders `promo.html` frame by frame to `build/video-only.mp4` and
   writes `audio/timeline.json` (scene, voice and sfx timings).
4. `python audio/mix.py build/soundtrack.wav`: synthesizes the music bed and sfx, ducks it under the voice.
5. Mux:
   `ffmpeg -i build/video-only.mp4 -i build/soundtrack.wav -af loudnorm=I=-14:TP=-1.5 -c:v copy -c:a aac -shortest bookmyshow-promo.mp4`

Open `promo.html` in a browser for a silent live preview.
