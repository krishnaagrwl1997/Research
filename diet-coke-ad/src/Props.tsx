import React from 'react';
import { random } from 'remotion';
import { Can } from './Can';
import { Wordmark } from './Wordmark';
export { Wordmark };
import { BODY, C, range } from './lib';

// ---------------------------------------------------------------- IV bag full of cola. 400×620 viewBox, t drives the fizz.
export const IVBag: React.FC<{ t: number; height: number }> = ({ t, height }) => {
  const w = (height * 400) / 620;
  const bag = 'M60 70 Q60 40 90 40 L310 40 Q340 40 340 70 L340 110 Q360 130 352 170 L352 470 Q362 520 340 545 L340 570 Q340 590 320 590 L80 590 Q60 590 60 570 L60 545 Q38 520 48 470 L48 170 Q40 130 60 110 Z';
  const wave = (y: number) =>
    `M40 ${y} ${range(9)
      .map((i) => `Q ${55 + i * 40} ${y + Math.sin(t * 0.25 + i) * 5 - 6} ${75 + i * 40} ${y}`)
      .join(' ')} L370 600 L30 600 Z`;
  return (
    <div style={{ position: 'relative', width: w, height }}>
      <svg viewBox="0 0 400 620" width={w} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="ivbag">
            <path d={bag} />
          </clipPath>
          <linearGradient id="cola" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4a1a0a" />
            <stop offset="0.5" stopColor="#240903" />
            <stop offset="1" stopColor="#5a2410" />
          </linearGradient>
          <linearGradient id="plastic" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="0.2" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="0.8" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d={bag} fill="rgba(255,255,255,.35)" stroke="rgba(0,0,0,.18)" strokeWidth="3" />
        <rect x="150" y="56" width="100" height="34" rx="16" fill={C.paper} stroke="rgba(0,0,0,.2)" strokeWidth="3" />
        <g clipPath="url(#ivbag)">
          <path d={wave(150)} fill="url(#cola)" />
          {range(26).map((i) => (
            <circle key={i} cx={60 + random(`fo${i}`) * 280} cy={148 + random(`fy${i}`) * 10} r={4 + random(`fr${i}`) * 9} fill={C.foam} opacity={0.85} />
          ))}
          {range(40).map((i) => {
            const y = 590 - ((t * (1 + random(`by${i}`) * 3) + random(`bo${i}`) * 440) % 440);
            return <circle key={`b${i}`} cx={70 + random(`bx${i}`) * 260} cy={y} r={1.5 + random(`br${i}`) * 4} fill="none" stroke={C.foam} strokeOpacity={0.45} />;
          })}
          {range(70).map((i) => (
            <ellipse
              key={`d${i}`}
              cx={55 + random(`dx${i}`) * 290}
              cy={60 + random(`dy${i}`) * 520}
              rx={2 + random(`dr${i}`) * 5}
              ry={2.5 + random(`dr${i}`) * 6}
              fill="#fff"
              opacity={0.35 + random(`do${i}`) * 0.4}
            />
          ))}
          <path d={bag} fill="url(#plastic)" />
        </g>
        <rect x="170" y="588" width="60" height="24" rx="4" fill="rgba(255,255,255,.7)" stroke="rgba(0,0,0,.2)" strokeWidth="2" />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: height * 0.34, textAlign: 'center', color: C.white }}>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: height * 0.022, letterSpacing: height * 0.003, opacity: 0.9 }}>INTRAVENOUSLY OPTIMIZED</div>
        <Wordmark size={height * 0.14} coke={C.red} diet={C.white} style={{ marginTop: height * 0.01, filter: 'drop-shadow(0 0 1px rgba(255,255,255,.6))' }} />
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: height * 0.024, letterSpacing: height * 0.002, marginTop: height * 0.03, lineHeight: 1.45 }}>
          0 CALORIES. 0 SUGAR.
          <br />
          100% NECESSARY.
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- an ink-drawn eye. open 0..1, look in [-1,1]²
export const Eye: React.FC<{ w: number; open: number; lookX?: number; lookY?: number; ink?: string; id: string; pupil?: number }> = ({
  w,
  open,
  lookX = 0,
  lookY = 0,
  ink = C.ink,
  id,
  pupil = 1,
}) => {
  const h = w * 0.36;
  const o = Math.max(0.02, open);
  const shape = `M ${-w / 2} 0 Q 0 ${-h * 1.25 * o} ${w / 2} 0 Q 0 ${h * 0.95 * o} ${-w / 2} 0 Z`;
  const upper = `M ${-w / 2 - w * 0.04} ${h * 0.05} Q 0 ${-h * 1.25 * o} ${w / 2 + w * 0.02} 0`;
  const crease = `M ${-w * 0.42} ${-h * 0.55} Q 0 ${-h * (0.55 + 0.9 * o)} ${w * 0.44} ${-h * 0.45}`;
  const r = h * 0.62 * pupil;
  return (
    <svg width={w * 1.2} height={h * 3} viewBox={`${-w * 0.6} ${-h * 1.6} ${w * 1.2} ${h * 3}`} style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={`eye${id}`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill="rgba(255,240,230,.10)" />
      <g clipPath={`url(#eye${id})`}>
        <circle cx={lookX * w * 0.22} cy={lookY * h * 0.3} r={r} fill={ink} />
        <circle cx={lookX * w * 0.22 - r * 0.35} cy={lookY * h * 0.3 - r * 0.35} r={r * 0.16} fill="rgba(255,255,255,.75)" />
      </g>
      <path d={upper} fill="none" stroke={ink} strokeWidth={w * 0.045} strokeLinecap="round" />
      <path d={`M ${-w / 2} 0 Q 0 ${h * 0.95 * o} ${w / 2} 0`} fill="none" stroke={ink} strokeWidth={w * 0.014} />
      <path d={crease} fill="none" stroke={ink} strokeWidth={w * 0.012} opacity={0.8} />
      {range(9).map((i) => {
        const u = (i + 0.5) / 9;
        const x = -w / 2 + u * w;
        const y = -h * 1.25 * o * 2 * u * (1 - u);
        const ang = -Math.PI / 2 + (u - 0.5) * 1.6;
        const len = w * (0.06 + 0.05 * Math.sin(u * Math.PI));
        return <line key={i} x1={x} y1={y} x2={x + Math.cos(ang) * len} y2={y + Math.sin(ang) * len * o} stroke={ink} strokeWidth={w * 0.012} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- glossy lips. part 0..1 opens them
export const Lips: React.FC<{ w: number; part?: number }> = ({ w, part = 0.3 }) => {
  const p = part * 18;
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lipU" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b3001b" />
          <stop offset="1" stopColor="#e0142f" />
        </linearGradient>
        <linearGradient id="lipL" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e8203a" />
          <stop offset="1" stopColor="#8f0012" />
        </linearGradient>
      </defs>
      <path d={`M10 ${55} Q 40 ${55 + p} 100 ${55 + p} Q 160 ${55 + p} 190 55 Q 150 ${70 + p} 100 ${70 + p} Q 50 ${70 + p} 10 55 Z`} fill="#3a0008" />
      <path d={`M 62 ${57 + p * 0.3} Q 100 ${62 + p} 138 ${57 + p * 0.3} L 136 ${60 + p * 0.6} Q 100 ${66 + p} 64 ${60 + p * 0.6} Z`} fill="#fff" opacity={part > 0.15 ? 0.95 : 0} />
      <path d="M10 55 Q 30 30 70 18 Q 88 12 100 26 Q 112 12 130 18 Q 170 30 190 55 Q 150 50 100 55 Q 50 50 10 55 Z" fill="url(#lipU)" />
      <path d={`M10 55 Q 50 ${62 + p} 100 ${62 + p} Q 150 ${62 + p} 190 55 Q 170 ${92 + p} 100 ${100 + p} Q 30 ${92 + p} 10 55 Z`} fill="url(#lipL)" />
      <ellipse cx="72" cy={78 + p} rx="22" ry="6" fill="#fff" opacity="0.55" />
      <ellipse cx="128" cy={80 + p} rx="14" ry="4" fill="#fff" opacity="0.4" />
      <ellipse cx="75" cy="30" rx="14" ry="4" fill="#fff" opacity="0.45" transform="rotate(-15 75 30)" />
    </svg>
  );
};

export const Sparkle: React.FC<{ s: number; color?: string }> = ({ s, color = '#fff' }) => (
  <svg width={s} height={s} viewBox="-50 -50 100 100" style={{ overflow: 'visible' }}>
    <path d="M0 -50 Q 6 -6 50 0 Q 6 6 0 50 Q -6 6 -50 0 Q -6 -6 0 -50 Z" fill={color} />
    <circle r="10" fill={color} />
  </svg>
);

export const HeartCharm: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ position: 'relative', width: s, height: s }}>
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <circle cx="50" cy="4" r="7" fill="none" stroke="#cfd4da" strokeWidth="3" />
      <path d="M50 92 C 10 64 2 42 14 26 C 26 10 46 14 50 30 C 54 14 74 10 86 26 C 98 42 90 64 50 92 Z" fill="rgba(255,190,210,.85)" stroke="#e8ebee" strokeWidth="4" />
      <path d="M22 30 Q 26 20 36 20" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
    <div style={{ position: 'absolute', left: 0, right: 0, top: s * 0.26, textAlign: 'center' }}>
      <Wordmark size={s * 0.22} coke={C.hot} diet={C.hot} />
    </div>
  </div>
);

export const BottleCap: React.FC<{ s: number }> = ({ s }) => {
  const pts = range(42)
    .map((i) => {
      const a = (i / 42) * Math.PI * 2;
      const r = i % 2 ? 44 : 50;
      return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
    })
    .join(' ');
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      <svg width={s} height={s} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="capg" cx="0.35" cy="0.3">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.6" stopColor="#c9ced4" />
            <stop offset="1" stopColor="#7d848b" />
          </radialGradient>
        </defs>
        <polygon points={pts} fill="url(#capg)" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#9aa1a9" strokeWidth="2" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Wordmark size={s * 0.24} coke={C.red} diet={C.red} />
      </div>
    </div>
  );
};

export const Dice: React.FC<{ s: number }> = ({ s }) => {
  const pip = (x: number, y: number) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill="#fff" />;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <rect x="4" y="4" width="92" height="92" rx="18" fill="#a50d1d" />
      <rect x="10" y="8" width="80" height="30" rx="14" fill="#fff" opacity="0.15" />
      {[pip(28, 28), pip(72, 28), pip(50, 50), pip(28, 72), pip(72, 72)]}
    </svg>
  );
};

// Flip-top pack of cans. `lid` 0..1 opens it.
export const Pack: React.FC<{ w: number; lid: number; t: number }> = ({ w, lid, t }) => {
  const h = w * 1.15;
  const lidH = w * 0.3;
  return (
    <div style={{ position: 'relative', width: w, height: h + lidH }}>
      {/* cans peeking out */}
      <div style={{ position: 'absolute', left: w * 0.05, top: lidH * 0.35, width: w * 0.9, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: w * 0.01 }}>
        {range(10).map((i) => (
          <div key={i} style={{ transform: `translateY(${Math.max(0, lid - 0.5) * -w * 0.12 * (0.6 + random(`pk${i}`) * 0.8) + Math.sin(t * 0.4 + i) * 3}px)` }}>
            <Can h={w * 0.34} spin={0.02 + i * 0.03} />
          </div>
        ))}
      </div>
      {/* box front */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: lidH,
          width: w,
          height: h,
          background: 'linear-gradient(90deg, #f3f3f1, #ffffff 30%, #e3e3e0)',
          border: `${w * 0.008}px solid #bdbdb8`,
          borderRadius: w * 0.02,
          boxShadow: '0 30px 60px rgba(0,0,0,.35)',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.08, height: h * 0.05, background: C.red }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.62, textAlign: 'center' }}>
          <Wordmark size={w * 0.26} />
        </div>
        <div style={{ position: 'absolute', right: w * 0.05, bottom: h * 0.04, width: w * 0.14, height: h * 0.1, background: 'repeating-linear-gradient(90deg, #111 0 2px, #fff 2px 4px, #111 4px 5px, #fff 5px 8px)' }} />
      </div>
      {/* lid: hinged at the back, so from the front it folds up over its top edge */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: lidH,
          transformOrigin: 'center top',
          transform: `translateY(${lid > 0.5 ? 0 : 0}px) scaleY(${1 - 1.8 * lid})`,
          background: lid > 0.5 ? '#e6e6e2' : '#f4f4f2',
          border: `${w * 0.008}px solid #bdbdb8`,
          borderRadius: w * 0.02,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: '35%', height: '22%', background: C.red }} />
      </div>
    </div>
  );
};
