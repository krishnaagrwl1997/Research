# Recognises the song in overlapping chunks with a sherpa-onnx zipformer and writes word timestamps.
# Usage: python asr_timestamps.py <16k mono wav> <zipformer model dir> <out.json>
import sys, json
import numpy as np, soundfile as sf, sherpa_onnx

wav, model, out = sys.argv[1:4]
audio, sr = sf.read(wav, dtype='float32')
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f'{model}/encoder-epoch-99-avg-1.int8.onnx', decoder=f'{model}/decoder-epoch-99-avg-1.onnx',
    joiner=f'{model}/joiner-epoch-99-avg-1.int8.onnx', tokens=f'{model}/tokens.txt', num_threads=4,
    decoding_method='modified_beam_search')

CH, HOP = 12.0, 8.0  # seconds; keep words whose start falls in the chunk's middle region
words = []
for start in np.arange(0, len(audio) / sr, HOP):
    s = rec.create_stream()
    s.accept_waveform(sr, audio[int(start * sr):int((start + CH) * sr)])
    rec.decode_stream(s)
    r = s.result
    cur = None
    for tok, t in zip(r.tokens, r.timestamps):
        t = float(t) + start
        if tok[:1] in ('▁', ' ') or cur is None:
            cur = {'w': tok.lstrip('▁ ').lower(), 's': round(t, 2)}
            words.append((start, cur))
        else:
            cur['w'] += tok.lower()
lo = lambda st: st + (CH - HOP) / 2 if st > 0 else 0
words = [w for st, w in words if lo(st) <= w['s'] < lo(st) + HOP and w['w']]
json.dump(words, open(out, 'w'))
print(len(words), 'words')
print(' '.join(w['w'] for w in words))
