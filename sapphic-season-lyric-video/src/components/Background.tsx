import { AbsoluteFill, interpolate } from 'remotion';
import { Kind, Section, SECTIONS, loudness, pulse } from '../data';
import { LOOK, SUNSET } from '../theme';

const Layer: React.FC<{ kind: Kind; t: number }> = ({ kind, t }) => {
  const [a, b, c] = LOOK[kind].bg;
  const glow = 0.35 + 0.4 * loudness(t);
  const stripes = kind === 'chorus' || kind === 'final' || kind === 'post';
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 110%, ${c} 0%, ${b} 45%, ${a} 100%)` }}>
      {stripes && <Stripes t={t} strong={kind !== 'post'} />}
      {kind === 'pre' && <Sunburst t={t} />}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at 50% 55%, rgba(255,200,140,${glow * 0.35}) 0%, rgba(0,0,0,0) 70%)`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

// Tilted flag-palette bands drifting sideways; the bass makes them breathe.
const Stripes: React.FC<{ t: number; strong: boolean }> = ({ t, strong }) => {
  const p = pulse(t);
  const band = 230;
  const shift = (t * 60) % (band * SUNSET.length);
  return (
    <AbsoluteFill style={{ opacity: strong ? 0.55 + 0.25 * p : 0.3, transform: `rotate(-12deg) scale(${1.5 + 0.03 * p})` }}>
      {Array.from({ length: SUNSET.length * 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: -600, right: -600, height: band + 1,
            top: i * band - shift - band * SUNSET.length,
            background: SUNSET[i % SUNSET.length],
          }}
        />
      ))}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(40,0,20,0.6), rgba(40,0,20,0.32) 40%, rgba(40,0,20,0.65))' }} />
    </AbsoluteFill>
  );
};

const Sunburst: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ opacity: 0.18 + 0.12 * pulse(t), transform: `rotate(${t * 8}deg) scale(2.2)` }}>
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, #FF9ACB 0deg 6deg, transparent 6deg 18deg)',
      }}
    />
  </AbsoluteFill>
);

// The previous section's look stays underneath while the new one fades in over ~0.8s.
export const Background: React.FC<{ t: number; section: Section }> = ({ t, section }) => {
  const idx = SECTIONS.indexOf(section);
  const prev = SECTIONS[idx - 1];
  // Hard swap at the section start; the Wipe overlay covers it.
  const fade = t >= section.start ? 1 : 0;
  return (
    <AbsoluteFill>
      {prev && fade < 1 && <Layer kind={prev.kind} t={t} />}
      <AbsoluteFill style={{ opacity: fade }}>
        <Layer kind={section.kind} t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(90% 80% at 50% 50%, transparent 55%, rgba(10,0,10,0.55) 100%)' }} />
    </AbsoluteFill>
  );
};
