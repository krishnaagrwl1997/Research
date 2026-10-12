// Film-style cut: drawn autumn shots under a warm faded grade, grain, letterbox,
// and plain yellow lowercase subtitles that switch whole lines with no animation.
import { AbsoluteFill, Html5Audio, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/arimo/400-italic.css';
import '../fonts';
import { DURATION, LINES } from '../data';
import { SceneView } from './scenes';
import { shotAt } from './shots';

const BAR = 60;
const PIC_H = 1080 - BAR * 2;
const SUB = '#F2C40F';
const ARTIST = 'whimsicaltimbre4005';

const Subtitle: React.FC<{ text: string; top?: boolean; size?: number }> = ({ text, top, size = 46 }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, ...(top ? { top: BAR + 70 } : { bottom: BAR + PIC_H * 0.1 }),
    display: 'flex', justifyContent: 'center',
  }}>
    <div style={{
      maxWidth: 1180, textAlign: 'center', fontFamily: '"Arimo", Arial, sans-serif', fontStyle: 'italic', fontSize: size,
      lineHeight: 1.08, color: SUB, textShadow: '0 0 2px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)',
    }}>
      {text}
    </div>
  </div>
);

export const FilmVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shot = shotAt(t);
  const lt = t - shot.start;
  const line = LINES.find((l) => t >= l.start - 0.05 && t < l.end);
  const weave = { x: Math.sin(frame * 1.3) * 0.7, y: Math.cos(frame * 0.7) * 0.9 };
  const flicker = 1 + (random(`fl${frame}`) - 0.5) * 0.035;
  const fadeIn = interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(t, [DURATION - 0.8, DURATION], [1, 0], { extrapolateLeft: 'clamp' });
  const ending = t >= DURATION - 2.4;

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Html5Audio src={staticFile('sapphic-season.mp3')} />
      <div style={{ position: 'absolute', left: 0, top: BAR, width: 1920, height: PIC_H, overflow: 'hidden', opacity: fadeIn * fadeOut }}>
        <div style={{
          position: 'absolute', inset: -12,
          transform: `translate(${weave.x + Math.sin(lt * 0.9 + shot.seed) * 6}px, ${weave.y + Math.cos(lt * 0.7 + shot.seed) * 4}px) scale(${1.02 + lt * 0.006})`,
          filter: `sepia(0.2) saturate(0.8) contrast(0.88) brightness(${1.02 * flicker})`,
        }}>
          <div style={{ position: 'absolute', left: 12, top: 12, width: 1920, height: PIC_H }}>
            <SceneView scene={shot.scene} lt={lt} seed={shot.seed} />
          </div>
        </div>
        {/* Lifted blacks and a warm cast, then vignette and grain. */}
        <AbsoluteFill style={{ background: 'rgba(60,40,30,0.14)', mixBlendMode: 'lighten' }} />
        <AbsoluteFill style={{ background: 'rgba(255,214,160,0.07)', mixBlendMode: 'soft-light' }} />
        <AbsoluteFill style={{ background: 'radial-gradient(85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />
        <Img src={staticFile(`grain/g${(frame % 8) + 1}.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'overlay', opacity: 0.22 }} />
      </div>

      {t < 6 && t > 0.3 && <Subtitle top text={`sapphic season — ${ARTIST}`} size={34} />}
      {ending ? (
        <Subtitle text="sapphic season" />
      ) : (
        line && <Subtitle text={line.text.toLowerCase()} />
      )}
    </AbsoluteFill>
  );
};
