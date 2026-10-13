import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { Wordmark } from './Wordmark';
import { BODY, C, DISPLAY, beatPulse, map } from './lib';

// 9:16 Instagram Reel: the finished 16:9 ad framed between a hook line and the wordmark.
// Text stays clear of the Reels UI (top ~220px, bottom ~380px, right edge).
export const REEL_W = 1080;
export const REEL_H = 1920;
const VIDEO_H = (REEL_W * 9) / 16;
const VIDEO_TOP = 640;

export const Reel: React.FC = () => {
  const f = useCurrentFrame();
  const pump = f >= 48 && f < 576 ? beatPulse(f, 3) : 0;
  const inHook = map(f, [0, 8], [0, 1]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #d01a24 0, #7e0810 100%)` }}>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 260, textAlign: 'center', opacity: inHook, transform: `translateY(${(1 - inHook) * 30}px)` }}>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: C.yellow }}>POV:</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 112, lineHeight: 1.0, color: C.white, marginTop: 14, transform: `scale(${1 + pump * 0.03})` }}>
          3 HOURS WITHOUT
          <br />A DIET COKE
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: VIDEO_TOP, width: REEL_W, height: VIDEO_H, boxShadow: '0 30px 60px rgba(0,0,0,.45)', transform: `scale(${1 + pump * 0.012})` }}>
        <OffthreadVideo src={staticFile('ad.mp4')} style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: VIDEO_TOP + VIDEO_H + 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Wordmark size={130} coke={C.yellow} diet={C.yellow} paglu={C.yellow} style={{ transform: 'rotate(-4deg)' }} />
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 26, letterSpacing: 2, color: C.white, opacity: 0.75, marginTop: 26 }}>
          unofficial spec ad · made entirely in code
        </div>
      </div>
    </AbsoluteFill>
  );
};
