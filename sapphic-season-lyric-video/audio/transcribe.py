# Word-level timestamps for the song with faster-whisper. Usage: python transcribe.py <mp3> <out.json> [model]
import sys, json
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else 'small.en', device='cpu', compute_type='int8')
segs, _ = m.transcribe(sys.argv[1], word_timestamps=True, vad_filter=False, beam_size=5, language='en',
                       initial_prompt=open(sys.argv[1].rsplit('/', 1)[0] + '/lyrics.txt').read()[:800])
words = [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2)} for s in segs for w in s.words]
json.dump(words, open(sys.argv[2], 'w'), indent=0)
print(len(words), 'words')
