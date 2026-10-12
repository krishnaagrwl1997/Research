"""Synthesize a seamless 20s, 120 BPM music bed + sfx for the Diet Claude showreel.

Usage: python audio/soundtrack.py public/soundtrack.wav
Everything is generated from numpy (no samples). The tail past 20s is wrapped back
onto the start so the track loops with the video.
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
LEN = 20.0
N = int(SR * LEN)
PAD = int(SR * 3)
rng = np.random.default_rng(7)

L = np.zeros(N + PAD)
R = np.zeros(N + PAD)


def t_of(n):
    return np.arange(n) / SR


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    end = min(i + len(sig), N + PAD)
    s = sig[: end - i] * gain
    L[i:end] += s * np.sqrt(0.5 * (1 - pan))
    R[i:end] += s * np.sqrt(0.5 * (1 + pan))


def frame(f):
    return f / 30.0


def lp(x, a):
    """one-pole lowpass via cumulative trick (cheap approximation using convolution)."""
    k = int(max(1, a))
    return np.convolve(x, np.ones(k) / k, mode="same")


def hp(x, a):
    return x - lp(x, a)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------------------------------------------------------------- drums
def kick():
    t = t_of(int(0.45 * SR))
    f = 48 + 120 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.3
    return np.tanh((s + click) * 1.6)


def snare():
    t = t_of(int(0.3 * SR))
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 22) * 0.5
    noise = hp(rng.standard_normal(len(t)), 6) * np.exp(-t * 16)
    return body + noise * 0.7


def clap():
    t = t_of(int(0.32 * SR))
    env = np.zeros(len(t))
    for d in (0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 60), 0)
    env += np.exp(-t * 14) * 0.5
    return hp(rng.standard_normal(len(t)), 3) * env * 0.6


def hat(open_=False):
    t = t_of(int((0.2 if open_ else 0.05) * SR))
    n = hp(hp(rng.standard_normal(len(t)), 2), 2)
    return n * np.exp(-t * (14 if open_ else 90)) * 0.35


K, S, CL, H, HO = kick(), snare(), clap(), hat(), hat(True)

bars = int(LEN / (BEAT * 4))  # 10
for b in range(bars):
    for beat in range(4):
        tt = (b * 4 + beat) * BEAT
        if b == 0 and beat < 2:
            continue  # hook bar: impact carries the first half
        place(K, tt, 0.9)
        if beat in (1, 3):
            place(CL, tt, 0.55, 0.1)
            place(S, tt, 0.35)
        place(H if (b + beat) % 4 else HO, tt + BEAT / 2, 0.5, 0.35)
        place(H, tt + BEAT / 4, 0.18, -0.35)
        place(H, tt + 3 * BEAT / 4, 0.18, -0.35)
    # snare fill into the CTA bar (bar 8 starts at 16s; CTA at 17s)
    if b == 8:
        for k in range(8):
            place(S, b * 4 * BEAT + 3 * BEAT + k * BEAT / 8, 0.25 + k * 0.05)

# ---------------------------------------------------------------- harmony
# A minor -> F -> C -> G, one bar each, 10 bars
prog = [(57, [0, 3, 7]), (53, [0, 4, 7]), (48, [0, 4, 7, 11]), (55, [0, 4, 7])]


def pluck(freq, dur, bright=1.0):
    t = t_of(int(dur * SR))
    s = np.zeros(len(t))
    for h in range(1, 9):
        s += np.sin(2 * np.pi * freq * h * t + h) / h * np.exp(-t * (3 + h * 2.2 / bright))
    return s * np.exp(-t * 2.5) * 0.25


def bass(freq, dur):
    t = t_of(int(dur * SR))
    sq = np.tanh(np.sin(2 * np.pi * freq * t) * 3) * 0.5 + np.sin(2 * np.pi * freq / 2 * t) * 0.6
    env = np.minimum(1, t * 200) * np.exp(-t * 3.2)
    return sq * env * 0.45


def pad(freqs, dur):
    t = t_of(int(dur * SR))
    s = np.zeros(len(t))
    for fq in freqs:
        for det in (-0.12, 0.12):
            s += np.sin(2 * np.pi * fq * (1 + det / 100) * t + rng.random() * 6)
    env = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.3)
    return s * env * 0.03


for b in range(bars):
    root, iv = prog[b % 4]
    t0 = b * 4 * BEAT
    if b >= 1:
        place(pad([midi(root + 12 + i) for i in iv], 4 * BEAT), t0, 1.0)
    # bass: eighth-note pulse with octave hops
    for e in range(8):
        if b == 0 and e < 4:
            continue
        note = root - 12 + (12 if e in (3, 6) else 0)
        place(bass(midi(note), BEAT / 2), t0 + e * BEAT / 2, 0.9)
    # arp plucks (16ths) from bar 2, brighter in the CTA
    if b >= 2:
        pattern = [0, 1, 2, 1, 2, 0, 1, 2]
        for s16 in range(16):
            i = pattern[s16 % 8] % len(iv)
            octv = 24 if s16 % 4 == 2 else 12
            g = 0.45 if s16 % 2 == 0 else 0.3
            place(pluck(midi(root + octv + iv[i]), 0.35, 1.6 if b >= 8 else 1.0),
                  t0 + s16 * BEAT / 4, g, 0.4 if s16 % 2 else -0.4)

# ---------------------------------------------------------------- sfx (frames @30fps)
def impact():
    t = t_of(int(1.2 * SR))
    f = 30 + 90 * np.exp(-t * 9)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    crack = lp(rng.standard_normal(len(t)), 3) * np.exp(-t * 18)
    return np.tanh((boom * 1.4 + crack * 0.9) * 1.5)


def whoosh(dur=0.45, rise=True):
    t = t_of(int(dur * SR))
    n = rng.standard_normal(len(t))
    env = np.sin(np.pi * (t / dur) ** (0.6 if rise else 1.4)) ** 2
    lo = lp(n, 18)
    hi = hp(n, 4)
    mix = (t / dur) if rise else (1 - t / dur)
    return (lo * (1 - mix) * 2.5 + hi * mix * 0.6) * env * 0.5


def pop():
    t = t_of(int(1.4 * SR))
    click = np.sin(2 * np.pi * 900 * t * np.exp(-t * 30)) * np.exp(-t * 120)
    hiss = hp(rng.standard_normal(len(t)), 2) * np.exp(-t * 2.4) * 0.22
    crackle = (rng.random(len(t)) > 0.9985) * rng.standard_normal(len(t)) * np.exp(-t * 2) * 1.2
    return click * 0.9 + hiss + crackle


def ding(freq):
    t = t_of(int(1.4 * SR))
    s = sum(np.sin(2 * np.pi * freq * m * t) * a * np.exp(-t * d)
            for m, a, d in ((1, 1, 3), (2.76, 0.4, 6), (5.4, 0.2, 10), (2, 0.25, 4)))
    return s * 0.35


def click():
    t = t_of(int(0.06 * SR))
    return np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 160) * 0.5 + rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.3


def blip(freq):
    t = t_of(int(0.12 * SR))
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 30) * 0.3


def riser(dur):
    t = t_of(int(dur * SR))
    f = 200 * 2 ** (t / dur * 3)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    n = hp(rng.standard_normal(len(t)), 3) * 0.25
    return (tone + n) * (t / dur) ** 2


def glug(dur):
    t = t_of(int(dur * SR))
    f = 180 + 520 * (t / dur) + 60 * np.sin(2 * np.pi * 9 * t)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t))
    return s * np.minimum(1, t * 10) * np.minimum(1, (dur - t) * 6) * 0.18


def stamp():
    t = t_of(int(0.5 * SR))
    return np.tanh(np.sin(2 * np.pi * np.cumsum(70 + 200 * np.exp(-t * 40)) / SR) * np.exp(-t * 9) * 2) * 0.8


place(impact(), 0, 1.0)
place(stamp(), frame(11), 0.8)
for cut, rise in ((30, True), (90, True), (165, False), (285, True), (345, False), (435, True), (510, True)):
    place(whoosh(0.4, rise), frame(cut) - 0.12, 0.8, 0.3 if rise else -0.3)
# promise words
for d in (4, 9, 15, 20):
    place(blip(660 + d * 18), frame(30 + d), 0.6)
# can drop + land + pop
place(whoosh(0.35, False), frame(92), 0.5)
place(kick(), frame(90 + 13), 0.7)
place(pop(), frame(90 + 22), 0.9)
# chat messages tick
for i, at in enumerate((8, 22, 36, 50, 64, 78)):
    place(blip(520 if i % 2 == 0 else 780), frame(165 + at), 0.55, -0.4 if i % 2 == 0 else 0.4)
# alerts
place(ding(1318.5), frame(285 + 4), 0.8, 0.3)
place(ding(1760), frame(285 + 24), 0.9, 0.3)
# toolkit tiles
for i in range(4):
    place(click(), frame(345 + 6 + i * 5), 0.9, (-0.4, 0.4)[i % 2])
# how-to steps + button click
for at in (6, 22, 38):
    place(whoosh(0.25, True), frame(435 + at) - 0.1, 0.45, 0.5)
place(click(), frame(435 + 6 + 12), 1.0)
for k in range(9):
    place(click(), frame(435 + 22 + 3 + k * 1.3), 0.35)
# CTA: riser before, refill glug, overflow pop, url thump
place(riser(1.0), frame(510) - 1.0, 0.7)
place(glug(1.2), frame(514), 0.9)
place(pop(), frame(550), 0.8)
place(kick(), frame(540), 0.6)
place(whoosh(0.4, False), frame(588) - 0.05, 0.6)

# ---------------------------------------------------------------- reverb-ish + master
def space(x):
    out = x.copy()
    for d, g in ((0.031, 0.35), (0.047, 0.3), (0.073, 0.25), (0.109, 0.2), (0.167, 0.15), (0.233, 0.1)):
        k = int(d * SR)
        out[k:] += lp(x[:-k], 4) * g
    return out


L2, R2 = space(L), space(R)
# wrap tail for a seamless loop
for ch in (L2, R2):
    ch[:PAD] += ch[N:N + PAD]
mix = np.stack([L2[:N], R2[:N]], axis=1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.max(np.abs(mix)) / 0.89
mix *= 10 ** (-4.5 / 20)  # sit around -14 LUFS for social

out = sys.argv[1] if len(sys.argv) > 1 else "public/soundtrack.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote", out, mix.shape[0] / SR, "s")
