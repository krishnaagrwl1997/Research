import { Composition } from 'remotion';
import { SapphicSeason } from './SapphicSeason';
import { FilmVideo } from './film/FilmVideo';
import { Still } from 'remotion';
import { Thumbnail } from './Thumbnail';
import { DURATION, FPS } from './data';

export const Root: React.FC = () => (
  <>
  <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
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
