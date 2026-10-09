# Generates Kernel's lines with Kokoro (voice af_heart), pitched up, plus a per-frame mouth envelope.
# Usage: python voice.py <kokoro_model_dir> <out_dir>
import sys, json, subprocess, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
mdir, out = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
lines = json.load(open(os.path.join(here, 'script.json')))
k = Kokoro(os.path.join(mdir, 'kokoro-v1.0.onnx'), os.path.join(mdir, 'voices-v1.0.bin'))
meta = []
for ln in lines:
    a, sr = k.create(ln['text'], voice='af_heart', speed=1.05, lang='en-us')
    raw = os.path.join(out, ln['id'] + '_raw.wav'); fin = os.path.join(out, ln['id'] + '.wav')
    sf.write(raw, a, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af',
                    'asetrate=24000*1.2,aresample=48000,atempo=0.9,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
                    '-ac', '1', fin], check=True)
    os.remove(raw)
    y, sr2 = sf.read(fin)
    hop = sr2 // 30
    env = [float(np.sqrt(np.mean(y[i:i + hop] ** 2))) for i in range(0, len(y), hop)]
    m = max(env) or 1
    meta.append({'id': ln['id'], 'text': ln['text'], 'dur': len(y) / sr2, 'mouth': [round(min(1, e / m * 1.6), 2) for e in env]})
json.dump(meta, open(os.path.join(out, 'voice.json'), 'w'))
for m in meta: print(m['id'], round(m['dur'], 2))
