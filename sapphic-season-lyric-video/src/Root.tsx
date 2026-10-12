import { Composition } from 'remotion';
import { SapphicSeason } from './SapphicSeason';
import { FilmVideo } from './film/FilmVideo';
import { DURATION, FPS } from './data';

export const Root: React.FC = () => (
  <>
  <Composition
    id="SapphicSeasonFilm"
    component={FilmVideo}
    durationInFrames={Math.ceil(DURATION * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
  <Composition
    id="SapphicSeason"
    component={SapphicSeason}
    durationInFrames={Math.ceil(DURATION * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
  </>
);
