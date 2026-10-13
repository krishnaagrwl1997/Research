import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Can } from './Can';
import { Bubbles } from './FX';
import { Eye, Wordmark } from './Props';
import { BODY, C, DISPLAY } from './lib';

// Reel cover, 1080×1920. Everything that matters sits inside the 3:4 grid crop (y 240–1680).
const EYES = [
  { x: 150, y: 330, w: 380, r: -8 },
  { x: 940, y: 300, w: 400, r: 8 },
  { x: 120, y: 1000, w: 360, r: 6 },
  { x: 960, y: 1060, w: 380, r: -6 },
  { x: 220, y: 1650, w: 420, r: 4 },
  { x: 900, y: 1700, w: 400, r: -5 },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, #e01b26 0, #8a0912 100%)', overflow: 'hidden' }}>
    {EYES.map((e, i) => (
      <div key={i} style={{ position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%, -53%) rotate(${e.r}deg)`, opacity: 0.22 }}>
        <Eye w={e.w} open={1} lookX={0.2} lookY={0.25} id={`c${i}`} />
      </div>
    ))}
    <Bubbles t={40} count={70} seed="cov" opacity={0.45} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center' }}>
      <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, letterSpacing: 12, color: C.white, opacity: 0.9 }}>POV: 3 HRS WITHOUT ONE</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center' }}>
      <Wordmark size={250} coke={C.yellow} diet={C.yellow} paglu={C.yellow} style={{ transform: 'rotate(-5deg)', filter: 'drop-shadow(10px 12px 0 rgba(0,0,0,.3))' }} />
    </div>
    <div style={{ position: 'absolute', left: 540, top: 1215, transform: 'translate(-50%, -50%) rotate(-9deg)', filter: 'drop-shadow(30px 50px 50px rgba(0,0,0,.5))' }}>
      <Can h={820} variant="open" openFrame={15} />
    </div>
    <div
      style={{
        position: 'absolute',
        right: 90,
        top: 1450,
        transform: 'rotate(-7deg)',
        background: C.yellow,
        padding: '10px 26px 14px',
        boxShadow: `10px 10px 0 ${C.ink}`,
        fontFamily: DISPLAY,
        fontSize: 64,
        lineHeight: 1,
        color: C.ink,
      }}
    >
      AD NOBODY
      <br />
      ASKED FOR #1
    </div>
  </AbsoluteFill>
);
