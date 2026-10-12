import React from 'react';
import { random } from 'remotion';
import { C, DISPLAY, H, W, range } from './lib';

type BubbleMode = 'rise' | 'burst' | 'converge';

// Deterministic carbonation. `t` is frames since the effect started.
export const Bubbles: React.FC<{
  t: number;
  count: number;
  seed: string;
  mode?: BubbleMode;
  speed?: number;
  size?: number;
  ox?: number;
  oy?: number;
  color?: string;
  opacity?: number;
}> = ({ t, count, seed, mode = 'rise', speed = 1, size = 1, ox = W / 2, oy = H / 2, color = C.white, opacity = 1 }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    {range(count).map((i) => {
      const r1 = random(`${seed}a${i}`);
      const r2 = random(`${seed}b${i}`);
      const r3 = random(`${seed}c${i}`);
      const r = (3 + r3 * r3 * 34) * size;
      let x: number;
      let y: number;
      let o = 1;
      if (mode === 'rise') {
        const v = (3 + r2 * 11) * speed;
        const span = H + 240;
        y = H + 120 - ((t * v + r1 * span * 3) % span);
        x = r1 * W + Math.sin(t * 0.12 + r2 * 9) * (8 + r3 * 18);
      } else {
        const ang = r1 * Math.PI * 2;
        const dist = (200 + r2 * 1500) * speed;
        const k = mode === 'burst' ? 1 - Math.exp(-t / (6 + r3 * 8)) : Math.max(0, 1 - t / 18) ** 2;
        x = ox + Math.cos(ang) * dist * k;
        y = oy + Math.sin(ang) * dist * k - (mode === 'burst' ? t * t * 0.08 * r3 : 0);
        o = mode === 'burst' ? Math.max(0, 1 - t / (26 + r2 * 20)) : Math.min(1, t / 4);
      }
      return (
        <g key={i} opacity={o * opacity}>
          <circle cx={x} cy={y} r={r} fill={color} fillOpacity={0.14} stroke={color} strokeOpacity={0.85} strokeWidth={Math.max(1.5, r * 0.12)} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill={color} fillOpacity={0.9} />
        </g>
      );
    })}
  </svg>
);

// Big display word with an RGB split behind it.
export const Slam: React.FC<{
  text: string;
  size: number;
  color?: string;
  split?: number;
  style?: React.CSSProperties;
  stroke?: boolean;
  tracking?: number;
  font?: string;
  italic?: boolean;
}> = ({ text, size, color = C.white, split = 0, style, stroke = false, tracking = 0, font = DISPLAY, italic = false }) => {
  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    fontFamily: font,
    fontWeight: font === DISPLAY ? 400 : 900,
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: size,
    lineHeight: 0.9,
    letterSpacing: tracking,
    whiteSpace: 'pre',
    textAlign: 'center',
  };
  const fill = (c: string): React.CSSProperties =>
    stroke ? { color: 'transparent', WebkitTextStroke: `${Math.max(3, size * 0.02)}px ${c}` } : { color: c };
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div style={{ ...base, position: 'relative', visibility: 'hidden' }}>{text}</div>
      {split > 0.5 && (
        <>
          <div style={{ ...base, ...fill(C.cyan), opacity: 0.85, transform: `translate(${split}px, ${-split * 0.3}px)` }}>{text}</div>
          <div style={{ ...base, ...fill(C.red === color ? '#FF7A00' : C.red), opacity: 0.85, transform: `translate(${-split}px, ${split * 0.3}px)` }}>{text}</div>
        </>
      )}
      <div style={{ ...base, ...fill(color) }}>{text}</div>
    </div>
  );
};

export const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>{children}</div>
);

export const Fill: React.FC<{ bg: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg, style, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden', ...style }}>{children}</div>
);

// Speed lines radiating from the centre.
export const SpeedLines: React.FC<{ t: number; count: number; seed: string; color?: string; opacity?: number }> = ({
  t,
  count,
  seed,
  color = C.white,
  opacity = 0.7,
}) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
    {range(count).map((i) => {
      const a = random(`${seed}${i}`) * Math.PI * 2;
      const ph = (t * (0.05 + random(`${seed}v${i}`) * 0.06) + random(`${seed}p${i}`)) % 1;
      const r0 = 120 + ph * ph * 1400;
      const len = 60 + ph * 500;
      return (
        <line
          key={i}
          x1={W / 2 + Math.cos(a) * r0}
          y1={H / 2 + Math.sin(a) * r0}
          x2={W / 2 + Math.cos(a) * (r0 + len)}
          y2={H / 2 + Math.sin(a) * (r0 + len)}
          stroke={color}
          strokeWidth={2 + ph * 7}
          strokeLinecap="round"
          opacity={opacity * ph}
        />
      );
    })}
  </svg>
);
