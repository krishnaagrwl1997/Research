# Synthesizes the showreel soundtrack: a 120 BPM track whose hits, whooshes and stingers land on reel.html's cuts.
# Usage: python mix.py <out.wav>
import sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000; DUR = 15.6; N = int(DUR * SR)
BEAT = 0.5
rng = np.random.default_rng(3)

def t_(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.005, decay=0.2): t = t_(d); return np.minimum(1, t / a) * np.exp(-t / decay)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(d * SR))
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, d):
    t = t_(d); return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 12))
def sq(f, d):
    t = t_(d); return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 12, 2))
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i < 0: x, i = x[-i:], 0
    j = min(len(buf), i + len(x));
    if j > i: buf[i:j] += x[:j - i] * g
def reverb(x, secs=1.8, wet=0.3):
    ir = noise(secs) * np.exp(-t_(secs) / (secs / 5)); ir = lp(ir, 6000); ir /= np.sqrt(np.sum(ir ** 2))
    return x + fftconvolve(x, ir)[:len(x)] * wet

# ---------- instruments ----------
def kick(g=1.0):
    t = t_(0.4); f = 42 + 140 * np.exp(-t / 0.035)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) + 0.3 * hp(noise(.4), 3000) * np.exp(-t / .004)) * g
def clap(): x = noise(0.25); return hp(bp(x, 900, 4000) * (env(.25, .001, .06) + 0.5 * env(.25, .012, .02)), 500) * 1.3
def hat(o=False): return hp(noise(0.15), 8000) * env(0.15, .001, .06 if o else .02) * 0.5
def sub(m, d): t = t_(d); x = np.sin(2 * np.pi * mtof(m) * t) + 0.35 * np.tanh(3 * lp(saw(mtof(m), d), 500)); return x * env(d, .004, d * .6) * 0.55
def pluck(m, d=0.25): return lp(saw(mtof(m), d) + saw(mtof(m) * 1.006, d), 3200) * env(d, .002, .07) * 0.07
def bell(m, d=0.8):
    t = t_(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t) + .2 * np.sin(2 * np.pi * f * 5.4 * t)) * env(d, .002, .25) * 0.2
def boing(m):  # pitch-dropping blip for the shape morphs
    d = 0.3; t = t_(d); f = mtof(m) * (1 + 1.5 * np.exp(-t / .03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, .001, .09) * 0.35
def whoosh(d=0.5, lo=400, hi=6000, rev=False):
    t = t_(d); sh = np.sin(np.pi * t / d) ** 2; x = noise(d)
    out = np.zeros_like(x); nseg = 24; L = len(x) // nseg
    for k in range(nseg):
        fr = k / nseg if not rev else 1 - k / nseg
        f0 = lo * (hi / lo) ** fr; out[k * L:(k + 1) * L] = bp(x[k * L:(k + 1) * L], f0, min(f0 * 1.8, 20000))
    return out * sh * 0.6
def riser(d, lo=200, hi=5000):
    t = t_(d); x = noise(d); out = np.zeros_like(x); nseg = 40; L = len(x) // nseg
    for k in range(nseg):
        f0 = lo * (hi / lo) ** (k / nseg); out[k * L:(k + 1) * L] = bp(x[k * L:(k + 1) * L], f0, f0 * 1.6)
    tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (3 * t / d)) / SR) * 0.15
    return (out + tone) * (t / d) ** 2 * 0.7
def impact(g=1.0):
    d = 1.6; t = t_(d); f = 30 + 90 * np.exp(-t / .06)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .5)
    crash = hp(noise(d), 3000) * np.exp(-t / .45) * 0.35
    return (boom + crash + 0.4 * lp(noise(d), 400) * np.exp(-t / .1)) * g
def click(f=3000): d = .04; return bp(noise(d), f, f * 1.5) * env(d, .0005, .006) * 1.2
def clack(): d = .25; t = t_(d); return (bp(noise(d), 1500, 5000) * env(d, .001, .02) + np.sin(2 * np.pi * 820 * t) * env(d, .001, .05) * .4) * 0.9
def stab(ms, d=0.35): return lp(sum(saw(mtof(m), d) + saw(mtof(m) * 1.008, d) for m in ms), 2600) * env(d, .002, .12) * 0.06
def pad(ms, d): t = t_(d); return lp(sum(saw(mtof(m) * (1 + det), d) for m in ms for det in (-.006, 0, .006)), 1400) * np.minimum(1, t / .05) * np.exp(-t / 1.4) * 0.025

# ---------- arrangement ----------
music = np.zeros(N); sfx = np.zeros(N)
CHORDS = {2: (45, [57, 60, 64]), 4: (41, [57, 60, 65]), 6: (48, [55, 60, 64]), 8: (43, [55, 59, 62]), 10: (45, [57, 60, 64])}  # Am F C G Am
def chord_at(t): return CHORDS[max(k for k in CHORDS if k <= max(2, t))]

# 0-2 intro: riser, blips and the band opening
add(sfx, riser(2.0, 150, 7000), 0.0, 0.6)
add(sfx, bell(96, .6), 0.02, 0.9)
add(sfx, kick(.6), 0.05)
add(sfx, whoosh(0.45, 600, 9000), 0.36, 0.8)
add(sfx, whoosh(0.5, 300, 4000), 0.8, 0.7)
for i in range(6): add(sfx, click(2500 + i * 300), 0.98 + i * 0.045 + 0.15, 0.6)
add(sfx, whoosh(0.4, 1000, 9000), 1.6, 0.6)

# 2-12 groove
for b in range(20):
    at = 2 + b * BEAT
    root, ch = chord_at(at)
    glitch_zone = at >= 11.5
    add(music, kick(), at, 0 if glitch_zone else 1.0)
    if b % 2 == 1 and not glitch_zone: add(music, clap(), at, 0.5)
    for s in range(4):
        tt = at + s * BEAT / 4
        add(music, hat(o=s == 2), tt, [0.25, 0.12, 0.45, 0.15][s])
        add(music, pluck(ch[(b * 4 + s) % 3] + 12 + (12 if s == 3 else 0)), tt, 1.0)
    add(music, sub(root - 12, BEAT * .45), at + BEAT / 2, 1.0)
    add(music, sub(root - 12, BEAT * .2), at + BEAT * .75, 0.6)
    if b % 4 == 0: add(music, stab(ch), at, 1.0)

# scene hits
for i, b in enumerate([2.5, 3.0, 3.5]): add(sfx, boing(72 + i * 3), b, 1.0)
add(sfx, boing(84), 2.0, 0.8)
add(sfx, whoosh(0.35, 3000, 200, rev=False), 3.68, 0.7)
add(sfx, impact(0.5), 4.0)
add(sfx, stab([69, 72, 76]), 4.0, 2.0)
add(sfx, clack(), 4.5, 0.8); add(sfx, stab([65, 69, 72]), 4.5, 2.0)
add(sfx, whoosh(0.5, 400, 3000), 5.0, 0.6)
add(sfx, whoosh(0.5, 2000, 200), 5.55, 0.9)
for i in range(8): add(sfx, bell(84 + [0, 3, 7, 10, 12, 15, 19, 22][i], .5), 6.2 + i * 0.13, 0.35)
add(sfx, riser(0.6, 300, 9000), 7.4, 0.9)
for i in range(8): add(sfx, clap(), 7.5 + i * 0.0625, 0.25 + i * 0.05)
add(sfx, impact(1.0), 8.0)
for b in [8.5, 9.0, 9.5]: add(sfx, clack(), b, 1.0); add(sfx, boing(60), b, 0.5)
add(sfx, whoosh(0.45, 200, 8000), 9.58, 0.9)
add(sfx, kick(.8), 10.0); add(sfx, whoosh(0.5, 3000, 300), 10.0, 0.5)
for i in range(4): add(sfx, click(3500), 10.45 + i * 0.07, 0.5)
add(sfx, click(1800), 10.98, 1.2); add(sfx, bell(91, .4), 11.0, 0.4)
add(sfx, bell(86, .4), 11.05, 0.3)
add(sfx, click(2200), 11.32, 1.2); add(sfx, bell(96, .5), 11.34, 0.5); add(sfx, bell(100, .5), 11.4, 0.3)

# 11.6-12 glitch: stutter-repeat the groove, bitcrush, digital noise
i0 = int(11.5 * SR); sl = music[i0:i0 + int(0.0625 * SR)].copy()
for k in range(int(0.4 / 0.03125)):
    at = 11.62 + k * 0.03125; L = int(0.03125 * SR)
    piece = sl[:L] * np.hanning(L) ** 0.3
    add(music, np.round(piece * 8) / 8, at, 1.0)
for k in range(10): add(sfx, bp(noise(.03), 2000 + 600 * k, 4000 + 800 * k) * 0.6, 11.62 + k * 0.038, 1.0)
music[int(11.62 * SR):int(12 * SR)] = np.round(music[int(11.62 * SR):int(12 * SR)] * 6) / 6

# 12-13.5 recap: three slams, then a snare roll riser into the end card
for j, at in enumerate([12.0, 12.25, 12.5]):
    add(sfx, impact(0.6), at); add(sfx, kick(), at)
    add(sfx, stab([[69, 72, 76], [65, 69, 72], [67, 71, 74]][j], .3), at, 2.5)
for i in range(6): add(sfx, click(3000 + i * 400), 12.75 + i * 0.04, 0.5)
roll = [12.75 + 0.75 * (1 - (1 - k / 24) ** 1.6) for k in range(24)]
for k, at in enumerate(roll): add(sfx, clap(), at, 0.15 + k * 0.02)
add(sfx, riser(0.75, 400, 10000), 12.75, 0.8)
add(sfx, whoosh(0.3, 6000, 300), 13.2, 0.8)

# 13.5 end card: big impact + pad, line zip, final ping
add(sfx, impact(1.3), 13.5); add(sfx, kick(1.2), 13.5)
add(sfx, pad([45, 57, 60, 64, 71], 2.1), 13.5, 1.0)
add(sfx, sub(33, 1.6) * 1.5, 13.5, 1.0)
add(sfx, whoosh(0.4, 800, 9000), 13.6, 0.6)
for i in range(len('CLAUDE')): add(sfx, click(2600 + 200 * i), 13.8 + i * 0.04, 0.4)
for i, m in enumerate([76, 79, 81, 84, 88]): add(sfx, bell(m + 12, .6), 14.15 + i * 0.05, 0.3)
add(sfx, bell(93, 1.2), 14.5, 0.6); add(sfx, kick(.7), 14.5)

# duck the music under the transition hits; fade the groove out before the end card
mix = music * np.where(t_(DUR) < 12.0, 1.0, np.clip(1 - (t_(DUR) - 12.0) / 0.2, 0.25, 1)) * np.where(t_(DUR) < 13.5, 1, 0)
mix = reverb(mix, 1.2, 0.12) + reverb(sfx, 2.2, 0.28)
fade = np.clip((DUR - t_(DUR)) / 0.4, 0, 1); mix *= fade
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= np.max(np.abs(mix)) + 1e-9
stereo = np.stack([mix, np.roll(mix, int(0.0004 * SR))], 1) * 0.9
sf.write(sys.argv[1], stereo, SR)
print('wrote', sys.argv[1])
