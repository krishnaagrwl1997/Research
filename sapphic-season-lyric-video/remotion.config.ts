import { Config } from '@remotion/cli/config';

// Cloud sandboxes can't download Remotion's headless shell; use the preinstalled Playwright one when present.
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
import fs from 'fs';
if (fs.existsSync(shell)) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setCodec('h264');
Config.setCrf(18);
