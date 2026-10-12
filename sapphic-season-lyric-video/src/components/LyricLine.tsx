import { interpolate, Easing } from 'remotion';
import { adlibFlags, Kind, Line, pulse } from '../data';
import { HAND, SERIF } from '../fonts';
import { CREAM, LOOK } from '../theme';

const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// One sung line: the whole line appears dimmed, then each word lights up as it is sung.
export const LyricLine: React.FC<{ line: Line; t: number; kind: Kind; shout?: boolean }> = ({ line, t, kind, shout }) => {
  const loud = kind === 'chorus' || kind === 'final' || kind === 'post';
  const chars = line.text.length;
  const base = shout ? 190 : Math.max(76, Math.min(loud ? 132 : 118, 150 - chars * 1.55));
  const enter = interpolate(t, [line.start - 0.25, line.start + 0.2], [0, 1], { ...clamp, easing: ease });
  const exit = interpolate(t, [line.end - 0.25, line.end + 0.1], [0, 1], { ...clamp, easing: ease });
  const p = loud ? pulse(t) : 0;
  const adlib = adlibFlags(line.words);
  const accent = LOOK[kind].accent;
  return (
    <div
      style={{
        position: 'absolute', left: 160, right: 160, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * 60 - exit * 70}px) scale(${1 + 0.035 * p}) rotate(${shout ? Math.sin(t * 40) * 0.6 * p : 0}deg)`,
        filter: `blur(${(1 - enter) * 10 + exit * 8}px)`,
      }}
    >
      <div style={{ textAlign: 'center', lineHeight: 1.08, textWrap: 'balance' as never, maxWidth: 1600 }}>
        {line.words.map((w, i) => {
          const sung = interpolate(t, [w.s - 0.05, w.s + 0.12], [0, 1], clamp);
          const active = t >= w.s && t < w.e + 0.05;
          const pop = interpolate(t, [w.s - 0.05, w.s + 0.1, w.s + 0.35], [0, 1, 0], clamp);
          const isAd = adlib[i];
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', margin: `0 ${base * 0.13}px`,
                fontFamily: isAd ? HAND : SERIF,
                fontWeight: isAd ? 700 : loud ? 900 : 700,
                fontStyle: !isAd && (loud || shout) && i % 4 === 1 ? 'italic' : 'normal',
                fontSize: isAd ? base * 0.85 : base,
                fontVariationSettings: '"SOFT" 100, "WONK" 1',
                color: isAd ? '#FFD1E8' : sung > 0.5 ? (active && !loud ? accent : CREAM) : loud ? '#FFE3CF' : CREAM,
                opacity: 0.5 + 0.5 * sung,
                transform: `translateY(${-pop * base * 0.12}px) scale(${1 + pop * 0.08}) rotate(${isAd ? -4 : 0}deg)`,
                textShadow: loud
                  ? `0 ${base * 0.05}px 0 rgba(90,0,40,${0.55 * sung}), 0 0 ${30 * sung}px rgba(255,180,120,${0.5 * sung})`
                  : `0 0 ${24 * sung}px rgba(255,170,90,${0.45 * sung}), 0 4px 18px rgba(0,0,0,0.5)`,
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
