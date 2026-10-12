# Aligns the lyric sheet to ASR word timestamps and writes src/lyrics.json (lines with per-word times).
# Usage: python align.py lyrics.txt asr_words.json duration out.json
import sys, json, re, difflib

lyr_path, asr_path, dur, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
norm = lambda w: re.sub(r"[^a-z0-9]", '', w.lower())

lines, section = [], ''
for raw in open(lyr_path).read().splitlines():
    raw = raw.strip()
    if not raw: continue
    if raw.startswith('['):
        section = raw.strip('[]').split('—')[0].strip().title()
        continue
    words = [w for w in raw.replace('—', ' ').split() if norm(w)]
    lines.append({'section': section, 'text': raw, 'words': [{'w': w} for w in words]})

flat = [w for l in lines for w in l['words']]
asr = json.load(open(asr_path))
m = difflib.SequenceMatcher(None, [norm(w['w']) for w in flat], [norm(a['w']) for a in asr], autojunk=False)
for a, b, n in m.get_matching_blocks():
    for k in range(n): flat[a + k]['s'] = asr[b + k]['s']

# Fuzzy pass: unmatched lyric word between anchors takes the closest-spelled ASR word in that window.
anch = [i for i, w in enumerate(flat) if 's' in w]
for i, w in enumerate(flat):
    if 's' in w: continue
    lo = max([flat[j]['s'] for j in anch if j < i], default=0)
    hi = min([flat[j]['s'] for j in anch if j > i], default=dur)
    cands = [a for a in asr if lo < a['s'] < hi]
    best = max(cands, key=lambda a: difflib.SequenceMatcher(None, norm(w['w']), norm(a['w'])).ratio(), default=None)
    if best and difflib.SequenceMatcher(None, norm(w['w']), norm(best['w'])).ratio() >= 0.6: w['s'], w['fz'] = best['s'], 1
# Hand-pinned line starts win; ASR anchors that contradict them are dropped.
ov = {int(k): v for k, v in json.load(open(asr_path.rsplit('/', 1)[0] + '/timing_overrides.json')).items() if k[0] != '_'}
idx = 0
for li, l in enumerate(lines):
    if li in ov:
        l['words'][0]['s'], l['words'][0]['fixed'] = ov[li], 1
        for w in l['words'][1:]: w.pop('s', None)
fixed = [i for i, w in enumerate(flat) if 'fixed' in w]
for i, w in enumerate(flat):
    if 's' in w and 'fixed' not in w:
        lo = max([flat[j]['s'] for j in fixed if j < i], default=-1)
        hi = min([flat[j]['s'] for j in fixed if j > i], default=dur)
        if not lo < w['s'] < hi: del w['s']
# Drop anchors that go backwards, then interpolate the rest.
last = -1
for w in flat:
    if 's' in w and w['s'] <= last: del w['s']
    elif 's' in w: last = w['s']
known = [i for i, w in enumerate(flat) if 's' in w]
for i, w in enumerate(flat):
    if 's' in w: continue
    p = max([j for j in known if j < i], default=None); q = min([j for j in known if j > i], default=None)
    if p is None: w['s'] = flat[q]['s'] - 0.3 * (q - i)
    elif q is None: w['s'] = flat[p]['s'] + 0.35 * (i - p)
    else: w['s'] = flat[p]['s'] + min((flat[q]['s'] - flat[p]['s']) / (q - p), 0.42) * (i - p)
    w['guess'] = 1
for i, w in enumerate(flat):
    nxt = flat[i + 1]['s'] if i + 1 < len(flat) else dur
    w['s'] = round(w['s'], 2); w['e'] = round(min(nxt, w['s'] + 0.6), 2)
for i, l in enumerate(lines):
    l['start'] = l['words'][0]['s']
    l['end'] = round(min(lines[i + 1]['words'][0]['s'] if i + 1 < len(lines) else dur, l['words'][-1]['e'] + 1.2), 2)
json.dump({'duration': dur, 'lines': lines}, open(out, 'w'), indent=1)
g = sum('guess' in w for w in flat)
print(f'{len(lines)} lines, {len(flat)} words, {len(flat) - g} timed from audio, {g} interpolated')
for l in lines:
    print(f"{l['start']:6.1f}-{l['end']:6.1f} {sum('guess' in w for w in l['words'])}/{len(l['words'])} {l['section'][:10]:10} {l['text'][:40]}")
