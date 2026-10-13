import { interpolate, Easing } from 'remotion';
import { Line } from '../data';
import { HAND, SERIF } from '../fonts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// The bridge is written as a note to the universe. When the singer takes it back ("scratch that"),
// the first page gets scribbled out and a second page slides in.
export const Letter: React.FC<{ t: number; lines: Line[]; end: number }> = ({ t, lines, end }) => {
  const page1 = lines.slice(0, 4);
  const page2 = lines.slice(4);
  const flip = page2[0].start;
  const scribble = interpolate(t, [flip - 0.1, flip + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const slide = interpolate(t, [flip + 0.4, flip + 1.1], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const inn = interpolate(t, [lines[0].start - 0.9, lines[0].start - 0.1], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const out = interpolate(t, [end - 0.6, end], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <Page lines={page1} t={t} style={{ transform: `translate(${-slide * 1500}px, ${(1 - inn) * 1100}px) rotate(${-2 - slide * 14}deg)` }}>
        <svg width={1240} height={600} style={{ position: 'absolute', left: 60, top: 150 }}>
          <path
            d="M10,60 C300,0 500,140 820,40 S1150,120 1220,60 M20,180 C320,110 600,260 900,160 S1180,230 1230,180 M10,300 C330,230 620,380 950,270 S1190,350 1230,300 M20,420 C300,350 640,500 960,390 S1180,470 1230,430"
            fill="none" stroke="#C2185B" strokeWidth={14} strokeLinecap="round"
            strokeDasharray={5200} strokeDashoffset={5200 * (1 - scribble)} opacity={0.85}
          />
        </svg>
      </Page>
      {t > flip && (
        <Page lines={page2} t={t} style={{ transform: `translate(${(1 - slide) * 1500}px, 0) rotate(${1.5 + (1 - slide) * 10}deg)` }} />
      )}
    </div>
  );
};

const Page: React.FC<{ lines: Line[]; t: number; style: React.CSSProperties; children?: React.ReactNode }> = ({ lines, t, style, children }) => (
  <div
    style={{
      position: 'absolute', left: 300, top: 150, width: 1320, height: 780, borderRadius: 14,
      background: 'repeating-linear-gradient(180deg, #FFF8EE 0 92px, #E7C9D8 92px 94px)', boxShadow: '0 50px 120px rgba(0,0,0,0.55)',
      padding: '70px 90px 0 110px', boxSizing: 'border-box', ...style,
    }}
  >
    <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 3, background: '#F19CBB' }} />
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: '#3A1340', height: 94, lineHeight: '94px', whiteSpace: 'nowrap' }}>
        {l.words.map((w, j) => {
          const a = interpolate(t, [w.s - 0.1, w.s + 0.15], [0, 1], clamp);
          return (
            <span key={j} style={{ opacity: a, display: 'inline-block', transform: `translateY(${(1 - a) * 12}px)`, marginRight: 16 }}>{w.w}</span>
          );
        })}
      </div>
    ))}
    {children}
    <div style={{ position: 'absolute', right: 70, bottom: 26, fontFamily: SERIF, fontStyle: 'italic', fontSize: 26, color: '#9B6A8C' }}>
      {lines[0].start < 155 ? 'dear universe —' : 'p.s.'}
    </div>
  </div>
);
