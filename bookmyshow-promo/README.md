# BookMyShow spec promo (unofficial concept)

A 35s, 1920×1080 concept promo for bookmyshow.com, in the style of a flat-colour
app walkthrough with a dithered mascot. Not affiliated with BookMyShow; the
mascot "Kernel" (a popcorn bucket) and all film/event names are original.

- `promo.html`: the whole video, drawn on canvas. Open it in a browser for a live preview.
- `render.mjs`: renders frames with Playwright and encodes `bookmyshow-promo.mp4` with ffmpeg.
  `node render.mjs` (add `--sheet` with an output path for a contact sheet).
