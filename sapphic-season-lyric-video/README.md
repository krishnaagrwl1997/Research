# Sapphic Season: lyric video

A 1920×1080, 30 fps lyric video for *Sapphic Season* (made with Suno), built in [Remotion](https://remotion.dev).
Lyrics come from the track's embedded `lyrics-eng` tag; timing comes from the audio itself.

## Look
- **Intro / outro (spoken):** the lines arrive as chat bubbles on a phone, with a live voice-note waveform.
- **Verses:** October rust gradient, falling leaves, words light up karaoke-style as they're sung.
- **Pre-choruses:** a rotating pink sunburst builds the tension.
- **Choruses / post-chorus:** drifting sunset-flag stripes and rising hearts, all pulsing with the kick drum.
- **Bridge:** a handwritten note to the universe that gets scribbled out at "scratch that".
- **Final chorus:** shouted lines shake; the ad-libs pop up as message bubbles.

## Pipeline
1. `audio/lyrics.txt`: lyrics pulled from the MP3 tag (`ffprobe -show_entries format_tags=lyrics-eng`).
2. `audio/asr_timestamps.py <16k wav> <model dir> audio/asr_words.json`: word timestamps from a
   sherpa-onnx zipformer ([sherpa-onnx-zipformer-en-2023-06-26](https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models)).
   Make the wav with `ffmpeg -i public/sapphic-season.mp3 -ac 1 -ar 16000 song16k.wav`.
3. `audio/align.py audio/lyrics.txt audio/asr_words.json 211.632 src/lyrics.json`: matches lyric words to the
   recognised words and interpolates the rest. `audio/timing_overrides.json` pins line starts where the
   recogniser got lost (chorus 1 copies chorus 2's timing, shifted 65.8s). To nudge a line, edit that file and re-run.
4. `audio/energy.py public/sapphic-season.mp3 src/energy.json`: per-frame loudness and kick envelope for the pulses.
5. `npm install`, then `npm run studio` to preview or `npm run render` to write `build/sapphic-season-lyric-video.mp4`.

`remotion.config.ts` points Remotion at the preinstalled Playwright headless shell when it exists; elsewhere
Remotion downloads its own browser.
