import { interpolate, Easing, spring } from 'remotion';
import { Line, loudness } from '../data';
import { SANS } from '../fonts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// A generic messaging screen for the spoken voice-note intro and the outro.
// Each line arrives as a bubble whose words fill in as they're spoken.
export const Phone: React.FC<{ t: number; lines: Line[]; show: [number, number]; header: string; fps: number }> = ({ t, lines, show, header, fps }) => {
  const inn = spring({ frame: Math.round((t - show[0]) * fps), fps, config: { damping: 16 } });
  const out = interpolate(t, [show[1] - 0.5, show[1]], [0, 1], clamp);
  const speaking = lines.some((l) => t >= l.start && t < l.end);
  return (
    <div
      style={{
        position: 'absolute', right: 230, top: 90, width: 520, height: 900, borderRadius: 64,
        background: '#0E0A14', border: '10px solid #2B2236', boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 2px #4A3B5C inset',
        overflow: 'hidden', fontFamily: SANS,
        opacity: 1 - out, transform: `translateY(${(1 - inn) * 900 + out * 1100}px) rotate(${(1 - inn) * 8 + 3}deg)`,
      }}
    >
      <div style={{ height: 130, background: '#1A1324', display: 'flex', alignItems: 'flex-end', padding: '0 34px 22px', gap: 18, borderBottom: '1px solid #2E2440' }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: 'linear-gradient(135deg,#EF7627,#D162A4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 30 }}>♡</div>
        <div>
          <div style={{ color: '#F4ECF7', fontSize: 30, fontWeight: 700 }}>{header}</div>
          <div style={{ color: '#9C8AAE', fontSize: 22 }}>{speaking ? 'recording voice note…' : 'online'}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 26, right: 26, bottom: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {lines.map((l, i) => {
          const a = spring({ frame: Math.round((t - l.start + 0.15) * fps), fps, config: { damping: 14 } });
          if (t < l.start - 0.15) return null;
          return (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: 420, transform: `scale(${a})`, transformOrigin: 'bottom right' }}>
              <div style={{ background: 'linear-gradient(135deg,#EF7627,#D162A4)', color: '#fff', borderRadius: '30px 30px 8px 30px', padding: '18px 24px', fontSize: 31, lineHeight: 1.25, fontWeight: 500 }}>
                {l.words.map((w, j) => (
                  <span key={j} style={{ opacity: interpolate(t, [w.s - 0.05, w.s + 0.1], [0.28, 1], clamp) }}>{w.w} </span>
                ))}
              </div>
            </div>
          );
        })}
        {speaking && <Wave t={t} />}
      </div>
    </div>
  );
};

const Wave: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 5, alignItems: 'center', height: 50, padding: '0 20px', background: '#241A30', borderRadius: 25 }}>
    {Array.from({ length: 22 }).map((_, i) => (
      <div key={i} style={{ width: 6, borderRadius: 3, background: '#FF9A56', height: 8 + 34 * loudness(t - i * 0.03) * (0.5 + 0.5 * Math.abs(Math.sin(i * 1.7 + t * 9))) }} />
    ))}
  </div>
);
