import { AbsoluteFill, Easing, Html5Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import './fonts';
import { HAND, SANS, SERIF } from './fonts';
import { DURATION, LINES, SECTIONS, Line, sectionAt, pulse } from './data';
import { Background } from './components/Background';
import { Hearts, Leaves } from './components/Particles';
import { Kinetic } from './components/Kinetic';
import { Wipe } from './components/Wipe';
import { Mascot } from './components/Mascot';
import { Phone } from './components/Phone';
import { Letter } from './components/Letter';
import { CREAM, SUNSET } from './theme';

const ARTIST = 'whimsicaltimbre4005';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const isShout = (l: Line) => l.text === l.text.toUpperCase() && !l.text.startsWith('(');
const isTextPop = (l: Line) => l.text.startsWith('(') && l.section.startsWith('Final');

export const SapphicSeason: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const section = sectionAt(t);
  const intro = SECTIONS[0];
  const outro = SECTIONS[SECTIONS.length - 1];
  const bridge = SECTIONS.find((s) => s.kind === 'bridge')!;
  const onPhone = section === intro || section === outro;

  const singing = LINES.filter(
    (l, i) => t >= l.start - 0.3 && t < l.end + 0.15 && !intro.lines.includes(i) && !outro.lines.includes(i) && !bridge.lines.includes(i),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#140A1F' }}>
      <Html5Audio src={staticFile('sapphic-season.mp3')} />
      <Background t={t} section={section} />
      <Leaves t={t} section={section} />
      <Hearts t={t} section={section} />

      {section === intro && <TitleBlock t={t} out={intro.end} fps={fps} />}
      {section === intro && <Phone t={t} fps={fps} lines={intro.lines.map((i) => LINES[i])} show={[0.1, intro.end]} header="voice note to the group chat" />}
      {section === outro && <Phone t={t} fps={fps} lines={outro.lines.map((i) => LINES[i])} show={[outro.start, DURATION - 1.6]} header="the group chat" />}
      {section === outro && <EndCard t={t} />}
      {section === bridge && <Letter t={t} lines={bridge.lines.map((i) => LINES[i])} end={bridge.end} />}

      {singing.map((l) =>
        isTextPop(l) ? <TextPop key={l.start} line={l} t={t} fps={fps} /> : <Kinetic key={l.start} line={l} t={t} kind={section.kind} fps={fps} shout={isShout(l)} />,
      )}

      <Mascot t={t} section={section} line={LINES.find((l) => t >= l.start && t < l.end)} />

      {!onPhone && <SectionTag t={t} />}
      {!onPhone && (
        <div style={{ position: 'absolute', right: 70, bottom: 48, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 34, color: CREAM, opacity: 0.75 }}>
          Sapphic Season
        </div>
      )}
      <Wipe t={t} />
    </AbsoluteFill>
  );
};

const SectionTag: React.FC<{ t: number }> = ({ t }) => {
  const s = sectionAt(t);
  const a = interpolate(t, [s.start, s.start + 0.5], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute', left: 70, top: 56, padding: '10px 22px', borderRadius: 999, fontFamily: SANS, fontWeight: 700,
        fontSize: 22, letterSpacing: 4, color: CREAM, background: 'rgba(20,5,20,0.35)', border: '2px solid rgba(255,244,234,0.35)',
        opacity: a, transform: `translateX(${(1 - a) * -30}px)`,
      }}
    >
      {s.name.toUpperCase()}
    </div>
  );
};

const BouncyTitle: React.FC<{ size: number; t: number; fps: number; from: number; style?: React.CSSProperties }> = ({ size, t, fps, from, style }) => {
  let k = 0;
  return (
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontStyle: 'italic', fontSize: size, lineHeight: 0.95, letterSpacing: -2,
      fontVariationSettings: '"SOFT" 100, "WONK" 1', ...style }}>
      {['Sapphic', 'Season'].map((word, r) => (
        <div key={word} style={{ marginLeft: r ? size * 0.35 : 0 }}>
          {word.split('').map((ch) => {
            const i = k++;
            const s = spring({ frame: Math.round((t - from - i * 0.05) * fps), fps, config: { damping: 10, stiffness: 170 } });
            return (
              <span key={i} style={{ display: 'inline-block', color: SUNSET[[0, 1, 2, 4, 5, 6][i % 6]], opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * size * 0.6}px) rotate(${(1 - s) * (i % 2 ? 20 : -20)}deg)`,
                WebkitTextStroke: `${size * 0.03}px #2A0A22`, paintOrder: 'stroke fill', textShadow: `${size * 0.04}px ${size * 0.05}px 0 #2A0A22` }}>
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const TitleBlock: React.FC<{ t: number; out: number; fps: number }> = ({ t, out, fps }) => {
  const a = interpolate(t, [0, 1.2], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(t, [out - 0.8, out], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: 170, top: 250, opacity: a * (1 - o), transform: `translateY(${(1 - a) * 40 - o * 40}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, letterSpacing: 6, fontSize: 24, color: '#FFB98A', marginBottom: 28 }}>A LYRIC VIDEO</div>
      <BouncyTitle size={210} t={t} fps={fps} from={0.2} />
      <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 52, color: '#FFD1E8', marginTop: 34, transform: 'rotate(-3deg)' }}>
        {ARTIST}
      </div>
    </div>
  );
};

const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const a = interpolate(t, [DURATION - 1.5, DURATION - 0.6], [0, 1], { ...clamp, easing: ease });
  return (
    <>
      <div style={{ position: 'absolute', left: 170, top: 300, opacity: interpolate(t, [SECTIONS[SECTIONS.length - 1].start, SECTIONS[SECTIONS.length - 1].start + 1], [0, 1], clamp) * (1 - a) }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: '#FFD1E8', lineHeight: 1.1, transform: 'rotate(-3deg)' }}>
          meanwhile,
          <br />
          in the group chat…
        </div>
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: a, background: `rgba(20,10,31,${0.75 * a})` }}>
        <BouncyTitle size={190} t={t} fps={30} from={DURATION - 1.5} style={{ textAlign: 'center' }} />
        <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 48, color: '#FFD1E8', marginTop: 24 }}>{ARTIST}</div>
      </AbsoluteFill>
    </>
  );
};

// Shouted ad-libs in the final chorus land as message bubbles, calling back to the voice-note intro.
const TextPop: React.FC<{ line: Line; t: number; fps: number }> = ({ line, t, fps }) => {
  const s = spring({ frame: Math.round((t - line.start + 0.1) * fps), fps, config: { damping: 11, stiffness: 160 } });
  const out = interpolate(t, [line.end - 0.2, line.end + 0.1], [0, 1], clamp);
  const p = pulse(t);
  const big = line.text.toUpperCase() === line.text;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - out }}>
      <div
        style={{
          fontFamily: SANS, fontWeight: 700, fontSize: big ? 120 : 96, color: '#fff', padding: '34px 60px',
          background: big ? 'linear-gradient(135deg,#D52D00,#A30262)' : 'linear-gradient(135deg,#EF7627,#D162A4)',
          borderRadius: '70px 70px 18px 70px', boxShadow: '0 30px 90px rgba(60,0,30,0.6)',
          transform: `scale(${s * (1 + 0.04 * p)}) rotate(${big ? -3 : 2}deg)`,
        }}
      >
        {line.words.map((w, j) => (
          <span key={j} style={{ opacity: interpolate(t, [w.s - 0.05, w.s + 0.1], [0.35, 1], clamp) }}>{w.w.replace(/[()]/g, '')} </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
