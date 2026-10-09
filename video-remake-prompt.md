# Remake prompt: "how do you communicate a change?" format

A reusable prompt that rebuilds the reference video (`Video-62528.mp4`, 20.5s) in the same format for any song.

---

## Part 1: Questions to answer before each remake

**A. Song and timing**
1. Song title and artist, plus the audio file if you have it.
2. Which part of the song should play (start and end time)? The default is the most recognisable 20 seconds, usually the hook or the drop.
3. BPM, or the timestamps of the main beats and the drop. Without these, I'll estimate them from the audio.
4. Should the on-screen words be **song lyrics** or **your own message** set to the song?

**B. Script (the reference's lines are in brackets)**
5. Opening question, 6 to 10 words: [*how do you communicate that you're going through a change?*]
6. Answer line, in two beats: [*you dont.* → *you just show it.*]
7. Three one-word values, each ending with a full stop: [*action. intention. curiosity.*]
8. Bridge line: [*through ones own ability to*]
9. Final reveal word, 3 to 5 letters, spelled one letter per beat: [*LOVE*]

**C. Objects (the pixel-art "life inventory")**
10. 8 to 12 objects that stand for the subject's interests or life. [plant, clapperboard, skateboard, vinyl, book, camera, black cat, gold coin, gamepad, cap, heart, cash]
11. Which object goes with each of the 3 value words? [camera → action, book → intention, vinyl → curiosity]
12. Which object goes with each letter of the final word? [L heart, O camera, V book, E vinyl]
13. Should brand logos appear on the objects? The reference shows a Nike swoosh on the cap. My default is no logos.

**D. Subject**
14. Should I use a real person? If so, send a side-profile photo of the head and shoulders and a photo of a hand reaching up. Otherwise I'll generate an anonymous silhouette.
15. Keep the thermal-camera look on the person (orange, red and yellow gradient on black)?

**E. Look and output**
16. Aspect ratio: 4:3 like the reference (960×720), 9:16 for Reels or TikTok, or 1:1?
17. Keep the palette (off-white paper, near-black, signal red, thermal orange, one cyan flare) or swap in your own colours?
18. Font: a geometric sans in lowercase, like the reference (Satoshi, Gilroy or Circular), or a specific font?
19. Which tool will make the video: an AI video generator (Runway, Kling, Sora, Veo), After Effects, Figma motion, or code (Remotion)? This changes how the prompt is written.
20. Ending: hold on the scattered letters (as in the reference), or add a logo, handle or call to action?

---

## Part 2: The prompt (fill in the `{{ }}` slots)

```
Create a {{DURATION=20}}-second kinetic-typography music video, {{ASPECT=4:3}}, 24fps,
cut tightly to the beats of "{{SONG}}" by {{ARTIST}} ({{START}}–{{END}}, ~{{BPM}} BPM).
Every scene change, word appearance and object hit lands on a beat; the biggest
transition lands on the drop.

GLOBAL STYLE
- Two worlds that alternate on the beat:
  LIGHT = off-white textured paper (#E8E6E3), soft grey vignette, film grain.
  DARK  = near-black (#111) with grain, faint dust particles, red glow accents.
- Accent colour: signal red (#E3241B). Subject colour: thermal-camera gradient
  (deep red → orange → yellow-white). One cyan/electric-blue light flare only once.
- Typography: {{FONT=geometric sans}}, all lowercase, small and centred-left for
  sentences; huge and bold only for the opening words. Words type on one at a time,
  with a blinking block/bar cursor on the value words.
- Objects: 16-bit pixel-art icons with chunky outlines and slight 3D tilt,
  motion blur when moving. Hand-drawn pen scribbles, loops and circles
  (dark brown + red) annotate text. Black ink-blot splats as transitions.
- Camera: subtle push-ins, whip moves, motion blur on cuts, light chromatic aberration.

SHOT LIST (timings for a 20s cut; scale to the song's beats)
1. 0.0–1.8s LIGHT. Huge bold words "{{Q_WORD1}}" then "{{Q_WORD2}}" between dashed
   guide lines, one per beat. Then it snaps small and the full question types on:
   "{{OPENING_QUESTION}}". A hand-drawn pen line loops and circles one word.
2. 1.8–3.5s LIGHT. Pixel objects ({{3–4 OBJECTS}}) and red pen strokes burst in
   around the sentence; a cyan four-point star flare sweeps in from the left edge;
   the vignette darkens.
3. 3.5–4.0s. A red/orange glowing orb swallows the frame; the word "you" stays lit → cut to DARK.
4. 4.0–6.0s DARK. A thermal-gradient silhouette of {{SUBJECT}} in side profile,
   facing left. A thin white orbit ring spins around the head. Small white text on the left types
   "{{ANSWER_A}}" then, on the next beat, "{{ANSWER_B}}".
5. 6.0–6.6s. The thermal image dissolves into chunky pixels (pixel-sort / mosaic transition).
6. 6.6–8.0s LIGHT. All objects ({{OBJECT_LIST}}) form a slowly rotating ring/loop.
   Ink blots fly through; the heart (or key object) pulses with an orange glow.
7. 8.0–11.8s. Three value beats, alternating with short LIGHT interstitials
   where objects slide through the frame:
   - DARK: {{OBJ_1}} hit by a red four-point star flash, then text "{{VALUE_1}}" + cursor.
   - DARK: {{OBJ_2}} with a red light beam sweeping, then "{{VALUE_2}}" + cursor.
   - DARK: {{OBJ_3}} with red music-note / particle accents, then "{{VALUE_3}}" + cursor.
8. 12.0–13.5s LIGHT. The object ring returns, then explodes outward on the drop;
   objects turn into black silhouettes and ink splats.
9. 13.5–15.8s DARK. A thermal-gradient hand reaches up and grasps at the light;
   floating particles. The text splits around the hand: "{{BRIDGE_LINE}}".
10. 16.0–17.2s. Spell "{{FINAL_WORD}}" one letter per beat across the frame,
    each letter with a featured object in the centre ({{LETTER_OBJECT_PAIRS}}).
    Alternate the backgrounds: light, dark with red glow, red vignette, dark.
11. 17.2–20.5s LIGHT. The letters scatter, tumble and settle slowly into a loose
    layout on the paper; red hand-drawn loops scribble around each letter. Hold.
    {{OPTIONAL_END_CARD}}

AUDIO: use the song section only; no voiceover.
```

---

## Reference breakdown (source video)

| Time | Background | On screen |
|---|---|---|
| 0–1.8s | paper | "how" / "do you" big; question types small with pen circles |
| 1.8–3.5s | paper → vignette | pixel icons and red strokes; cyan star flare |
| 3.7s | red orb | "you" highlighted |
| 4–6s | black | thermal profile + orbit ring; "you dont." → "you just show it." |
| 6.3s | pixel dissolve | thermal blob turns into pixels |
| 6.7–8s | paper | rotating ring of 12 pixel objects, ink blots |
| 8.3–11.7s | black / paper | "action." camera · "intention." book · "curiosity." vinyl |
| 12–13.3s | paper | ring explodes, objects turn into silhouettes |
| 13.7–15.7s | black | thermal hand; "through ones own ability to" |
| 16–17s | alternating | L ♥ · O camera · V book · E vinyl |
| 17.3–20.5s | paper | L O V E scattered, red scribbles |
