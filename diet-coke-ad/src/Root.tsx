import '@fontsource/anton/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import React from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import { DietCokeAd } from './Ad';
import { REEL_H, REEL_W, Reel } from './Reel';
import { DURATION, FPS, H, W } from './lib';

// Hold every frame until the bundled fonts are ready.
const fontHandle = delayRender('fonts');
Promise.all(['400 100px Anton', '900 100px Inter', '800 100px Inter', '600 100px Inter', '500 100px Inter', '900 100px "Playfair Display"', 'italic 900 100px "Playfair Display"', 'italic 400 100px "Playfair Display"', '400 100px Yellowtail'].map((f) => document.fonts.load(f)))
  .then(() => document.fonts.ready)
  .then(() => continueRender(fontHandle));

export const Root: React.FC = () => (
  <>
    <Composition id="DietCokeAd" component={DietCokeAd} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ audio: true }} />
    <Composition id="Reel" component={Reel} durationInFrames={DURATION} fps={FPS} width={REEL_W} height={REEL_H} />
  </>
);
