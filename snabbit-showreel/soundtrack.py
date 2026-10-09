# Synthesizes soundtrack.wav: 120 BPM, 20 s = 10 bars, with tails wrapped so the loop is seamless.
# Hits are placed on the same timestamps the animation uses in showreel.html.
import numpy as np, wave

SR, DUR, BEAT = 48000, 20.0, 0.5
N = int(SR * DUR)
out = np.zeros((N + SR * 3, 2))
rng = np.random.default_rng(7)

def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); sig = sig * gain
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    out[i:i + len(sig), 0] += sig[:len(out) - i] * l
    out[i:i + len(sig), 1] += sig[:len(out) - i] * r

def env(n, a, d):
    t = np.arange(n) / SR; return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)

def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y

def kick(big=False):
    n = int(SR * (0.9 if big else 0.45)); t = np.arange(n) / SR
    f = 48 + 130 * np.exp(-t * 32); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * env(n, .001, .35 if big else .16))

def noise(n): return rng.uniform(-1, 1, n)

def hat(open_=False):
    n = int(SR * (.18 if open_ else .05)); x = noise(n); x = x - lowpass(x, 7000)
    return x * env(n, .0005, .06 if open_ else .015)

def clap():
    n = int(SR * .3); x = noise(n); x = lowpass(x, 3500) - lowpass(x, 900)
    e = sum(env(n, .0005, .012) * (np.arange(n) >= int(SR * k * .011)) for k in range(3)) + env(n, .001, .08)
    return x * e * 1.6

def tone(f, dur, d, wave_='sine', a=.003):
    n = int(SR * dur); t = np.arange(n) / SR; ph = 2 * np.pi * f * t
    s = np.sin(ph) if wave_ == 'sine' else (2 * ((f * t) % 1) - 1)
    return s * env(n, a, d)

def whoosh(dur, up=True):
    n = int(SR * dur); x = noise(n); t = np.linspace(0, 1, n)
    x = lowpass(x, 2500) - lowpass(x, 300)
    shape = (t ** 2 if up else (1 - t) ** 2) * np.sin(np.pi * np.clip(t * (1 if up else 1), 0, 1)) ** .3
    return x * shape * 3

def riser(dur):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 200 * 2 ** (t / dur * 3); ph = 2 * np.pi * np.cumsum(f) / SR
    return (0.4 * np.sin(ph) + 0.6 * (lowpass(noise(n), 3000))) * (t / dur) ** 2

def thump():
    n = int(SR * .6); return np.tanh(3 * kick(True)[:n]) + lowpass(noise(n), 1200) * env(n, .001, .05) * 2

midi = lambda m: 440 * 2 ** ((m - 69) / 12)
# A minor - F - C - G, one chord per bar (2 s)
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [33, 29, 36, 31]

for b in range(40):
    t = b * BEAT; bar = b // 4
    breakdown = 16 <= t < 18 and b % 2 == 1   # half-time feel under the stamps
    if not breakdown: place(kick(big=(b == 0)), t, 1.0 if b else 1.2)
    if b % 4 in (1, 3) and t >= 2: place(clap(), t, .55)
    for k in (0.25,): place(hat(), t + k, .35, pan=.3)
    place(hat(open_=(b % 2 == 1)), t, .15, pan=-.3)
    # offbeat bass
    if t >= 2: place(lowpass(tone(midi(ROOTS[bar % 4]), .26, .2, 'saw'), 600), t + .25, .55)

# pad (wraps around the loop point)
for bar in range(10):
    n = int(SR * 2.2); tt = np.arange(n) / SR
    pad = sum(np.sin(2 * np.pi * midi(m) * tt + np.sin(2 * np.pi * .3 * tt) * .3) for m in CHORDS[bar % 4])
    place(pad * np.minimum(tt / .3, 1) * np.minimum((2.2 - tt) / .5, 1), bar * 2, .05)

# ---- sound design synced to picture
for i in range(32): place(tone(2400 if i % 4 == 0 else 1800, .03, .008), i * 1 / 32, .18)  # clock ticks in the hook
place(tone(880, .4, .12), .72, .25); place(tone(1320, .4, .1), .76, .18)                    # price sticker
place(riser(1.0), 1.0, .5); place(whoosh(1.0), 1.0, .8)                                       # zoom through the 0
for t in (2.25, 2.85, 3.35): place(whoosh(.18, up=False), t, .9, pan=.4)                      # strike-throughs
place(thump(), 3.5, .5)
place(whoosh(.4), 3.95, .8)                                                                    # panel sweep
place(whoosh(.3), 4.75, .7); place(thump(), 5.0, .5)                                           # shutter
place(tone(1600, .08, .03), 5.75, .5)                                                          # tap
for k in range(3): place(tone(midi(76 + 3 * k), .5, .15), 6.0 + k * .07, .2)                   # route found
for k, m in enumerate([72, 76, 79, 84]): place(tone(midi(m), .8, .25), 7.95 + k * .06, .28)    # arrival chime
place(whoosh(.45), 8.55, .9)                                                                   # iris
for i in range(6): place(tone(midi(67 + [0, 2, 4, 7, 9, 12][i]), .25, .07), 9.3 + i * .1, .3)  # tile pops
for i in range(6): place(tone(midi(84 + [0, 2, 4, 7, 9, 12][i]), .12, .04), 10.55 + i * .2, .2)
place(whoosh(.5), 12.2, .8)                                                                    # bars wipe
for i in range(60): place(tone(3000, .015, .004), 12.55 + i * .018 * (1 + i / 40), .12)        # odometer
for i in range(50): place(tone(2600 + i * 20, .015, .004), 13.6 + 1.1 * (i / 50) ** 1.6, .1)   # counter
place(tone(midi(88), .5, .15), 14.7, .25)
place(whoosh(.5), 15.5, .9); place(thump(), 16.0, .9)                                          # slam
for t in (16.25, 16.75, 17.25): place(thump(), t, .8)                                          # stamps
place(whoosh(.4), 17.72, .8)                                                                   # diagonal wipe
for k, m in enumerate([69, 72, 76, 81, 84]): place(tone(midi(m), 1.2, .4), 18.05 + k * .05, .2)  # logo
place(riser(.75), 19.25, .55); place(whoosh(.6), 19.4, .6)                                    # back to the hook

mix = out[:N].copy(); mix[:len(out) - N] += out[N:]   # wrap tails into the start
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) * .89
pcm = (mix * 32767).astype('<i2')
with wave.open('soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote soundtrack.wav', pcm.shape)
