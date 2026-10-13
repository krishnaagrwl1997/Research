// YouTube thumbnail (1280×720): sticker title over the chorus look, with Maple front and centre.
import { AbsoluteFill } from 'remotion';
import './fonts';
import { SANS } from './fonts';
import { SECTIONS } from './data';
import { Background } from './components/Background';
import { Hearts, Leaves } from './components/Particles';
import { Mascot } from './components/Mascot';
import { BouncyTitle } from './SapphicSeason';

export const Thumbnail: React.FC = () => {
  const chorus = SECTIONS.find((s) => s.kind === 'final')!;
  const t = chorus.start + 6;
  return (
    <AbsoluteFill style={{ background: '#140A1F' }}>
      <div style={{ position: 'absolute', width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0' }}>
        <Background t={t} section={chorus} />
        <Leaves t={t} section={chorus} />
        <Hearts t={t} section={chorus} />
      </div>
      <div style={{ position: 'absolute', left: 70, top: 120 }}>
        <div style={{ display: 'inline-block', fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: '#FFF4EA',
          background: '#2A0A22', padding: '10px 22px', borderRadius: 999, marginBottom: 18, transform: 'rotate(-3deg)' }}>LYRIC VIDEO</div>
        <BouncyTitle size={190} t={10} fps={30} from={0} />
      </div>
      <div style={{ position: 'absolute', right: 40, bottom: 10, width: 220, height: 240, transform: 'scale(2.1)', transformOrigin: '100% 100%' }}>
        <div style={{ position: 'relative', width: 220, height: 240, transform: 'rotate(8deg)' }}>
          <Mascot t={t} section={chorus} line={{ section: '', text: 'pretty', words: [], start: t - 0.4, end: t + 1 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
