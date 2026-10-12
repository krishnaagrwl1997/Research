# Synthesizes the whole soundtrack (music + sfx) locked to the video's frame grid.
# 150 BPM at 30fps: 1 beat = 12 frames = 0.4s. Scene frames mirror src/lib.ts.
# Usage: python audio/soundtrack.py public/soundtrack.wav
import sys
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
DUR = 24.0
N = int(DUR * SR)
rng = np.random.default_rng(150)


def fr(f): return f / FPS
def t_(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.003, decay=0.2):
    t = t_(d); return np.minimum(1, t / a) * np.exp(-t / decay)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(d * SR))
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, d, detune=0.0):
    t = t_(d); ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))
def sweep(f0, f1, d, curve=4.0):
    t = t_(d); f = f1 + (f0 - f1) * np.exp(-t * curve / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


drums = np.zeros(N); music = np.zeros(N); sfx = np.zeros(N); duck = np.ones(N)
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i < 0: x, i = x[-i:], 0
    j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i] * g


# ---------------- instruments
def kick(big=False):
    d = 0.5 if big else 0.32
    t = t_(d); f = 42 + 150 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.22 if big else 0.11))
    click = hp(noise(0.01), 2000) * env(0.01, 0.0005, 0.003) * 0.6
    body[:len(click)] += click
    return np.tanh(body * 1.6)
def heartbeat(): return lp(kick(), 180) * 1.4
def clap():
    x = np.zeros(int(0.25 * SR))
    for k, o in enumerate([0, 0.011, 0.022]):
        add_ = hp(bp(noise(0.25), 900, 4000), 300) * env(0.25, 0.001, 0.012 if k < 2 else 0.09)
        i = int(o * SR); x[i:] += add_[:len(x) - i]
    return x * 0.9
def hat(open_=False): return hp(noise(0.15), 8000, 4) * env(0.15, 0.0005, 0.06 if open_ else 0.016) * 0.55
def snare():
    x = hp(noise(0.18), 1500) * env(0.18, 0.001, 0.05) * 0.8
    tone = sweep(260, 180, 0.12, 3) * env(0.12, 0.001, 0.04) * 0.5
    x[:len(tone)] += tone
    return x
def crash(d=1.8): return hp(noise(d), 4500, 2) * env(d, 0.002, d / 3.5) * 0.5
def boom(d=1.6):
    return np.tanh(sweep(140, 30, d, 5) * env(d, 0.002, d / 2.5) * 2.2) * 0.9
def zap(): return sweep(1800, 160, 0.14, 5) * env(0.14, 0.001, 0.05) * 0.35
def bloop(f0=300, f1=900): return sweep(f0, f1, 0.12, 5) * env(0.12, 0.002, 0.035) * 0.5
def whoosh(d=0.6, rev=False):
    x = bp(noise(d), 600, 6000) * np.sin(np.pi * np.linspace(0, 1, int(d * SR))) ** 2
    if rev: x = x * np.linspace(0, 1, len(x)) ** 2
    return x * 0.45
def riser(d, f0=180, f1=2400):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    nz = hp(noise(d), 1500) * 0.35
    return (tone + nz) * (t / d) ** 2
def crack():
    pop = hp(noise(0.02), 1500) * env(0.02, 0.0003, 0.004) * 1.4
    hiss = hp(noise(0.9), 3500, 3) * env(0.9, 0.004, 0.22) * 0.55
    x = hiss.copy(); x[:len(pop)] += pop
    return x
def can_open(snap_at=0.07):
    """A ring-pull can opening, built from its physical parts: tab lift click, score-line snap
    (broadband crack + thin-aluminium ring modes), the pressurised 'pssht', the tab settling
    back, then a decaying shower of micro-bubble pops. A short room tail glues it together."""
    d = snap_at + 2.4
    x = np.zeros(int(d * SR))
    def put(sig, at, g=1.0):
        i = int(at * SR); j = min(len(x), i + len(sig)); x[i:j] += sig[:j - i] * g
    def modes(freqs, dec, g):
        t = t_(0.08)
        return sum(np.sin(2 * np.pi * f * t + rng.random() * 6) * np.exp(-t / dc) * a for f, dc, a in zip(freqs, dec, g))
    # 1. finger lifts the tab: a dry tick and a little metal creak
    put(hp(noise(0.006), 2500) * env(0.006, 0.0002, 0.0012), 0, 0.45)
    creak = bp(noise(snap_at), 900, 2600) * np.linspace(0.02, 0.12, int(snap_at * SR))
    put(creak, 0)
    # 2. the score breaks
    put(hp(noise(0.004), 1200) * env(0.004, 0.0001, 0.0009), snap_at, 1.6)
    put(modes([2870, 4310, 5990, 7420, 9810], [0.012, 0.009, 0.007, 0.005, 0.004], [0.5, 0.45, 0.35, 0.3, 0.2]), snap_at, 0.9)
    tp = t_(0.03); put(np.sin(2 * np.pi * np.cumsum(170 - 2400 * tp) / SR) * np.exp(-tp / 0.008), snap_at, 0.35)  # small thump
    # 3. pssht: pressure release, bright then darkening
    dl = 0.75; n = int(dl * SR); tt = t_(dl)
    bright = bp(noise(dl), 3200, 11000); dark = bp(noise(dl), 1400, 6000)
    mixk = np.clip(tt / 0.35, 0, 1)
    gas = (bright * (1 - mixk) + dark * mixk) * np.minimum(1, tt / 0.004) * (0.75 * np.exp(-tt / 0.045) + 0.35 * np.exp(-tt / 0.22))
    put(gas, snap_at, 1.25)
    # 4. tab drops back onto the lid
    put(hp(noise(0.004), 2000) * env(0.004, 0.0002, 0.001), snap_at + 0.17, 0.5)
    put(modes([3300, 5200, 8100], [0.006, 0.004, 0.003], [0.3, 0.2, 0.15]), snap_at + 0.17, 0.5)
    # 5. fizz: Poisson shower of micro-bubble pops
    t, end = 0.0, d - snap_at - 0.05
    while t < end:
        rate = 2200 * np.exp(-t / 0.45) + 260 * np.exp(-t / 1.4) + 30
        t += rng.exponential(1 / rate)
        f0 = 2800 + rng.random() * 9000; dc = 0.0004 + rng.random() * 0.0016
        k = int(dc * 6 * SR); tk = np.arange(k) / SR
        pop = np.sin(2 * np.pi * f0 * tk) * np.exp(-tk / dc) * min(1.0, rng.lognormal(-2.2, 0.6))
        put(pop, snap_at + 0.02 + t, 0.55 * (0.4 + 0.6 * np.exp(-t / 1.2)))
    hiss = hp(noise(end), 5500, 3) * np.exp(-t_(end) / 0.7)
    put(hiss, snap_at + 0.03, 0.05)
    # 6. small room
    ir = rng.standard_normal(int(0.12 * SR)) * np.exp(-t_(0.12) / 0.025)
    ir[0] = 6.0
    wet = np.convolve(x, ir)[:len(x)]
    return (x + 0.12 * wet / np.max(np.abs(ir))) * 0.9

def fizz(d, g=0.25):
    x = hp(noise(d), 5000, 3)
    crackle = (rng.random(int(d * SR)) > 0.9993) * rng.standard_normal(int(d * SR)) * 3
    return (x * 0.3 + hp(crackle, 3000)) * g


def stab(notes, d=0.35, bright=1.0):
    x = np.zeros(int(d * SR))
    for m in notes:
        for dt in (-0.006, 0, 0.007):
            x += saw(mtof(m), d, dt)
    x = lp(x, 1800 + 3000 * bright, 2) * env(d, 0.003, d * 0.4)
    return x / (len(notes) * 3) * 0.9
def bass_note(m, d):
    x = lp(saw(mtof(m), d) + 0.6 * np.sin(2 * np.pi * mtof(m) * t_(d)), 420, 3)
    return x * env(d, 0.004, d * 0.7) * 0.75


# A minor: Am - F - C - G, one chord per bar
PROG = [(45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
beat = 12

# ---------------- 0–48: dark heartbeat, crack
for f in [0, 8, 24, 32]:
    add(drums, heartbeat(), fr(f), 0.9)
drone = lp(saw(mtof(33), 1.6) + saw(mtof(45), 1.6, 0.004), 300) * np.linspace(0.05, 0.35, int(1.6 * SR))
add(music, drone, 0)
add(sfx, fizz(0.7, 0.2) * np.linspace(0, 1, int(0.7 * SR)) ** 2, fr(26))
add(sfx, can_open(0.07), fr(46.5) - 0.07, 1.0)  # snap lands just before the hit
def beep(): return np.sin(2 * np.pi * 988 * t_(0.09)) * env(0.09, 0.002, 0.05) * 0.25
def plink(f0=1400): return sweep(f0 * 0.6, f0, 0.08, 6) * env(0.08, 0.001, 0.025) * 0.4
for f in [0, 8, 24, 32]:
    add(sfx, beep(), fr(f) + 0.02)
    add(sfx, plink(1300 + f * 10), fr(f + 7))
add(sfx, sweep(900, 200, 0.4, 3) * env(0.4, 0.01, 0.2) * 0.3, fr(38))  # the big drop falls

# ---------------- big hits on scene changes
for f in [48, 624]:
    add(sfx, boom(1.8), fr(f), 1.0); add(sfx, crash(2.2), fr(f), 0.9)
for f in [96, 192, 288, 336, 384, 480]:
    add(sfx, boom(0.9), fr(f), 0.6); add(sfx, crash(1.2), fr(f), 0.55)
for f in [96, 192, 288, 384, 480]:
    add(sfx, whoosh(0.45, rev=True), fr(f) - 0.45, 0.8)

# ---------------- groove 48–576
def groove(f0, f1, hats16=False, chords=True):
    for f in range(f0, f1, beat):
        k = (f - 48) // beat
        bar = (f - 48) // 48
        root, chord = PROG[bar % 4]
        add(drums, kick(big=(k % 4 == 0)), fr(f), 1.0)
        dk = int(fr(f) * SR); dl = int(0.22 * SR)
        duck[dk:dk + dl] = np.minimum(duck[dk:dk + dl], 0.25 + 0.75 * np.linspace(0, 1, len(duck[dk:dk + dl])) ** 1.5)
        if k % 2 == 1: add(drums, clap(), fr(f), 0.8)
        add(drums, hat(open_=True), fr(f + 6), 0.6)
        if hats16:
            add(drums, hat(), fr(f + 3), 0.5); add(drums, hat(), fr(f + 9), 0.5)
        # bass: octave bounce on 8ths
        add(music, bass_note(root, 0.19), fr(f), 1.0)
        add(music, bass_note(root + 12, 0.19), fr(f + 6), 0.8)
        if chords and k % 4 in (0, 2):
            add(music, stab(chord, 0.3, 1.0), fr(f + (0 if k % 4 == 0 else 6)), 0.7)
        if chords and k % 4 == 3:
            add(music, stab([n + 12 for n in chord[:2]], 0.15, 1.2), fr(f + 9), 0.4)

groove(48, 480, hats16=False)
# fizz section gets 16th hats on top
for f in range(384, 480, beat):
    add(drums, hat(), fr(f + 3), 0.45); add(drums, hat(), fr(f + 9), 0.45)
# strobe: groove keeps going with an accelerating snare roll and a riser
groove(480, 576, hats16=True)
for f in range(480, 528, 6): add(drums, snare(), fr(f), 0.5)
for f in range(528, 552, 3): add(drums, snare(), fr(f), 0.55)
for f in np.arange(552, 576, 1.5): add(drums, snare(), fr(f), 0.6)
add(sfx, riser(3.2), fr(480), 0.9)

# ---------------- per-scene accents
for f in range(56, 96, beat): add(sfx, whoosh(0.12) * 0.6, fr(f))      # eyes snap to a new direction
add(sfx, hp(noise(0.03), 2000) * env(0.03, 0.0005, 0.008) * 0.9, fr(199))  # pack lid flips
def chime(f0): return sum(np.sin(2 * np.pi * f0 * k * t_(0.5)) / k for k in (1, 2.76, 5.4)) * env(0.5, 0.002, 0.12) * 0.12
for i, f in enumerate(range(288, 384, beat // 2)): add(sfx, chime([2093, 2637, 3136, 3520][i % 4]), fr(f), 0.8)
for f in range(96, 192, beat): add(sfx, zap(), fr(f), 1.0)          # word stamps
for i, f in enumerate(range(216, 288, beat)):                      # grid multiplies
    add(sfx, bloop(250 + i * 60, 800 + i * 160), fr(f), 0.9)
add(sfx, whoosh(0.5), fr(330), 1.0)                                  # gravity flip
for f in range(480, 564, 6): add(sfx, zap() * 0.5, fr(f), 0.6)     # strobe cards

# ---------------- 576–624: silence, one bubble, suck-in
def clink():
    d = 1.2; t = t_(d)
    return sum(np.sin(2 * np.pi * fq * t) * np.exp(-t / dc) * g for fq, dc, g in [(2310, 0.35, 1), (3170, 0.25, 0.7), (4720, 0.18, 0.5), (6230, 0.1, 0.35)]) * 0.35
add(sfx, clink(), fr(596))
add(sfx, fizz(1.0, 0.08), fr(578))
rev = crash(1.4)[::-1] * 1.2
add(sfx, rev, fr(624) - len(rev) / SR)
add(sfx, riser(0.6, 120, 900) * 0.8, fr(606))

# ---------------- 624–720: final slam + outro
root, chord = PROG[0]
add(music, stab(chord + [45 + 24], 2.0, 1.4) * 1.2, fr(624))
add(music, bass_note(33, 1.5) * 1.3, fr(624))
for f in range(624 + beat * 2, 684, beat):  # groove drops out so the can opening is heard
    k = (f - 624) // beat
    add(drums, kick(), fr(f), 0.8)
    if k % 2 == 1: add(drums, clap(), fr(f), 0.55)
    add(drums, hat(open_=True), fr(f + 6), 0.4)
    add(music, bass_note(33 if k < 4 else 41, 0.19), fr(f), 0.8)
for i, f in enumerate([630, 636, 648, 660, 664]):  # end-card text pops
    add(sfx, bloop(400 + 80 * i, 1200 + 120 * i) * 0.8, fr(f))
add(sfx, can_open(0.2), fr(696) - 0.2, 1.15)  # the hero can's tab: lift from 690, snap on 696
add(sfx, boom(1.0) * 0.7, fr(708)); add(sfx, crash(1.0) * 0.6, fr(708))

# ---------------- mix
mix = drums * 0.9 + music * duck * 0.8 + sfx * 0.85
mix = np.tanh(mix * 1.3) / np.tanh(1.3)
fade = int(0.25 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
mix = mix / np.max(np.abs(mix)) * 0.95
stereo = np.stack([mix, np.roll(mix, 12) * 0.98 + mix * 0.02], axis=1)  # tiny width
sf.write(sys.argv[1], stereo, SR, subtype='PCM_16')
print('wrote', sys.argv[1], f'{len(mix) / SR:.2f}s')
