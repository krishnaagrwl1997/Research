import { continueRender, delayRender } from 'remotion';
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/fraunces/900.css';
import '@fontsource/fraunces/900-italic.css';
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';

export const SERIF = '"Fraunces", serif';
export const HAND = '"Caveat", cursive';
export const SANS = '"DM Sans", sans-serif';

// Hold the first frame until every face is decoded, so no frame renders in a fallback font.
const handle = delayRender('fonts');
Promise.all(
  ['400 40px Fraunces', 'italic 400 40px Fraunces', '700 40px Fraunces', '900 40px Fraunces', 'italic 900 40px Fraunces',
    '600 40px Caveat', '700 40px Caveat', '500 40px "DM Sans"', '700 40px "DM Sans"'].map((f) => document.fonts.load(f)),
).then(() => continueRender(handle));
