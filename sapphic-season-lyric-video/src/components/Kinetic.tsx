import { interpolate, spring } from 'remotion';
import { adlibFlags, Kind, Line, pulse } from '../data';
import { HAND, SERIF } from '../fonts';
import { CREAM } from '../theme';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '');
const KEY = new Set(('sapphic season october pretty normal gone girls girl sweaters boots hey heart hearts kiss crush religious universe ' +
  'vibe cute brave bolder love smile single rings menace evaporated coffee playlist playlists bets fifty bell phone help roots truth').split(' '));
const HOT = ['#FFD23F', '#FF8FC7', '#FFB35C'];

// Greedy rows of roughly equal length, so long lines stack into a tidy block.
const rows = (words: string[]) => {
  const total = words.join(' ').length;
  const n = Math.max(1, Math.ceil(total / 17));
  const target = total / n;
  const out: number[][] = [[]];
  let len = 0;
  words.forEach((w, i) => {
    if (len > 0 && len + w.length / 2 > target && out.length < n) { out.push([]); len = 0; }
    out[out.length - 1].push(i);
    len += w.length + 1;
  });
  return out;
};

const Underline: React.FC<{ p: number; color: string; seed: number }> = ({ p, color, seed }) => (
  <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: 'absolute', left: '-4%', width: '108%', bottom: '-0.12em', height: '0.32em', overflow: 'visible' }}>
    <path d={seed % 2 ? 'M2,12 C20,4 35,18 52,9 S82,4 98,11' : 'M2,8 C18,16 40,2 58,11 S86,15 98,7'} fill="none" stroke={color}
      strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} vectorEffect="non-scaling-stroke" />
  </svg>
);

// Kinetic lyric block: words spring in on their sung time; key words get colour, size and a drawn underline.
export const Kinetic: React.FC<{ line: Line; t: number; kind: Kind; fps: number; shout?: boolean }> = ({ line, t, kind, fps, shout }) => {
  const loud = kind === 'chorus' || kind === 'final' || kind === 'post' || shout;
  const words = line.words.map((w) => w.w);
  const layout = rows(words);
  const widest = Math.max(...layout.map((r) => r.map((i) => words[i]).join(' ').length));
  const size = Math.min(shout ? 200 : loud ? 136 : 112, 1450 / (widest * 0.56));
  const exit = interpolate(t, [line.end - 0.2, line.end + 0.08], [0, 1], clamp);
  const adlib = adlibFlags(line.words);
  const p = loud ? pulse(t) : 0;
  const ink = kind === 'post' ? '#6B1048' : '#5A0B2E';
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: 1 - exit, filter: `blur(${exit * 10}px)`,
      transform: `translateY(${-exit * 80}px) scale(${(1 - exit * 0.08) * (1 + 0.03 * p)}) rotate(${shout ? Math.sin(t * 38) * 1.2 * p : 0}deg)`,
    }}>
      {layout.map((row, r) => (
        <div key={r} style={{ display: 'flex', alignItems: 'baseline', transform: `translateX(${layout.length > 1 ? (r % 2 ? 1 : -1) * size * 0.35 : 0}px)`, lineHeight: 1.02 }}>
          {row.map((i) => {
            const w = line.words[i];
            const key = KEY.has(norm(w.w)) && !adlib[i];
            const s = spring({ frame: Math.round((t - w.s + 0.08) * fps), fps, config: { damping: 12, stiffness: 190, mass: 0.7 } });
            const shown = t >= w.s - 0.08;
            const hot = HOT[i % HOT.length];
            const fs = adlib[i] ? size * 0.78 : key ? size * 1.18 : size;
            const ul = interpolate(t, [w.s + 0.05, w.s + 0.4], [0, 1], clamp);
            const tilt = ((i * 37) % 9) - 4;
            return (
              <span key={i} style={{
                position: 'relative', display: 'inline-block', margin: `0 ${size * 0.14}px`,
                fontFamily: adlib[i] ? HAND : SERIF, fontWeight: adlib[i] ? 700 : 900, fontSize: fs,
                fontStyle: key ? 'italic' : 'normal', fontVariationSettings: '"SOFT" 100, "WONK" 1',
                color: adlib[i] ? '#FFD1E8' : key ? hot : CREAM,
                opacity: shown ? Math.min(1, s * 1.6) : 0,
                transform: `translateY(${(1 - s) * size * 0.55}px) rotate(${(1 - s) * tilt * 3 + (adlib[i] ? -5 : 0)}deg) scale(${0.55 + 0.45 * s})`,
                WebkitTextStroke: loud && !adlib[i] ? `${size * 0.045}px ${ink}` : undefined,
                paintOrder: 'stroke fill',
                textShadow: loud
                  ? `${size * 0.055}px ${size * 0.065}px 0 ${ink}`
                  : `0 0 ${key ? 34 : 18}px rgba(255,170,90,0.45), 0 6px 22px rgba(0,0,0,0.45)`,
              }}>
                {w.w}
                {key && !loud && <Underline p={ul} color={hot} seed={i} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
