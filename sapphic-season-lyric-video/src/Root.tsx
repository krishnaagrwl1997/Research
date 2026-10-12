import { Composition } from 'remotion';
import { SapphicSeason } from './SapphicSeason';
import { DURATION, FPS } from './data';

export const Root: React.FC = () => (
  <Composition
    id="SapphicSeason"
    component={SapphicSeason}
    durationInFrames={Math.ceil(DURATION * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
