# Per-frame loudness (full band and bass) at 30 fps, normalised 0..1, for beat-reactive visuals.
# Usage: python energy.py <mp3> <out.json>
import sys, json, subprocess
import numpy as np
FPS, SR = 30, 22050
def pcm(filt=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', str(SR)] + (['-af', filt] if filt else []) + ['-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32)
def env(x):
    hop = SR // FPS
    r = np.sqrt([np.mean(x[i:i + hop] ** 2) + 1e-12 for i in range(0, len(x), hop)])
    r = r / np.percentile(r, 98)
    return np.clip(r, 0, 1)
full, bass = env(pcm()), env(pcm('lowpass=f=150,lowpass=f=150'))
# Onset-ish kick signal: positive bass change, normalised.
kick = np.clip(np.diff(bass, prepend=0), 0, None); kick = np.clip(kick / np.percentile(kick, 99), 0, 1)
json.dump({'fps': FPS, 'full': [round(float(v), 3) for v in full], 'kick': [round(float(v), 3) for v in kick]}, open(sys.argv[2], 'w'))
print(len(full), 'frames')
