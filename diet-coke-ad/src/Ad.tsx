import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { Clink, Cola, Drip, Eyes, Finale, Glam, Marquee, PackScene, Strobe } from './Scenes';
import { C, IMPACTS, S, jitter, shakeAmp } from './lib';

const SCENES: [readonly [number, number], React.FC<{ f: number }>][] = [
  [S.drip, Drip],
  [S.eyes, Eyes],
  [S.cola, Cola],
  [S.pack, PackScene],
  [S.glam, Glam],
  [S.marquee, Marquee],
  [S.strobe, Strobe],
  [S.clink, Clink],
  [S.finale, Finale],
];

export const DietCokeAd: React.FC<{ audio: boolean }> = ({ audio }) => {
  const frame = useCurrentFrame();
  const [[from], Scene] = SCENES.find(([[a, b]]) => frame >= a && frame < b) ?? SCENES[SCENES.length - 1];
  const amp = shakeAmp(frame);
  const sx = jitter(`x${frame}`) * amp;
  const sy = jitter(`y${frame}`) * amp;
  const sr = jitter(`r${frame}`) * amp * 0.05;
  const flash = IMPACTS.reduce((a, i) => (frame >= i ? Math.max(a, Math.exp(-(frame - i) / 2.2)) : a), 0);
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) rotate(${sr}deg) scale(${1 + amp * 0.0015})` }}>
        <Scene f={frame - from} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)' }} />
      <AbsoluteFill style={{ background: C.white, opacity: flash * 0.95 }} />
      {audio && <Audio src={staticFile('soundtrack.wav')} />}
    </AbsoluteFill>
  );
};
