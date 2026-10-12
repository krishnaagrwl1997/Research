import React from 'react';
import { Img, staticFile } from 'remotion';
import meta from '../public/3d/meta.json';

// Photoreal can: pre-rendered Three.js frames from render3d/ (see README).
// The component sizes the can itself (not the padded image) to the h-tall box.
type Box = { w: number; h: number; x0: number; y0: number; x1: number; y1: number };
const SPIN = meta.spin as Box;
export const CAN_RATIO = (SPIN.x1 - SPIN.x0) / (SPIN.y1 - SPIN.y0);
const pad = (n: number) => String(n).padStart(2, '0');

export const Can: React.FC<{
  h: number;
  spin?: number;
  // 'open' plays the tab-pull sequence (openFrame 0–15), 'crushed' is the crumpled can
  variant?: 'spin' | 'open' | 'crushed';
  openFrame?: number;
  style?: React.CSSProperties;
}> = ({ h, spin = 0, variant = 'spin', openFrame = 0, style }) => {
  const box: Box = variant === 'spin' ? SPIN : variant === 'open' ? (meta.open as Box) : (meta.crushed as Box);
  const n = meta.spinCount;
  const src =
    variant === 'spin'
      ? `3d/spin_${pad(((Math.round(spin * n) % n) + n) % n)}.webp`
      : variant === 'open'
        ? `3d/open_${pad(Math.max(0, Math.min(15, Math.floor(openFrame))))}.webp`
        : '3d/crushed.webp';
  const k = h / (box.y1 - box.y0);
  return (
    <div style={{ position: 'relative', width: (box.x1 - box.x0) * k, height: h, ...style }}>
      <Img
        src={staticFile(src)}
        style={{ position: 'absolute', left: -box.x0 * k, top: -box.y0 * k, width: box.w * k, height: box.h * k, maxWidth: 'none' }}
      />
    </div>
  );
};
