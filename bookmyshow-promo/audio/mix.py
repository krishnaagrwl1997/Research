# Builds the soundtrack: Kernel's voice lines + an original synthesized music bed + sfx, from timeline.json.
# Usage: python mix.py <out.wav>
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, 'timeline.json')))
N = int((tl['duration'] + 1.0) * SR)
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.005, decay=0.2): t = t_(d); return np.minimum(1, t / a) * np.exp(-t / decay)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(d * SR))
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, d):
    t = t_(d); return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 9))
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i < 0: x, i = x[-i:], 0
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * g

# ---------- instruments ----------
def kick():
    t = t_(0.35); f = 45 + 110 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
def clap(): return hp(bp(noise(0.2), 900, 3000) * env(0.2, .001, .05), 400) * 1.2
def hat(o=False): return hp(noise(0.12), 7000) * env(0.12, .001, .05 if o else .018) * 0.6
def bass(m, d): x = lp(saw(mtof(m), d), 600) * env(d, .004, d * .45); return x * 0.5
def stab(ms, d=0.22):
    x = sum(saw(mtof(m) * (1 + det), d) for m in ms for det in (-0.004, 0.004))
    return lp(x, 2400) * env(d, .003, .08) * 0.12
def bell(m, d=0.5):
    t = t_(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t)) * env(d, .002, .14) * 0.25

CHORDS = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]  # C G Am F
BPM = 118; beat = 60 / BPM; bar = 4 * beat

def music():
    secs = tl['music'] + [[tl['duration'] + 1, 'end']]
    out = np.zeros(N)
    for (start, mode), (end, _) in zip(secs[:-1], secs[1:]):
        if mode == 'off': continue
        if mode == 'trailer':
            out_t = np.zeros(int((end - start + 2) * SR))
            t = t_(end - start + 1.5)
            drone = (np.sin(2 * np.pi * 55 * t) + .5 * np.sin(2 * np.pi * 82.4 * t)) * np.minimum(1, t / .4) * np.exp(-t / 3)
            add(out_t, lp(drone + 0.15 * noise(len(t) / SR), 300) * 0.12, 0)
            add(out, out_t, start); continue
        if mode == 'outro':
            ch = CHORDS[0]
            add(out, kick(), start, 1.0)
            for m in ch[1] + [72]: add(out, lp(saw(mtof(m), 2.5), 1800) * env(2.5, .005, .9) * 0.09, start)
            add(out, bass(36, 2.0) * 1.2, start)
            add(out, hp(noise(2.0), 5000) * env(2.0, .002, .5) * 0.25, start)
            continue
        n = int(np.ceil((end - start) / beat))
        for b in range(n):
            at = start + b * beat
            if at >= end: break
            ci = int(((at) // bar)) % 4; root, ch = CHORDS[ci]
            add(out, kick(), at, 0.9 if mode == 'full' else 0.0)
            if mode == 'full' and b % 2 == 1: add(out, clap(), at, 0.55)
            add(out, hat(), at + beat / 2, 0.5)
            if mode == 'full': add(out, hat(), at + beat / 4 * 3, 0.25)
            add(out, bass(root - 12 + (12 if b % 2 else 0), beat * .9), at, 1.0 if mode == 'full' else 0.7)
            add(out, stab(ch), at + beat / 2, 1.0)
            if mode == 'full':
                arp = ch + [ch[0] + 12]
                add(out, bell(arp[b % 4] + 12), at + beat / 4, 0.5)
    return out

# ---------- sfx ----------
def whoosh():
    d = 0.45; t = t_(d); x = noise(d); sh = np.sin(np.pi * t / d) ** 2
    return bp(x, 500, 4000) * sh * 0.35
def beep(): t = t_(0.14); return np.sin(2 * np.pi * 1000 * t) * env(0.14, .002, .1) * 0.35
def projector():
    out = np.zeros(int(1.6 * SR))
    for k in range(int(1.6 * 24)): add(out, hp(noise(0.012), 2000) * env(0.012, .0005, .004), k / 24, 0.25)
    return out + lp(noise(1.6), 400) * 0.05
def pop():
    t = t_(0.12); f = 300 + 900 * t / 0.12
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.12, .002, .05) * 0.5
def boom(f0=48):
    t = t_(2.2); x = np.sin(2 * np.pi * f0 * t) * np.exp(-t / .7) + lp(noise(2.2), 200) * np.exp(-t / .3) * .6
    return x * 0.9
def poofs():
    out = np.zeros(int(1.8 * SR))
    for k in range(14): add(out, bp(noise(0.08), 1500, 6000) * env(0.08, .002, .03), rng.random() * 1.6, 0.25)
    return out
def ping():
    t = t_(0.25); x = np.sin(2 * np.pi * 1318.5 * t) * env(.25, .002, .06)
    add(x, np.sin(2 * np.pi * 1760 * t_(.2)) * env(.2, .002, .08), 0.07); return x * 0.22
def slam():
    return kick() * 0.8 + np.pad(lp(noise(0.3), 1200) * env(0.3, .002, .06) * .5, (0, int(.05 * SR)))[:len(kick())]
def swish(): d = .3; t = t_(d); return hp(noise(d), 1500) * np.sin(np.pi * t / d) ** 3 * 0.18
def flick(): return bp(noise(0.05), 2000, 8000) * env(.05, .001, .012) * 0.5
def ding():
    out = np.zeros(int(1.0 * SR))
    for m, dt in ((84, 0), (88, 0.08)): add(out, bell(m, 0.9) * 1.6, dt)
    return out
def blip(m=81): t = t_(0.1); return np.sin(2 * np.pi * mtof(m) * t) * env(.1, .002, .035) * 0.3
def lock(): return blip(76) + np.pad(blip(88), (int(.06 * SR), 0))[:len(blip(76))]
def sparkle():
    out = np.zeros(int(1.0 * SR))
    for k in range(10): add(out, bell(96 + rng.integers(0, 12), 0.4) * 0.8, k * 0.06)
    return out
def tap(): return hp(noise(0.02), 1500) * env(.02, .0005, .004) * 0.8
def success():
    out = np.zeros(int(1.0 * SR))
    for k, m in enumerate((72, 76, 79, 84)): add(out, bell(m + 12, .6) * 1.4, k * 0.07)
    return out
def fall():
    t = t_(0.55); f = 1300 * np.exp(-t * 2.2)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / .02) * 0.25
    add(x, pop() * 0.8, 0.5) if len(x) > int(.5 * SR) else None; return np.concatenate([x, pop() * .6])
def scratch():
    t = t_(0.45); f = 220 + 900 * np.abs(np.sin(2 * np.pi * 3.2 * t))
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.25 + bp(noise(.45), 800, 3000) * .5
    return lp(x, 3500) * np.minimum(1, t / .01) * np.exp(-t / .25) * 0.5
def steps():
    out = np.zeros(int(2.2 * SR))
    for k in range(7): add(out, lp(noise(0.06), 900) * env(.06, .002, .02), k * 0.3, 0.5)
    return out
def scan(): t = t_(0.3); return (np.sin(2 * np.pi * 1760 * t) * (t < .12) + np.sin(2 * np.pi * 2349 * t) * (t > .14)) * env(.3, .002, .5) * 0.25
def crowd(d, swell=0.4, decay=1.0):
    t = t_(d); x = np.zeros(len(t))
    for k in range(10):
        am = 0.5 + 0.5 * np.sin(2 * np.pi * (3 + rng.random() * 5) * t + rng.random() * 6)
        x += bp(noise(d), 300 + rng.random() * 600, 1500 + rng.random() * 2500) * am
    return x / 10 * np.minimum(1, t / swell) * np.exp(-np.maximum(0, t - swell) / decay) * 1.6
def flashes():
    out = np.zeros(int(2.0 * SR))
    for k in range(6): add(out, tap() * .6 + np.pad(hp(noise(.08), 3000) * env(.08, .001, .03) * .3, (0, 0))[:len(tap())], rng.random() * 1.8)
    return out
def curtain(): d = 1.0; t = t_(d); return lp(noise(d), 900) * np.sin(np.pi * t / d) ** 2 * 0.3
def hit(): return np.zeros(1)  # carried by the 'outro' music section

SFX = {'whoosh': whoosh, 'beep': beep, 'projector': projector, 'pop': pop, 'stab': lambda: stab([60, 64, 67], .4) * 4,
       'boom': lambda: boom(48), 'boom2': lambda: boom(41), 'poofs': poofs, 'ping': ping, 'slam': slam, 'swish': swish,
       'flick': flick, 'ding': ding, 'blip': blip, 'blip2': lambda: blip(84), 'lock': lock, 'sparkle': sparkle, 'tap': tap,
       'success': success, 'fall': fall, 'scratch': scratch, 'steps': steps, 'scan': scan, 'cheer': lambda: crowd(2.2, .3, .8),
       'flashes': flashes, 'curtain': curtain, 'hit': hit, 'applause': lambda: crowd(3.0, .25, 1.2) * .8}

# ---------- assemble ----------
voice = np.zeros(N)
for v in tl['voice']:
    y, sr = sf.read(os.path.join(here, v['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    assert sr == SR, sr
    add(voice, y / (np.max(np.abs(y)) + 1e-9) * 0.8, v['at'])
fx = np.zeros(N)
for at, name in tl['sfx']: add(fx, SFX[name](), at)
mus = music()
# duck the music under the voice
e = np.abs(voice); k = int(0.12 * SR); e = np.convolve(e, np.ones(k) / k, 'same')
duck = 1 - 0.65 * np.clip(e / 0.05, 0, 1)
mus = mus / (np.percentile(np.abs(mus), 99.5) + 1e-9) * 0.42 * duck
mix = voice + mus + fx * 0.55
mix = np.tanh(mix * 1.1) * 0.95
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'build', 'soundtrack.wav')
sf.write(out, np.stack([mix, mix], 1), SR)
print('wrote', out, round(len(mix) / SR, 2), 's')
