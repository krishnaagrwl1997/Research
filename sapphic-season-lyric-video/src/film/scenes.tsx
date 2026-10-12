// Original film-style shots drawn in SVG. Each takes local time `lt` (seconds into the shot) and a seed.
import { random } from 'remotion';
import { Scene } from './shots';

const W = 1920;
const H = 960;
type P = { lt: number; seed: number };
const rnd = (seed: number, k: string) => random(`${seed}-${k}`);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const LEAVES = ['#C2410C', '#D97706', '#E9B23A', '#A3361B', '#B45309'];
const LEAF = 'M0,-14 C6,-10 10,-3 9,3 C8,8 3,12 0,15 C-3,12 -8,8 -9,3 C-10,-3 -6,-10 0,-14 Z';

const Svg: React.FC<{ children: React.ReactNode; blur?: number }> = ({ children, blur }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, filter: blur ? `blur(${blur}px)` : undefined }}>
    {children}
  </svg>
);

const Falling: React.FC<P & { n: number; light?: boolean }> = ({ lt, seed, n, light }) => (
  <Svg>
    {range(n).map((i) => {
      const r = (k: string) => rnd(seed, `fall${i}${k}`);
      const y = ((r('y') * (H + 100) + lt * (40 + r('v') * 60)) % (H + 100)) - 50;
      const x = r('x') * W + Math.sin(lt * (0.8 + r('f')) + i) * 40;
      const s = 0.8 + r('s') * 1.6;
      return (
        <path key={i} d={LEAF} fill={LEAVES[i % 5]} opacity={light ? 0.95 : 0.8}
          transform={`translate(${x} ${y}) rotate(${r('r') * 360 + lt * 90}) scale(${s * Math.cos(lt * 2 + i)} ${s})`} />
      );
    })}
  </Svg>
);

// Looking straight up a stand of pines into a hazy bright sky.
const Up: React.FC<P & { haze?: boolean }> = ({ lt, seed, haze }) => {
  const vx = W / 2 + (rnd(seed, 'vx') - 0.5) * 300;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: haze ? 'linear-gradient(#FFFDF8, #F2EBDD)' : 'linear-gradient(#F5F1E8, #E3DDCF)' }} />
      <Svg blur={1.2}>
        <defs>
          <linearGradient id={`tr${seed}`} x1="0" x2="1">
            <stop offset="0" stopColor="#3A2A1E" /><stop offset="0.6" stopColor="#6B4A33" /><stop offset="1" stopColor="#2A1D14" />
          </linearGradient>
        </defs>
        {range(11).map((i) => {
          const bx = -260 + i * 230 + rnd(seed, `t${i}`) * 140;
          const w = 34 + rnd(seed, `w${i}`) * 46;
          const tx = vx + (bx - vx) * (0.32 + rnd(seed, `k${i}`) * 0.18);
          const tw = 5 + w * 0.12;
          const far = rnd(seed, `f${i}`) > 0.6;
          return <path key={i} d={`M${bx - w},${H + 20} L${bx + w},${H + 20} L${tx + tw},${-40} L${tx - tw},${-40} Z`}
            fill={far ? '#8C7A68' : `url(#tr${seed})`} opacity={haze ? 0.5 : far ? 0.6 : 0.92} />;
        })}
      </Svg>
      <Svg blur={6}>
        {range(44).map((i) => {
          const x = rnd(seed, `c${i}`) * (W + 200) - 100;
          const y = -40 + rnd(seed, `cd${i}`) * 300 * (1 - 0.5 * Math.abs(x - vx) / W);
          return (
            <ellipse key={i} cx={x + Math.sin(lt + i) * 6} cy={y} rx={70 + rnd(seed, `cr${i}`) * 110}
              ry={40 + rnd(seed, `cy${i}`) * 50} fill={i % 6 === 0 ? '#A8822C' : i % 2 ? '#2F3B26' : '#3E4A2E'} opacity={haze ? 0.3 : 0.85} />
          );
        })}
      </Svg>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(28% 34% at ${vx / W * 100 + 6}% 26%, rgba(255,250,235,${haze ? 0.95 : 0.85}), rgba(255,240,210,0) 70%)` }} />
      <Falling lt={lt} seed={seed} n={haze ? 6 : 14} />
    </>
  );
};

// Eye level in a pine and birch wood; layers slide at different speeds as the camera trucks.
const Walk: React.FC<P> = ({ lt, seed }) => {
  const dir = rnd(seed, 'dir') > 0.5 ? 1 : -1;
  const layer = (depth: number, n: number, color: string, wMin: number, blur: number) => (
    <Svg blur={blur}>
      {range(n).map((i) => {
        const w = wMin + rnd(seed, `${depth}w${i}`) * wMin;
        const x = ((i / n) * (W + 400) + rnd(seed, `${depth}x${i}`) * 120 - dir * lt * depth * 30) % (W + 400) - 200;
        return <rect key={i} x={x < -200 ? x + W + 400 : x} y={-20} width={w} height={H + 40} fill={color} />;
      })}
    </Svg>
  );
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#E6E4D6 0%, #C9CBB4 55%, #6E6A3C 70%, #4A4426 100%)' }} />
      {layer(0.4, 14, 'rgba(110,100,80,0.45)', 14, 3)}
      <Svg blur={5}>
        {range(16).map((i) => (
          <ellipse key={i} cx={rnd(seed, `b${i}`) * W - dir * lt * 18} cy={360 + rnd(seed, `by${i}`) * 220} rx={120} ry={70}
            fill={i % 3 ? '#D9A62E' : '#B8862A'} opacity={0.75} />
        ))}
      </Svg>
      {layer(1, 9, '#5A4230', 30, 1)}
      {layer(2.4, 4, '#2B1F16', 80, 7)}
      <Svg blur={2}>
        {range(60).map((i) => (
          <ellipse key={i} cx={(rnd(seed, `g${i}`) * W - dir * lt * 40 + W) % W} cy={H - 30 - rnd(seed, `gy${i}`) * 220} rx={30} ry={8}
            fill={LEAVES[i % 5]} opacity={0.6} />
        ))}
      </Svg>
    </>
  );
};

// Overcast city seen from a hill, autumn trees out of focus in front.
const Skyline: React.FC<P> = ({ lt, seed }) => {
  const pan = lt * 14 * (rnd(seed, 'p') > 0.5 ? 1 : -1);
  const city = (y: number, n: number, color: string, hMax: number, k: string) =>
    range(n).map((i) => {
      const w = 40 + rnd(seed, `${k}w${i}`) * 90;
      const h = 30 + rnd(seed, `${k}h${i}`) * hMax * (rnd(seed, `${k}t${i}`) > 0.9 ? 2.6 : 1);
      return <rect key={k + i} x={(i / n) * (W + 300) - 150 - pan * (k === 'f' ? 0.6 : 0.3)} y={y - h} width={w} height={h + 200} fill={color} />;
    });
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#E4E6E4 0%, #D3D6D3 45%, #B9BDB8 60%)' }} />
      <Svg blur={1.5}>
        <path d={`M0,${H * 0.6} C400,${H * 0.55} 900,${H * 0.58} 1300,${H * 0.54} S1800,${H * 0.57} ${W},${H * 0.55} L${W},${H} L0,${H} Z`} fill="#A9AFA9" />
        {city(H * 0.62, 34, '#9FA6A4', 70, 'b')}
        {city(H * 0.7, 28, '#7E8683', 90, 'f')}
        <rect x={0} y={H * 0.7} width={W} height={H} fill="#6E6F5E" />
      </Svg>
      <Svg blur={14}>
        {range(14).map((i) => (
          <circle key={i} cx={(i / 14) * W * 1.2 - 100 - pan * 1.8} cy={H - 80 + rnd(seed, `fy${i}`) * 60 - (i % 3) * 90}
            r={130 + rnd(seed, `fr${i}`) * 90} fill={['#C9871E', '#E2B33C', '#9C4A1A'][i % 3]} opacity={0.9} />
        ))}
      </Svg>
    </>
  );
};

// Top-down on the forest floor, slowly pushing in while new leaves land.
const Floor: React.FC<P> = ({ lt, seed }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, background: '#4A2E1C' }} />
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${1.05 + lt * 0.02}) rotate(${lt * 0.6}deg)` }}>
      <Svg>
        {range(260).map((i) => {
          const r = (k: string) => rnd(seed, `l${i}${k}`);
          return <path key={i} d={LEAF} fill={LEAVES[i % 5]} opacity={0.75 + r('o') * 0.25}
            transform={`translate(${r('x') * (W + 100) - 50} ${r('y') * (H + 100) - 50}) rotate(${r('r') * 360}) scale(${2 + r('s') * 2.2})`} />;
        })}
      </Svg>
    </div>
    <Svg>
      {range(5).map((i) => {
        const t0 = rnd(seed, `d${i}`) * 3;
        const p = Math.min(1, Math.max(0, (lt - t0) / 1.4));
        if (lt < t0) return null;
        const s = 7 - 4.5 * p;
        return <path key={i} d={LEAF} fill={LEAVES[(i + 2) % 5]} opacity={0.95}
          transform={`translate(${300 + rnd(seed, `dx${i}`) * 1300} ${200 + rnd(seed, `dy${i}`) * 500}) rotate(${p * 200 + i * 40}) scale(${s})`}
          style={{ filter: `blur(${(1 - p) * 6}px)` }} />;
      })}
    </Svg>
  </>
);

// Backlit branch with translucent leaves and sun bokeh, swaying.
const Branches: React.FC<P> = ({ lt, seed }) => {
  const sway = Math.sin(lt * 1.1) * 1.5;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 90% at 70% 20%, #FFF6E0, #E9DCC0 50%, #BFAE8C)' }} />
      <Svg blur={10}>
        {range(18).map((i) => (
          <circle key={i} cx={rnd(seed, `k${i}`) * W} cy={rnd(seed, `ky${i}`) * H} r={30 + rnd(seed, `kr${i}`) * 60} fill="#FFF3D0" opacity={0.5} />
        ))}
      </Svg>
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${sway}deg)`, transformOrigin: '0% 0%' }}>
        <Svg blur={0.8}>
          <path d="M-60,80 C300,160 600,240 980,300 S1600,420 2000,560" stroke="#2C1E14" strokeWidth={26} fill="none" />
          <path d="M520,220 C640,330 760,420 880,620 M1200,370 C1300,250 1420,180 1560,120 M900,290 C980,180 1060,120 1160,60" stroke="#2C1E14" strokeWidth={12} fill="none" />
          {range(70).map((i) => {
            const r = (k: string) => rnd(seed, `bl${i}${k}`);
            const tt = r('t');
            const x = -60 + tt * 2060 + (r('o') - 0.5) * 260;
            const y = 80 + tt * 480 + (r('p') - 0.5) * 300;
            return <path key={i} d={LEAF} fill={LEAVES[i % 5]} opacity={0.82}
              transform={`translate(${x} ${y}) rotate(${r('r') * 360 + Math.sin(lt * 2 + i) * 8}) scale(${3 + r('s') * 2.5})`} />;
          })}
        </Svg>
      </div>
    </>
  );
};

// Two people from behind, sitting on a hill above the town at golden hour.
const Figures: React.FC<P> = ({ lt, seed }) => {
  const lean = rnd(seed, 'lean') > 0.4;
  const hair = Math.sin(lt * 2.2) * 4;
  const person = (x: number, tilt: number, long: boolean, color: string) => (
    <g transform={`translate(${x} 0)`}>
      <path d={`M-150,${H} C-150,770 -110,700 -40,690 L40,690 C110,700 150,770 150,${H} Z`} fill={color} />
      <g transform={`rotate(${tilt} 0 690)`}>
        <rect x={-22} y={610} width={44} height={90} fill="#1E1410" />
        <ellipse cx={0} cy={560} rx={62} ry={74} fill="#2A1A12" />
        <path d={long ? `M-70,540 C-80,${640 + hair} -60,${720 + hair} -20,740 L20,740 C60,${720 - hair} 80,${640 - hair} 70,540 C60,480 -60,480 -70,540 Z`
          : `M-68,545 C-74,${600 + hair} -60,${640 + hair} -40,650 L40,650 C60,${640 - hair} 74,${600 - hair} 68,545 C58,480 -58,480 -68,545 Z`}
          fill={long ? '#B8893F' : '#D9B25E'} />
      </g>
    </g>
  );
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#F6D9B0 0%, #EFC08E 40%, #D99A6A 62%, #8D6A58 64%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(30% 40% at 62% 58%, rgba(255,240,200,0.95), rgba(255,220,170,0) 70%)' }} />
      <Svg blur={2}>
        {range(40).map((i) => {
          const h = 20 + rnd(seed, `h${i}`) * 70;
          return <rect key={i} x={i * 50 - lt * 3} y={H * 0.64 - h} width={44} height={h + 10} fill="#9A7766" opacity={0.7} />;
        })}
      </Svg>
      <Svg>
        <path d={`M-20,${H} L-20,800 C400,770 900,760 1300,790 S1800,820 1940,800 L1940,${H} Z`} fill="#3A2A1C" />
        <g transform={`translate(${-lt * 4} 0)`}>
          {person(820, lean ? 12 : 0, true, '#7A1E1E')}
          {person(1080, 0, false, '#3B3F46')}
        </g>
      </Svg>
      <Falling lt={lt} seed={seed} n={5} light />
    </>
  );
};

// Fogged café window at dusk: street-light bokeh outside, a mug steaming in the foreground.
const Cafe: React.FC<P> = ({ lt, seed }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#24324A, #3D4660 60%, #5A4E58)' }} />
    <Svg blur={16}>
      {range(22).map((i) => (
        <circle key={i} cx={(rnd(seed, `x${i}`) * W + lt * 10) % W} cy={250 + rnd(seed, `y${i}`) * 420} r={40 + rnd(seed, `r${i}`) * 50}
          fill={i % 4 ? '#F2B45A' : '#E86A5C'} opacity={0.7} />
      ))}
    </Svg>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(210,215,225,0.18)', backdropFilter: 'blur(2px)' }} />
    <Svg>
      <rect x={0} y={0} width={W} height={50} fill="#2A1E18" />
      <rect x={1180} y={0} width={36} height={H} fill="#2A1E18" />
      <rect x={0} y={H - 170} width={W} height={170} fill="#3A2A20" />
      <rect x={260} y={H - 380} width={230} height={230} rx={30} fill="#E8E0D4" />
      <path d="M490,640 C580,640 580,760 490,760" stroke="#E8E0D4" strokeWidth={26} fill="none" />
      {range(3).map((i) => (
        <path key={i} d={`M${330 + i * 45},560 C${300 + i * 45},${500 - Math.sin(lt * 2 + i) * 20} ${370 + i * 45},${450} ${335 + i * 45},${380 + Math.sin(lt * 1.5 + i) * 15}`}
          stroke="rgba(255,255,255,0.35)" strokeWidth={10} fill="none" style={{ filter: 'blur(6px)' }} />
      ))}
    </Svg>
  </>
);

// A phone lighting up on a dark bedspread.
const Phone: React.FC<P> = ({ lt, seed }) => {
  const on = Math.min(1, lt / 0.35);
  const bubbles = Math.floor(lt / 0.9) + 1;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#120A10' }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(40% 55% at 52% 55%, rgba(255,120,170,${0.35 * on}), rgba(0,0,0,0) 70%)` }} />
      <div style={{ position: 'absolute', left: W / 2 - 200 + (rnd(seed, 'x') - 0.5) * 300, top: 170, width: 380, height: 760, borderRadius: 48,
        background: '#0B0B0E', transform: `perspective(1400px) rotateX(48deg) rotateZ(${-18 + rnd(seed, 'r') * 20}deg) scale(${1 + lt * 0.015})`,
        boxShadow: `0 0 ${120 * on}px rgba(255,150,190,${0.5 * on})`, border: '6px solid #26222A' }}>
        <div style={{ position: 'absolute', inset: 14, borderRadius: 36, background: `rgba(255,240,245,${0.92 * on})`, overflow: 'hidden', padding: 30, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'flex-end' }}>
          {range(Math.min(bubbles, 4)).map((i) => (
            <div key={i} style={{ alignSelf: i % 2 ? 'flex-end' : 'flex-start', width: 160 + rnd(seed, `b${i}`) * 120, height: 54, borderRadius: 27, background: i % 2 ? '#E0457B' : '#C9C3CC' }} />
          ))}
        </div>
      </div>
    </>
  );
};

// Close-up silhouette lit by a single coloured gel, the light breathing and flickering.
const Gel: React.FC<P & { color: string }> = ({ lt, seed, color }) => {
  const flick = 0.85 + 0.15 * Math.sin(lt * 23 + seed) * Math.sin(lt * 7);
  const side = rnd(seed, 'side') > 0.5;
  const turn = Math.sin(lt * 0.6) * 4;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#050307' }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(50% 70% at ${side ? 35 : 65}% 45%, ${color}${Math.round(0x55 * flick).toString(16).padStart(2, '0')}, transparent 70%)` }} />
      <Svg blur={3}>
        <defs>
          <linearGradient id={`gel${seed}`} x1={side ? 0 : 1} x2={side ? 1 : 0}>
            <stop offset="0" stopColor={color} stopOpacity={flick} /><stop offset="0.55" stopColor={color} stopOpacity={0.25 * flick} /><stop offset="1" stopColor="#000" />
          </linearGradient>
        </defs>
        <g transform={`translate(${W / 2 + (side ? -80 : 80)} ${120}) rotate(${turn} 0 400) scale(1.25)`}>
          <path d="M-330,720 C-320,600 -220,560 -120,540 L-80,450 C-170,420 -200,330 -190,240 C-180,90 -90,10 10,10 C120,10 200,100 200,230 C200,330 160,410 90,450 L120,540 C220,560 320,600 330,720 Z" fill={`url(#gel${seed})`} />
          {range(9).map((k) => {
            const sx = (k - 4) * 42;
            const sw = Math.sin(lt * 1.8 + k) * 8;
            return <path key={k} d={`M${sx * 0.6},30 C${sx * 1.4},120 ${sx * 1.25 + (sx < 0 ? -40 : 40)},${330 + sw} ${sx * 1.6 + (sx < 0 ? -60 : 60)},${560 + sw}`}
              stroke={color} strokeWidth={30} strokeLinecap="round" fill="none" opacity={(Math.abs(k - 4) < 2 ? 0.06 : 0.16) * flick} style={{ filter: "blur(10px)" }} />;
          })}
        </g>
      </Svg>
    </>
  );
};

export const SceneView: React.FC<{ scene: Scene; lt: number; seed: number }> = ({ scene, lt, seed }) => {
  switch (scene) {
    case 'up': return <Up lt={lt} seed={seed} />;
    case 'haze': return <Up lt={lt} seed={seed} haze />;
    case 'walk': return <Walk lt={lt} seed={seed} />;
    case 'skyline': return <Skyline lt={lt} seed={seed} />;
    case 'floor': return <Floor lt={lt} seed={seed} />;
    case 'branches': return <Branches lt={lt} seed={seed} />;
    case 'figures': return <Figures lt={lt} seed={seed} />;
    case 'cafe': return <Cafe lt={lt} seed={seed} />;
    case 'phone': return <Phone lt={lt} seed={seed} />;
    case 'gelRed': return <Gel lt={lt} seed={seed} color="#E0102E" />;
    case 'gelBlue': return <Gel lt={lt} seed={seed} color="#2346FF" />;
  }
};
