// Renders a page's #stage to video via window.__renderAt(t). usage: PAGE=video.html node tools/render.js <worker> <workers> <fps> <outdir>
// Run several workers in parallel, then concat the seg*.mp4 files and add the song with ffmpeg.
const { chromium } = require('playwright'); const { spawn } = require('child_process');
const [w,W,fps,out]=[+process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]];
const END=91.2, N=Math.ceil(END*fps), per=Math.ceil(N/W), a=w*per, b=Math.min(N,a+per);
(async()=>{
  const br=await chromium.launch(); const p=await br.newPage({viewport:{width:1920,height:1080}});
  p.on('pageerror',e=>console.error('ERR',e.message));
  await p.goto('file://'+require('path').resolve(__dirname,'..',process.env.PAGE||'video.html'),{waitUntil:'networkidle'});
  await p.addStyleTag({content:'#stage{position:fixed!important;left:0;top:0;width:1920px!important;height:1080px!important;max-width:none!important;z-index:99999;border-radius:0!important;box-shadow:none!important}'});
  await p.evaluate(()=>document.fonts.ready);
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',`${out}/seg${w}.mp4`],{stdio:['pipe','inherit','inherit']});
  const t0=Date.now();
  for(let f=a;f<b;f++){
    await p.evaluate(t=>{window.__renderAt(t);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))},f/fps);
    const buf=await p.screenshot({type:'jpeg',quality:93,clip:{x:0,y:0,width:1920,height:1080}});
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if((f-a)%240===0) console.log(`w${w} frame ${f-a}/${b-a} ${((Date.now()-t0)/1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await br.close(); console.log(`w${w} done ${((Date.now()-t0)/1000).toFixed(0)}s`);
})();
