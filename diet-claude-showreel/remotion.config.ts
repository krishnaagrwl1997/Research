import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setEntryPoint('src/index.ts');
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? null);
