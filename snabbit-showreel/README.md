# Snabbit showreel (unofficial concept)

A 20s, 1080×1080, 60fps looping motion-graphics showreel for snabbit.com: on-demand house help at your door in about 10 minutes.
It is not affiliated with Snabbit. The wordmark is typeset in Inter Display, and the palette is original.

Beats (cut to 120 BPM, so 20s is exactly 10 bars):

| time | scene |
|---|---|
| 0–1s | **Hook:** "HOUSE HELP IN 10 MINUTES." The countdown ring drains, a ₹99/hr sticker pops in |
| 1–2s | The camera zooms through the counter of the "0" |
| 2–5s | Everyday chaos struck through, then "Just Snabbit." |
| 5–9s | App flow: Tap → Track (live route with ETA countdown) → Done |
| 9–12.5s | "One app. Every chore.": six service tiles and a marquee |
| 12.5–16s | Numbers: ₹99/hr, 1,15,000+ jobs a day, 10 cities, 150+ micro-markets |
| 16–18s | Trust stamps: Trained, Verified, On time. 1/2/3-hour slots, no lock-ins |
| 18–20s | Wordmark end card, which morphs back into the hook's first frame for a seamless loop |

Figures come from Snabbit's city pages and press coverage (YourStory, Aug 2026). The expert "Meena" is fictional.

- `showreel.html`: the whole video, drawn on canvas as a pure function of time. Open it in a browser for a live preview.
- `soundtrack.py`: synthesizes `soundtrack.wav` with numpy. Sound effects are placed at the animation's timestamps, and tails wrap around so the audio also loops.
- `render.mjs`: renders frames with Playwright and encodes `snabbit-showreel.mp4` with ffmpeg.
  Run `node render.mjs`, or `node render.mjs sheet.png --sheet` (or `--at 1.5,2`) for contact sheets.
