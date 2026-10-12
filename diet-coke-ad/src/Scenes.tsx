import React from 'react';
import { random } from 'remotion';
import { CAN_RATIO, Can } from './Can';
import { Bubbles, Center, Fill, Slam, SpeedLines } from './FX';
import { Bottle, BottleCap, Crumple, Dice, Eye, HeartCharm, IVBag, Lips, Pack, Sparkle, Wordmark } from './Props';
import { BAR, BEAT, BODY, C, DISPLAY, H, SERIF, W, backOut, beatPulse, clamp, easeIn, easeInOut, easeOut, jitter, map, range } from './lib';

type P = { f: number };

const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.12 }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={W} height={H} filter="url(#grain)" />
  </svg>
);

// ---------------------------------------------------------------- 0–48 · IV drip, heart monitor, the big drop falls
const HEARTS = [0, 8, 24, 32];
const ecg = (d: number) => {
  if (d < -8 || d > 12) return 0;
  if (d < -3) return -10 * ((d + 8) / 5);
  if (d < 0) return -10 + 100 * ((d + 3) / 3);
  if (d < 4) return 90 - 130 * (d / 4);
  return -40 + 40 * ((d - 4) / 8);
};
export const Drip: React.FC<P> = ({ f }) => {
  const pump = HEARTS.reduce((a, b) => a + (f >= b ? Math.exp(-(f - b) / 3.5) : 0), 0);
  const count = HEARTS.filter((b) => f >= b).length;
  const pan = map(f, [36, 48], [0, 1], easeIn);
  const bagH = 820;
  const chamberTop = 878;
  const line = 'STATUS: 3 HRS WITHOUT DIET COKE';
  const chars = Math.floor(map(f, [2, 20], [0, line.length]));
  const pts = range(241)
    .map((i) => {
      const x = i * 8;
      let y = 0;
      for (const b of HEARTS) if (f >= b) y += ecg((x - (W * 0.82 - (f - b) * 34)) / 3);
      return `${x},${1010 - y}`;
    })
    .join(' ');
  return (
    <Fill bg={C.paper}>
      <Fill bg="radial-gradient(ellipse 50% 70% at 50% 40%, #ffffff 0, rgba(237,235,231,0) 70%)" />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-pan * 900}px) scale(${1 + pump * 0.012 + map(f, [0, 36], [0, 0.05])})` }}>
        <div style={{ position: 'absolute', left: W / 2 - 3, top: -40, width: 6, height: 120, background: '#777', borderRadius: 3 }} />
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: 60,
            transform: `translateX(-50%) rotate(${Math.sin(f * 0.09) * 1.4}deg)`,
            transformOrigin: 'center top',
            filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.18))',
          }}
        >
          <IVBag t={f} height={bagH} />
        </div>
        {/* drip chamber + tube */}
        <div style={{ position: 'absolute', left: W / 2 - 4, top: chamberTop + 120, width: 8, height: 1400, background: 'linear-gradient(90deg, #8a3a1a, #4a1a0a)', borderRadius: 4 }} />
        <div
          style={{
            position: 'absolute',
            left: W / 2 - 28,
            top: chamberTop,
            width: 56,
            height: 130,
            borderRadius: 14,
            border: '3px solid rgba(0,0,0,.18)',
            background: 'linear-gradient(180deg, rgba(255,255,255,.6) 0 58%, #3a1408 58% 100%)',
          }}
        />
        {HEARTS.map((b) => {
          const t = f - b;
          if (t < 0 || t > 7) return null;
          return <div key={b} style={{ position: 'absolute', left: W / 2 - 8, top: chamberTop + 4 + easeIn(t / 7) * 66, width: 16, height: 20, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#3a1408' }} />;
        })}
        {f >= 36 && (
          <div
            style={{
              position: 'absolute',
              left: W / 2 - 40,
              top: chamberTop + 130 + map(f, [36, 48], [0, 1250], easeIn),
              width: 80,
              height: 110,
              borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
              background: 'radial-gradient(circle at 35% 35%, #9a4a22, #2a0f06 70%)',
            }}
          />
        )}
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 1 - pan }}>
        <polyline points={pts} fill="none" stroke={C.red} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 60, top: 54, fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.ink, opacity: 1 - pan }}>
        {line.slice(0, chars)}
        <span style={{ color: C.red }}>{f % 8 < 4 ? '▌' : ' '}</span>
      </div>
      <div style={{ position: 'absolute', right: 60, top: 50, textAlign: 'right', fontFamily: BODY, fontWeight: 900, color: C.red, opacity: 1 - pan }}>
        <div style={{ fontSize: 22, letterSpacing: 6, opacity: f % 12 < 8 ? 1 : 0.3 }}>● CRITICAL</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 96, lineHeight: 1, transform: `scale(${1 + pump * 0.08})`, transformOrigin: 'right center' }}>
          ♥ {[72, 96, 128, 164][Math.max(0, count - 1)]}
        </div>
      </div>
    </Fill>
  );
};

// ---------------------------------------------------------------- 48–96 · red ink eyes, "Diet Coke Paglu", dive into a pupil
const EYES = [
  { x: 300, y: 160, w: 420, r: -6 },
  { x: 960, y: 110, w: 380, r: 3 },
  { x: 1640, y: 170, w: 440, r: 8 },
  { x: 150, y: 560, w: 360, r: 4 },
  { x: 1780, y: 560, w: 380, r: -5 },
  { x: 330, y: 950, w: 440, r: 6 },
  { x: 980, y: 990, w: 400, r: -3 },
  { x: 1620, y: 940, w: 420, r: -8 },
];
const LOOK = [
  [0, 0],
  [-1, 0.2],
  [1, -0.3],
  [0, 0],
];
export const Eyes: React.FC<P> = ({ f }) => {
  const k = Math.min(3, Math.floor(f / BEAT));
  const prev = LOOK[Math.max(0, k - 1)];
  const snap = easeOut(clamp((f % BEAT) / 3));
  const lx = prev[0] + (LOOK[k][0] - prev[0]) * snap;
  const ly = prev[1] + (LOOK[k][1] - prev[1]) * snap;
  const wmIn = clamp((f - 4) / 6);
  const wmOut = map(f, [31, 37], [0, 1], easeIn);
  const centerOpen = map(f, [33, 38], [0, 1], easeOut);
  const dive = map(f, [38, 48], [1, 70], easeIn);
  return (
    <Fill bg={C.inkRed}>
      <Fill bg="radial-gradient(ellipse at 50% 50%, #d01a24 0, #8e0a12 100%)" />
      <Grain opacity={0.18} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${dive})`, transformOrigin: `${W / 2}px ${H / 2}px` }}>
        {EYES.map((e, i) => {
          const open0 = easeOut(clamp((f - i * 0.8) / 5));
          const blink = i % 2 === k % 2 && f % BEAT >= 8 && f % BEAT < 11 ? 0.1 : 1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: e.x,
                top: e.y,
                transform: `translate(-50%, -53%) rotate(${e.r}deg) scale(${1 + 0.06 * beatPulse(f, 3)})`,
                opacity: 1 - map(f, [38, 42], [0, 1]),
              }}
            >
              <Eye w={e.w} open={open0 * blink} lookX={lx} lookY={ly} id={`e${i}`} pupil={0.85 + 0.15 * (1 - beatPulse(f, 3))} />
            </div>
          );
        })}
        {f >= 33 && (
          <div style={{ position: 'absolute', left: W / 2, top: H / 2, transform: 'translate(-50%, -53.3%)' }}>
            <Eye w={760} open={centerOpen} id="center" pupil={1.15} />
          </div>
        )}
      </div>
      {f >= 4 && wmOut < 1 && (
        <Center>
          <div
            style={{
              transform: `scale(${(1 + 1.4 * Math.exp(-(f - 4) / 2.5)) * (1 + 0.08 * beatPulse(f, 3)) * (1 + wmOut * 3)}) rotate(${-4 + jitter(`wm${k}`) * 3}deg)`,
              opacity: wmIn * (1 - wmOut),
              filter: 'drop-shadow(10px 12px 0 rgba(0,0,0,.35))',
            }}
          >
            <Wordmark size={300} coke={C.yellow} diet={C.yellow} paglu={C.yellow} />
          </div>
        </Center>
      )}
    </Fill>
  );
};

// ---------------------------------------------------------------- 96–192 · inside the cola: bubble-ring tunnel, word stamps on every beat
const PAIRS = [
  ['ZERO', 'sugar.'],
  ['ZERO', 'calories.'],
  ['ZERO', 'chill.'],
  ['FULL', 'paglu.'],
];
export const Cola: React.FC<P> = ({ f }) => {
  const N = 18;
  const rings = range(N)
    .map((i) => ({ i, p: (((i / N - f * 0.026) % 1) + 1) % 1 || 1 }))
    .sort((a, b) => b.p - a.p);
  const k = Math.floor(f / BEAT);
  const b = f % BEAT;
  const pair = PAIRS[Math.min(3, Math.floor(k / 2))];
  const second = k % 2 === 1;
  const stamp = 1 + 0.7 * Math.exp(-b / 2.2);
  return (
    <Fill bg={`radial-gradient(circle at 50% 50%, #6b2a10 0, ${C.cola} 45%, #0c0302 100%)`}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, transform: `rotate(${f * 0.8}deg)` }}>
        {rings.map(({ i, p }) => {
          const r = 34 / Math.pow(p, 1.35);
          const cx = W / 2 + Math.sin(f * 0.06 + p * 4) * 220 * (1 - p);
          const cy = H / 2 + Math.cos(f * 0.05 + p * 3) * 140 * (1 - p);
          const o = clamp((1 - p) * 3);
          return i % 2 === 0 ? (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={C.foam} strokeWidth={r * 0.07} strokeDasharray={`0.1 ${r * 0.2}`} strokeLinecap="round" opacity={o} />
          ) : (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={i % 4 === 1 ? C.amber : C.red} strokeWidth={r * 0.035} opacity={o * 0.8} />
          );
        })}
      </svg>
      <SpeedLines t={f} count={50} seed="cl" color={C.foam} opacity={0.5} />
      <Bubbles t={f} count={120} seed="cb" speed={2.2} color={C.foam} opacity={0.7} />
      <Center style={{ flexDirection: 'column', gap: 30, transform: `scale(${stamp}) rotate(${jitter(`tr${k}`) * 5}deg)` }}>
        {second && <div style={{ fontFamily: DISPLAY, fontSize: 130, color: C.white, lineHeight: 1, letterSpacing: 10 }}>{pair[0]}</div>}
        {second ? (
          <Slam text={pair[1]} size={300} color={C.red} split={30 * Math.exp(-b / 3)} font={SERIF} italic />
        ) : (
          <Slam text={pair[0]} size={440} color={C.white} split={34 * Math.exp(-b / 3)} />
        )}
      </Center>
      <Fill bg={C.foam} style={{ opacity: b < 2 && k % 2 === 0 ? 0.3 : 0 }} />
    </Fill>
  );
};

// ---------------------------------------------------------------- 192–288 · a pack a day → the cans multiply
const GRID = [3, 4, 5, 7, 9, 12];
const GRID_BG = [C.ink, C.red, C.pink, C.ink, C.red, C.ink];
export const PackScene: React.FC<P> = ({ f }) => {
  const k = Math.min(7, Math.floor(f / BEAT));
  const b = f % BEAT;
  if (k < 2) {
    const rise = 1 - backOut(clamp(f / 6));
    const lid = map(f, [7, 13], [0, 1], easeOut);
    return (
      <Fill bg={C.red}>
        <Grain opacity={0.1} />
        <Bubbles t={f} count={40} seed="pb" speed={1.2} opacity={0.5} />
        <div style={{ position: 'absolute', left: W * 0.3, top: H / 2 + 40, transform: `translate(-50%, -50%) translateY(${rise * 1000}px) rotate(${-6 + Math.sin(f * 0.2) * 2}deg)` }}>
          <Pack w={440} lid={lid} t={f} />
        </div>
        <div style={{ position: 'absolute', left: W * 0.52, top: 250 }}>
          {['A PACK', 'A DAY.'].map((l, i) => (
            <div key={l} style={{ fontFamily: DISPLAY, fontSize: 250, lineHeight: 0.95, color: C.white, opacity: f >= i * BEAT ? 1 : 0, transform: `scale(${1 + 0.5 * Math.exp(-Math.max(0, f - i * BEAT) / 2)})`, transformOrigin: 'left center' }}>
              {l}
            </div>
          ))}
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 52, color: C.white, marginTop: 20, opacity: map(f, [14, 18], [0, 1]) }}>(of cans. relax.)</div>
        </div>
      </Fill>
    );
  }
  const n = GRID[k - 2];
  const cellH = H / n;
  const canH = cellH * 0.84;
  const cellW = canH * CAN_RATIO * 1.35;
  const cols = Math.ceil(W / cellW) + 1;
  const left = (W - cols * cellW) / 2;
  const cr = (n - 1) / 2;
  const cc = (cols - 1) / 2;
  return (
    <Fill bg={GRID_BG[k - 2]}>
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${Math.sin(f * 0.15) * 4}deg) scale(1.08)` }}>
        {range(n).flatMap((r) =>
          range(cols).map((c) => {
            const d = Math.hypot(r - cr, (c - cc) * 0.8);
            const t = clamp((b + 1 - d * 0.25) / 3);
            const s = t <= 0 ? 0 : backOut(t);
            const bob = Math.sin(f * 0.5 + c * 0.9 + r) * canH * 0.05;
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: 'absolute',
                  left: left + c * cellW + cellW / 2,
                  top: r * cellH + cellH / 2 + bob,
                  transform: `translate(-50%, -50%) scale(${s}) rotate(${(c + r) % 2 ? -8 : 8}deg)`,
                }}
              >
                <Can h={canH} spin={f * 0.03 + (r + c) * 0.17} />
              </div>
            );
          }),
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 60,
          bottom: 40,
          padding: '6px 34px 10px',
          background: k % 2 ? C.yellow : C.white,
          transform: `scale(${1 + 0.5 * Math.exp(-b / 2)}) rotate(-4deg)`,
          transformOrigin: 'right bottom',
          boxShadow: `12px 12px 0 ${C.ink}`,
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, color: C.ink }}>×{n * n}</span>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 40, padding: '8px 22px', background: C.ink, color: C.white, fontFamily: BODY, fontWeight: 900, fontSize: 44, letterSpacing: 4 }}>
        A PACK A DAY. <span style={{ color: C.red }}>…OR TWELVE.</span>
      </div>
    </Fill>
  );
};

// ---------------------------------------------------------------- 288–384 · Y2K glam collage, the world flips upside down
export const Glam: React.FC<P> = ({ f }) => {
  const flip = map(f, [42, 54], [0, 180], easeInOut);
  const after = f >= 48;
  const p = beatPulse(f, 3);
  const bob = (i: number, a = 14) => Math.sin(f * 0.12 + i * 1.7) * a;
  const items: { x: number; y: number; r: number; el: React.ReactNode }[] = [
    { x: 330, y: 250, r: Math.sin(f * 0.15) * 14, el: <HeartCharm s={280} /> },
    { x: 1500, y: 230, r: -6, el: <Lips w={440} part={0.15 + 0.7 * p} /> },
    { x: 300, y: 800, r: f * 3, el: <BottleCap s={230} /> },
    { x: 1580, y: 840, r: f * 9, el: <Dice s={150} /> },
    { x: 1760, y: 520, r: 18 + bob(2, 6), el: <Can h={300} spin={f * 0.02} /> },
    { x: 140, y: 520, r: -14 + bob(5, 6), el: <Can h={240} spin={0.3 + f * 0.02} /> },
  ];
  return (
    <Fill bg={C.pink}>
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${flip}deg) scale(1.2)` }}>
        <Fill bg={`repeating-linear-gradient(90deg, ${C.hot} 0 70px, ${C.pink} 70px 140px)`} style={{ transform: `translateX(${(f * 3) % 140}px)`, left: -140 }} />
        <Fill bg="radial-gradient(circle at 50% 50%, rgba(255,255,255,.75) 0, rgba(255,255,255,0) 40%)" />
        {items.map((it, i) => (
          <div key={i} style={{ position: 'absolute', left: it.x, top: it.y + bob(i), transform: `translate(-50%, -50%) rotate(${it.r}deg) scale(${1 + 0.05 * p})`, filter: 'drop-shadow(14px 20px 18px rgba(80,0,20,.35))' }}>
            {it.el}
          </div>
        ))}
        <div style={{ position: 'absolute', left: W / 2, top: H / 2, transform: `translate(-50%, -50%) rotate(${-22 + Math.sin(f * 0.08) * 6}deg) scale(${1 + 0.07 * p})`, filter: 'drop-shadow(20px 30px 30px rgba(80,0,20,.4))' }}>
          <div style={{ position: 'relative', transform: 'skewX(-4deg) scaleX(1.12)' }}>
            <Can h={640} spin={0.03 + Math.sin(f * 0.05) * 0.03} />
            <Crumple w={640 * CAN_RATIO} h={640} seed="cr" />
          </div>
        </div>
        {range(16).map((i) => {
          const tw = Math.abs(Math.sin(f * 0.25 + i * 1.3));
          return (
            <div key={`s${i}`} style={{ position: 'absolute', left: random(`spx${i}`) * W, top: random(`spy${i}`) * H, transform: `translate(-50%, -50%) scale(${tw}) rotate(${f * 2}deg)` }}>
              <Sparkle s={40 + random(`sps${i}`) * 50} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: C.ink,
            padding: '8px 40px 18px',
            transform: `rotate(-3deg) scale(${after ? 1 + 0.4 * Math.exp(-(f - 48) / 3) : 1 + 0.25 * Math.exp(-f / 3)})`,
            boxShadow: `10px 10px 0 ${C.hot}`,
          }}
        >
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 104, color: C.white }}>
            {after ? (
              <>
                It's a <span style={{ color: C.pink }}>lifestyle.</span>
              </>
            ) : (
              <>
                It's not a <span style={{ color: C.pink }}>phase.</span>
              </>
            )}
          </span>
        </div>
      </div>
    </Fill>
  );
};

// ---------------------------------------------------------------- 384–480 · marquee storm, a can floats up like a bubble
export const Marquee: React.FC<P> = ({ f }) => {
  const second = f >= BAR;
  const steps = Math.floor(f / BEAT) + easeOut(clamp((f % BEAT) / 5));
  const travel = f * 9 + steps * 110;
  return (
    <Fill bg={second ? C.red : C.ink}>
      <div style={{ position: 'absolute', left: -600, top: -500, width: W + 1200, height: H + 1000, transform: 'rotate(-11deg)' }}>
        {range(9).map((i) => {
          const dir = i % 2 ? 1 : -1;
          const x = -2600 + dir * travel * (0.8 + (i % 3) * 0.25);
          const serif = i % 2 === 1;
          const col = second ? (serif ? C.white : C.yellow) : serif ? C.silver : C.white;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: i * 230,
                left: x,
                fontFamily: serif ? SERIF : DISPLAY,
                fontStyle: serif ? 'italic' : 'normal',
                fontWeight: serif ? 900 : 400,
                fontSize: serif ? 210 : 250,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                color: serif ? col : 'transparent',
                WebkitTextStroke: serif ? undefined : `4px ${col}`,
              }}
            >
              {(serif ? 'Diet Coke ♥ ' : 'PAGLU • ').repeat(serif ? 18 : 30)}
            </div>
          );
        })}
      </div>
      <Bubbles t={f} count={170} seed="fz" speed={1.7} />
      <div
        style={{
          position: 'absolute',
          left: W / 2 + Math.sin(f * 0.12) * 160,
          top: map(f, [0, 96], [H + 520, -520]),
          transform: `translate(-50%, -50%) rotate(${-25 + f * 1.4}deg) scale(${1 + 0.06 * beatPulse(f, 3)})`,
          filter: 'drop-shadow(0 40px 60px rgba(0,0,0,.55))',
        }}
      >
        <Can h={820} spin={f * 0.03} />
      </div>
    </Fill>
  );
};

// ---------------------------------------------------------------- 480–576 · strobe montage of every motif, accelerating
type Card = { bg: string; word?: string; fg?: string; outline?: boolean; serif?: boolean; prop?: 'iv' | 'eye' | 'lips' | 'can' | 'canSide' | 'crushed' | 'wordmark' | 'close' | 'pack' };
const CARDS: Card[] = [
  { bg: C.red, word: 'CRISP', fg: C.white },
  { bg: C.paper, prop: 'iv' },
  { bg: C.ink, word: 'LIGHT', fg: C.silver, outline: true },
  { bg: C.inkRed, prop: 'eye' },
  { bg: C.pink, prop: 'lips' },
  { bg: C.silver, word: 'iconic.', fg: C.red, serif: true },
  { bg: C.red, prop: 'canSide' },
  { bg: C.ink, word: '0 SUGAR', fg: C.red },
  { bg: C.red, word: '0 CAL', fg: C.yellow },
  { bg: C.pink, prop: 'crushed' },
  { bg: C.ink, word: 'OBSESSED', fg: C.white, outline: true },
  { bg: C.inkRed, prop: 'wordmark' },
  { bg: C.silver, prop: 'close' },
  { bg: C.yellow, word: 'P', fg: C.red },
  { bg: C.red, word: 'A', fg: C.yellow },
  { bg: C.ink, word: 'G', fg: C.red },
  { bg: C.yellow, word: 'L', fg: C.ink },
  { bg: C.red, word: 'U', fg: C.white },
  { bg: C.ink, word: '!', fg: C.yellow },
];
const CardProp: React.FC<{ kind: NonNullable<Card['prop']>; f: number }> = ({ kind, f }) => {
  switch (kind) {
    case 'iv':
      return <IVBag t={f} height={900} />;
    case 'eye':
      return <Eye w={1300} open={1} id="strobe" pupil={0.9} />;
    case 'lips':
      return <Lips w={1300} part={0.6} />;
    case 'can':
      return <Can h={980} spin={f * 0.05} />;
    case 'canSide':
      return <Can h={1700} spin={f * 0.05} style={{ transform: 'rotate(90deg)' }} />;
    case 'crushed':
      return (
        <div style={{ position: 'relative', transform: 'rotate(28deg) skewX(-4deg) scaleX(1.12)' }}>
          <Can h={900} spin={0.04} />
          <Crumple w={900 * CAN_RATIO} h={900} seed="cr2" />
        </div>
      );
    case 'wordmark':
      return <Wordmark size={340} coke={C.yellow} diet={C.yellow} paglu={C.yellow} />;
    case 'close':
      return <Can h={2600} spin={0.05} style={{ transform: 'translateY(200px)' }} />;
    case 'pack':
      return <Pack w={600} lid={1} t={f} />;
  }
};
export const Strobe: React.FC<P> = ({ f }) => {
  const idx = f < 78 ? Math.floor(f / 6) : 13 + Math.floor((f - 78) / 3);
  const start = f < 78 ? idx * 6 : 78 + (idx - 13) * 3;
  const t = f - start;
  const card = CARDS[Math.min(CARDS.length - 1, idx)];
  const zoom = map(f, [0, 96], [1, 1.35], easeIn) * (1 + 0.35 * Math.exp(-t / 1.6));
  const rot = jitter(`sr${idx}`) * 7;
  const dark = card.bg === C.ink || card.bg === C.red || card.bg === C.inkRed;
  return (
    <Fill bg={card.bg}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom}) rotate(${rot}deg)` }}>
        {card.word && (
          <Center>
            <Slam
              text={card.word}
              size={card.word.length === 1 ? 900 : card.word.length <= 5 ? 520 : card.word.length <= 7 ? 400 : 330}
              color={card.fg}
              stroke={card.outline}
              split={22 * Math.exp(-t / 2)}
              font={card.serif ? SERIF : DISPLAY}
              italic={card.serif}
            />
          </Center>
        )}
        {card.prop && (
          <Center>
            <CardProp kind={card.prop} f={f} />
          </Center>
        )}
      </div>
      <SpeedLines t={f} count={40} seed="ss" color={dark ? C.white : C.ink} opacity={0.45} />
    </Fill>
  );
};

// ---------------------------------------------------------------- 576–624 · hush: two bottles clink, then white-out
export const Clink: React.FC<P> = ({ f }) => {
  const meet = easeOut(clamp(f / 20));
  const knock = f >= 20 ? Math.exp(-(f - 20) / 3) * Math.cos((f - 20) * 1.2) * 18 : 0;
  const text = 'how will i go back to normal cans when i know this exists?';
  const chars = Math.floor(map(f, [2, 24], [0, text.length]));
  const glow = map(f, [32, 48], [0, 1], easeIn);
  return (
    <Fill bg={C.paper}>
      <Fill bg="radial-gradient(ellipse at 45% 60%, #ffffff 0, rgba(237,235,231,0) 60%)" />
      <Grain opacity={0.08} />
      <div style={{ position: 'absolute', left: W * 0.42 - (1 - meet) * 900 - knock, top: H * 0.58, transform: `translate(-50%, -50%) rotate(${16 - knock * 0.3}deg)` }}>
        <Bottle h={980} id="bl" />
      </div>
      <div style={{ position: 'absolute', left: W * 0.42 + 270 + (1 - meet) * 900 + knock, top: H * 0.64, transform: `translate(-50%, -50%) rotate(${-14 + knock * 0.3}deg)` }}>
        <Bottle h={980} id="br" />
      </div>
      {f >= 20 && f < 32 && (
        <div style={{ position: 'absolute', left: W * 0.42 + 135, top: H * 0.58 - 400, transform: `translate(-50%, -50%) scale(${map(f, [20, 23, 32], [0.2, 1.4, 0])}) rotate(${f * 6}deg)` }}>
          <Sparkle s={140} color={C.white} />
        </div>
      )}
      <div style={{ position: 'absolute', left: W * 0.64, top: 200, width: 640, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 58, lineHeight: 1.25, color: C.ink }}>
        {text.slice(0, chars)}
      </div>
      <Fill bg={`radial-gradient(circle at 50% 50%, rgba(255,255,255,${glow}) 0, rgba(255,255,255,${glow * 0.9}) ${glow * 70}%, rgba(255,255,255,0) ${10 + glow * 90}%)`} />
    </Fill>
  );
};

// ---------------------------------------------------------------- 624–720 · slam + end card
export const Finale: React.FC<P> = ({ f }) => {
  const sq = Math.exp(-f / 3.5);
  const canX = 500;
  const reveal = (at: number) => easeOut(clamp((f - at) / 8));
  const wipe = clamp((f - 40) / 7);
  return (
    <Fill bg={C.inkRed}>
      <Fill bg="radial-gradient(ellipse at 60% 50%, #d01a24 0, #7e0810 100%)" />
      <Grain opacity={0.16} />
      {EYES.map((e, i) => {
        const blink = (f + i * 7) % 40 < 3 ? 0.1 : 1;
        return (
          <div key={i} style={{ position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%, -53%) rotate(${e.r}deg)`, opacity: 0.22 }}>
            <Eye w={e.w} open={blink * reveal(0)} lookX={-0.6} lookY={0.1} id={`fe${i}`} />
          </div>
        );
      })}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {[0, 6].map((d) => (
          <circle key={d} cx={canX} cy={H / 2 + 300} r={40 + Math.max(0, f - d) * 75} fill="none" stroke={d ? C.ink : C.yellow} strokeWidth={30 * Math.exp(-Math.max(0, f - d) / 8)} opacity={f >= d ? 1 : 0} />
        ))}
      </svg>
      <Bubbles t={f} count={120} seed="fb" mode="burst" ox={canX} oy={H / 2} color={C.white} speed={0.9} opacity={0.6} />
      <Bubbles t={f} count={40} seed="fr" speed={0.6} opacity={0.3} />
      <div
        style={{
          position: 'absolute',
          left: canX,
          top: H / 2 + 20,
          transform: `translate(-50%, -50%) rotate(${-8 + Math.sin(f * 0.05) * 2}deg) scale(${1 + 0.16 * sq}, ${1 - 0.2 * sq}) scale(${map(f, [0, 96], [1, 1.06])})`,
          filter: 'drop-shadow(30px 50px 50px rgba(0,0,0,.45))',
        }}
      >
        <Can h={880} spin={-0.03 + f * 0.0005} />
      </div>
      <div style={{ position: 'absolute', left: 930, top: 120 }}>
        <div style={{ transform: `scale(${1 + 1.5 * (1 - reveal(3))}) rotate(-4deg)`, transformOrigin: 'left center', opacity: reveal(3) > 0 ? 1 : 0, filter: 'drop-shadow(10px 12px 0 rgba(0,0,0,.3))' }}>
          <Wordmark size={300} coke={C.yellow} diet={C.yellow} paglu={C.yellow} />
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 50, color: C.white, marginTop: 30, opacity: reveal(26), transform: `translateY(${(1 - reveal(26)) * 40}px)` }}>
          0 calories. 0 sugar.
        </div>
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 16, padding: '4px 22px 10px' }}>
          <div style={{ position: 'absolute', inset: 0, background: C.yellow, transform: `scaleX(${easeOut(wipe)})`, transformOrigin: 'left' }} />
          <div style={{ position: 'relative', fontFamily: BODY, fontWeight: 900, fontSize: 68, color: C.ink, opacity: wipe > 0.6 ? 1 : 0 }}>100% obsessed.</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: BODY, fontWeight: 500, fontSize: 18, letterSpacing: 1, color: C.white, opacity: 0.65 * reveal(56) }}>
        Unofficial spec concept. Not affiliated with or endorsed by The Coca-Cola Company. Diet Coke is a trademark of its owner.
      </div>
    </Fill>
  );
};
