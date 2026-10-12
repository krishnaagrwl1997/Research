# Diet Claude showreel (unofficial concept)

A 20s, 1080×1080, 30fps looping motion-graphics promo for [dietclaude.com](https://dietclaude.com),
the free Chrome extension that shows your Claude usage limits as a draining soda can.
Built with Remotion. Not affiliated with Diet Claude or Anthropic.

## Storyboard (cuts land on the beat, 120 BPM)
| Time | Scene |
|---|---|
| 0–1s | **Hook**: "You've hit your usage limit." toast slams in with a shake and "AGAIN?!" |
| 1–3s | "Never get blindsided by Claude's limits again." |
| 3–5.5s | The can drops in and pops open: **Diet Claude**, free Chrome extension |
| 5.5–9.5s | Live usage meter: the chat grows, the can drains, 5-hour and weekly bars, reset countdown |
| 9.5–11.5s | Alerts at 70% and 90% |
| 11.5–14.5s | Token-saving toolkit: context gauge, cache-warmth timer, new-chat advisor, Fork & Compress |
| 14.5–17s | How to use it: Add to Chrome → open claude.ai → watch the can |
| 17–20s | The can refills and overflows, "Stay on the diet.", dietclaude.com, then an iris back to the hook |

The last frame is ink black and the first frame is the hook on ink, cut on the downbeat. The
soundtrack's reverb tail is wrapped onto its start, so the audio loops cleanly as well.

## Build
```bash
npm install
python3 audio/soundtrack.py public/soundtrack.wav   # numpy-only synth: music bed + sfx
npm run studio                                       # live preview
REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render
```
`REMOTION_BROWSER` is optional. Leave it unset and Remotion downloads its own headless shell.

Product details come from public launch listings: the can-style usage meter, 5-hour and weekly
windows, reset countdowns, 70%/90% alerts, context gauge, cache-warmth timer, new-chat advisor
and Fork & Compress. Chat contents and numbers on screen are illustrative.
