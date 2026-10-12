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

// Glass bottle as in the reference: clear glass, cola below the shoulder, crimped crown cap,
// silver wrap label with red type.
export const Bottle: React.FC<{ h: number; id?: string }> = ({ h, id = 'b' }) => {
  const w = h * 0.3;
  // viewBox 100 × 340, centre x = 50
  const glass =
    'M35 30 L65 30 L65 38 Q 66 56 70 70 Q 78 92 88 112 Q 92 124 92 140 L92 312 Q 92 334 74 337 L26 337 Q 8 334 8 312 L8 140 Q 8 124 12 112 Q 22 92 30 70 Q 34 56 35 38 Z';
  const crimp = Array.from({ length: 15 }, (_, i) => `${30 + i * (40 / 14)},${i % 2 ? 27 : 31}`).join(' ');
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <svg width={w} height={h} viewBox="0 0 100 340" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}glass`}>
            <path d={glass} />
          </clipPath>
          <linearGradient id={`${id}cola`} x1="0" x2="1">
            <stop offset="0" stopColor="#120302" />
            <stop offset="0.18" stopColor="#3a0e06" />
            <stop offset="0.3" stopColor="#6e2410" />
            <stop offset="0.42" stopColor="#240704" />
            <stop offset="0.8" stopColor="#1a0503" />
            <stop offset="1" stopColor="#4a1408" />
          </linearGradient>
          <linearGradient id={`${id}label`} x1="0" x2="1">
            <stop offset="0" stopColor="#9aa0a6" />
            <stop offset="0.15" stopColor="#eef0f2" />
            <stop offset="0.3" stopColor="#ffffff" />
            <stop offset="0.7" stopColor="#e3e6e9" />
            <stop offset="0.9" stopColor="#b9bec4" />
            <stop offset="1" stopColor="#868c92" />
          </linearGradient>
          <linearGradient id={`${id}cap`} x1="0" x2="1">
            <stop offset="0" stopColor="#8d949b" />
            <stop offset="0.35" stopColor="#ffffff" />
            <stop offset="0.7" stopColor="#d5d9de" />
            <stop offset="1" stopColor="#7d848b" />
          </linearGradient>
        </defs>
        {/* glass */}
        <path d={glass} fill="rgba(215,225,220,.28)" stroke="rgba(60,70,65,.45)" strokeWidth="1" />
        <g clipPath={`url(#${id}glass)`}>
          <rect x="0" y="84" width="100" height="260" fill={`url(#${id}cola)`} />
          <path d="M0 84 Q 50 81 100 84 L100 88 Q 50 85 0 88 Z" fill="#8a4a2a" opacity="0.9" />
          {/* glass highlights */}
          <path d="M38 36 L41 36 Q 40 64 28 96 Q 19 118 18 140 L18 320 L14 318 L14 140 Q 15 116 25 92 Q 37 62 38 36 Z" fill="#fff" opacity="0.55" />
          <rect x="80" y="150" width="3" height="160" fill="#fff" opacity="0.35" />
          <rect x="56" y="34" width="2" height="40" fill="#fff" opacity="0.6" />
          <rect x="24" y="250" width="2" height="60" fill="#fff" opacity="0.25" />
        </g>
        {/* lip bead + crown cap */}
        <rect x="33" y="28" width="34" height="7" rx="3" fill="rgba(220,230,225,.6)" stroke="rgba(60,70,65,.4)" strokeWidth="0.8" />
        <path d="M30 12 Q 30 8 34 8 L66 8 Q 70 8 70 12 L70 27 L30 27 Z" fill={`url(#${id}cap)`} />
        <polygon points={`30,26 ${crimp} 70,26`} fill={`url(#${id}cap)`} stroke="#7d848b" strokeWidth="0.5" />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={32 + i * 2.75} y1="11" x2={32 + i * 2.75} y2="29" stroke="#6d737a" strokeWidth="0.7" opacity="0.8" />
        ))}
        <ellipse cx="50" cy="9" rx="19" ry="3" fill="#f7f8f9" stroke="#aab0b7" strokeWidth="0.5" />
        {/* label band */}
        <rect x="8" y="160" width="84" height="88" fill={`url(#${id}label)`} />
        <rect x="8" y="160" width="84" height="88" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="0.6" />
      </svg>
      <div style={{ position: 'absolute', left: w * 0.1, width: w * 0.8, top: (h * 162) / 340, height: (h * 84) / 340, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.005, display: 'flex', justifyContent: 'center' }}>
          <Wordmark size={w * 0.3} coke={C.red} diet={C.red} dietScale={0.4} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: w * 0.12,
            top: h * 0.135,
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: w * 0.055,
            lineHeight: 1.15,
            color: C.red,
            transform: 'rotate(8deg)',
            textAlign: 'center',
          }}
        >
          NO SUGAR
          <br />
          NO CALORIES
          <br />
          CRISP TASTE
        </div>
        <div style={{ position: 'absolute', left: w * 0.015, top: h * 0.02, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: BODY, fontWeight: 800, fontSize: w * 0.04, color: C.red }}>
          RECYCLE ME
        </div>
        <div style={{ position: 'absolute', left: w * 0.07, top: h * 0.17, width: w * 0.06, height: w * 0.06, border: `1px solid ${C.ink}`, background: '#fff' }}>
          <div style={{ margin: '20%', width: '60%', height: '60%', borderRadius: '50%', background: '#1e9e3a' }} />
        </div>
        {/* cylinder shading over the print */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'multiply',
            background: 'linear-gradient(90deg, #8d939a 0%, #f2f3f5 14%, #ffffff 30%, #ffffff 65%, #d5d9dd 85%, #8d939a 100%)',
          }}
        />
      </div>
    </div>
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

// Crumple facets laid over a can.
export const Crumple: React.FC<{ w: number; h: number; seed: string }> = ({ w, h, seed }) => (
  <svg width={w} height={h} style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay' }}>
    {range(26).map((i) => {
      const x = random(`${seed}x${i}`) * w;
      const y = random(`${seed}y${i}`) * h;
      const s = (0.2 + random(`${seed}s${i}`) * 0.4) * w;
      const pts = range(3)
        .map((k) => `${x + Math.cos(k * 2.1 + i) * s},${y + Math.sin(k * 2.1 + i) * s * 1.3}`)
        .join(' ');
      return <polygon key={i} points={pts} fill={random(`${seed}c${i}`) > 0.5 ? '#fff' : '#000'} opacity={0.35} />;
    })}
  </svg>
);
