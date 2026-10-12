// Photoreal product renders for the ad: a chilled Diet Coke can (spin, tab-opening, crushed)
// and the glass-bottle clink shot. Driven by render.mjs; every function returns a data URL.
import * as THREE from 'three';

const RED = '#d4001e';
const INK = '#141414';

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const tex = (c, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.wrapS = THREE.RepeatWrapping;
  return t;
};

// ------------------------------------------------------------------ renderer + studio lighting
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);

// A dark studio with tall softbox strips: gives the hard vertical highlights of product photography.
function studioEnv() {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), new THREE.MeshBasicMaterial({ color: 0x4a4c50, side: THREE.BackSide })));
  const panel = (w, h, pos, k, color = 0xffffff) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, pos[1] * 0.2, 0);
    s.add(m);
  };
  panel(7, 46, [-20, 2, 12], 7);
  panel(4, 46, [22, 2, 4], 5);
  panel(3, 46, [9, 2, -22], 3);
  panel(34, 12, [0, 32, 2], 2.5);
  panel(26, 18, [0, 4, 34], 0.9);
  panel(46, 8, [0, -24, 4], 0.6, 0xffe0d0);
  const pm = new THREE.PMREMGenerator(renderer);
  return pm.fromScene(s, 0.015).texture;
}
const ENV = studioEnv();

// ------------------------------------------------------------------ can label (one full wrap, front = u 0.5)
const LW = 4096, LH = 1900;
function drawWordmark(g, x, y, size, coke, diet, dietScale = 0.5, rot = -0.07) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.font = `900 ${size}px PF`;
  g.fillStyle = coke;
  const w = g.measureText('Coke').width;
  g.save();
  g.scale(1, 1);
  // tighter tracking like the logo
  let cx = -w / 2 - size * 0.04;
  for (const ch of 'Coke') {
    const cw = g.measureText(ch).width;
    g.textAlign = 'left';
    g.fillText(ch, cx, 0);
    cx += cw - size * 0.035;
  }
  g.restore();
  g.font = `${size * dietScale}px YT`;
  g.fillStyle = diet;
  g.textAlign = 'right';
  g.save();
  g.rotate(-0.06);
  g.fillText('Diet', w / 2 + size * 0.02, -size * 0.66);
  g.restore();
  g.restore();
  return w;
}

function canLabel() {
  const col = canvas(LW, LH), met = canvas(LW, LH), rou = canvas(LW, LH);
  const c = col.getContext('2d'), m = met.getContext('2d'), r = rou.getContext('2d');
  // bare aluminium: bright, fully metallic, lightly brushed
  c.fillStyle = '#eef0f2'; c.fillRect(0, 0, LW, LH);
  m.fillStyle = '#ffffff'; m.fillRect(0, 0, LW, LH);
  r.fillStyle = 'rgb(60,60,60)'; r.fillRect(0, 0, LW, LH);
  const rand = rng(11);
  for (let i = 0; i < 2600; i++) {
    const y = rand() * LH, v = 57 + rand() * 7;
    r.fillStyle = `rgb(${v},${v},${v})`;
    r.fillRect(0, y, LW, 1 + rand() * 2);
  }
  const both = (fn) => { for (const [g, ink] of [[c, null], [m, 'm'], [r, 'r']]) fn(g, ink); };
  // front wordmark
  both((g, k) => drawWordmark(g, LW * 0.5, LH * 0.6, 560, k === 'm' ? 'rgb(150,150,150)' : k === 'r' ? 'rgb(80,80,80)' : RED, k === 'm' ? 'rgb(20,20,20)' : k === 'r' ? 'rgb(70,70,70)' : INK));
  both((g, k) => {
    g.fillStyle = k === 'm' ? 'rgb(150,150,150)' : k === 'r' ? 'rgb(80,80,80)' : RED;
    g.font = '800 92px IN';
    g.textAlign = 'right';
    g.fillText('NO SUGAR', LW * 0.5 + 560, LH * 0.8);
    g.fillText('NO CALORIES', LW * 0.5 + 560, LH * 0.8 + 104);
  });
  // back: small lockup, facts panel, barcode
  for (const x of [LW * 0.08, LW * 0.92]) both((g, k) => drawWordmark(g, x, LH * 0.42, 300, k === 'm' ? 'rgb(150,150,150)' : k === 'r' ? 'rgb(80,80,80)' : RED, k === 'm' ? 'rgb(20,20,20)' : k === 'r' ? 'rgb(70,70,70)' : INK, 0.5, 0));
  both((g, k) => {
    g.fillStyle = k === 'm' ? 'rgb(20,20,20)' : k === 'r' ? 'rgb(70,70,70)' : INK;
    g.font = '500 44px IN';
    g.textAlign = 'left';
    const lines = ['Nutrition Facts', 'Serving size 1 can', 'Calories 0', 'Total Fat 0g', 'Sodium 40mg', 'Total Carb. 0g', 'Total Sugars 0g', 'Protein 0g'];
    lines.forEach((l, i) => g.fillText(l, LW * 0.2, LH * 0.3 + i * 64));
    g.fillRect(LW * 0.2, LH * 0.3 + 20, 520, 6);
    g.font = '800 54px IN';
    g.fillText('12 FL OZ (355 mL)', LW * 0.2, LH * 0.88);
    const rb = rng(5);
    let x = LW * 0.72;
    for (let i = 0; i < 46; i++) { const bw = 3 + Math.floor(rb() * 4) * 3; g.fillRect(x, LH * 0.62, bw, 210); x += bw + 4 + Math.floor(rb() * 3) * 3; }
  });
  return { map: tex(col), metal: tex(met, false), rough: tex(rou, false) };
}

// Cold-can condensation: a normal map of droplets and a few runs, used on a clear-coat layer.
function condensation(seed, W = 2048, H = 950, count = 2400) {
  const c = canvas(W, H), g = c.getContext('2d');
  const img = g.createImageData(W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { d[i] = 128; d[i + 1] = 128; d[i + 2] = 255; d[i + 3] = 255; }
  const rand = rng(seed);
  const drop = (cx, cy, rx, ry) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const nx = (x - cx) / rx, ny = (y - cy) / ry, q = nx * nx + ny * ny;
      if (q >= 1) continue;
      const xx = ((x % W) + W) % W; if (y < 0 || y >= H) continue;
      const o = (y * W + xx) * 4, s = 0.9;
      d[o] = 128 + nx * 127 * s; d[o + 1] = 128 - ny * 127 * s; d[o + 2] = 128 + Math.sqrt(1 - q) * 127;
    }
  };
  for (let i = 0; i < count; i++) { const r = 2 + Math.pow(rand(), 3) * 12; drop(rand() * W, rand() * H, r, r * (1 + rand() * 0.3)); }
  for (let i = 0; i < 90; i++) { const r = 12 + rand() * 14; drop(rand() * W, rand() * H, r * 0.9, r * 1.15); }
  for (let i = 0; i < 18; i++) {
    const x = rand() * W, y0 = rand() * H * 0.6, len = 80 + rand() * 300, w = 3 + rand() * 4;
    for (let y = y0; y < y0 + len; y += 2) drop(x + Math.sin(y * 0.03) * 3, y, w, 3);
    drop(x, y0 + len, w * 2.4, w * 2.8);
  }
  g.putImageData(img, 0, 0);
  const t = tex(c, false);
  return t;
}

// ------------------------------------------------------------------ lid (top panel) texture, open 0..1
function lidTextures(open) {
  const S = 1024, col = canvas(S, S), nrm = canvas(S, S);
  const c = col.getContext('2d'), n = nrm.getContext('2d');
  c.fillStyle = '#d9dcdf'; c.fillRect(0, 0, S, S);
  n.fillStyle = 'rgb(128,128,255)'; n.fillRect(0, 0, S, S);
  const cx = S / 2, cy = S / 2;
  // embossed rings
  for (const [r, w] of [[0.47, 10], [0.43, 4], [0.2, 4]]) {
    n.strokeStyle = 'rgb(160,160,255)'; n.lineWidth = w; n.beginPath(); n.arc(cx, cy, S * r, 0, Math.PI * 2); n.stroke();
    n.strokeStyle = 'rgb(96,96,255)'; n.lineWidth = w * 0.6; n.beginPath(); n.arc(cx, cy, S * r - w, 0, Math.PI * 2); n.stroke();
  }
  // teardrop opening toward the front (bottom of this texture = +z)
  const tear = (g) => { g.beginPath(); g.ellipse(cx, cy + S * 0.25, S * 0.15, S * 0.12, 0, 0, Math.PI * 2); g.moveTo(cx - S * 0.12, cy + S * 0.18); g.quadraticCurveTo(cx, cy + S * 0.06, cx + S * 0.12, cy + S * 0.18); };
  n.strokeStyle = 'rgb(90,90,255)'; n.lineWidth = 5; tear(n); n.stroke();
  if (open > 0) {
    c.save(); c.globalAlpha = Math.min(1, open);
    const gr = c.createRadialGradient(cx, cy + S * 0.24, 4, cx, cy + S * 0.24, S * 0.16);
    gr.addColorStop(0, '#120402'); gr.addColorStop(0.75, '#2a0c05'); gr.addColorStop(1, '#55402f');
    c.fillStyle = gr; tear(c); c.fill(); c.restore();
  }
  const a = tex(col), b = tex(nrm, false);
  return { map: a, normal: b };
}

// ------------------------------------------------------------------ the can
const H_CAN = 12.2, R_CAN = 3.3, BODY0 = 1.0, BODY1 = 10.6;
let label, wet; // built once the fonts are in

function alu(rough = 0.26) {
  return new THREE.MeshPhysicalMaterial({ color: 0xdfe2e5, metalness: 1, roughness: rough, envMap: ENV, envMapIntensity: 1.15, clearcoat: 0.7, clearcoatRoughness: 0.06, clearcoatNormalMap: wet, clearcoatNormalScale: new THREE.Vector2(0.9, 0.9) });
}

function tabGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.32, -0.42);
  s.quadraticCurveTo(0, -0.58, 0.32, -0.42);
  s.lineTo(0.5, 0.6);
  s.quadraticCurveTo(0.62, 1.7, 0, 1.78);
  s.quadraticCurveTo(-0.62, 1.7, -0.5, 0.6);
  s.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-0.3, 0.7);
  hole.quadraticCurveTo(0, 0.55, 0.3, 0.7);
  hole.quadraticCurveTo(0.42, 1.5, 0, 1.55);
  hole.quadraticCurveTo(-0.42, 1.5, -0.3, 0.7);
  s.holes.push(hole);
  const rivetHole = new THREE.Path();
  rivetHole.absellipse(0, 0, 0.08, 0.08, 0, Math.PI * 2, true);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.03, bevelSegments: 3, curveSegments: 32 });
  g.rotateX(-Math.PI / 2);
  return g;
}

function buildCan({ crush = 0, seed = 3 } = {}) {
  const group = new THREE.Group();
  // printed body
  const body = new THREE.CylinderGeometry(R_CAN, R_CAN, BODY1 - BODY0, 256, crush ? 160 : 8, true, -Math.PI, Math.PI * 2);
  body.translate(0, (BODY0 + BODY1) / 2, 0);
  const bodyMat = alu(0.22);
  bodyMat.map = label.map; bodyMat.metalnessMap = label.metal; bodyMat.roughnessMap = label.rough; bodyMat.roughness = 1; bodyMat.metalness = 1;
  const bodyMesh = new THREE.Mesh(body, bodyMat);
  // bare metal: base, neck, rim, lid countersink
  const prof = [
    [0, 0.62], [1.2, 0.58], [1.85, 0.42], [2.2, 0.16], [2.38, 0.02], [2.6, 0.0], [2.86, 0.12], [3.12, 0.5], [3.26, 0.85], [3.3, BODY0],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const top = [
    [3.3, BODY1], [3.27, 10.9], [3.1, 11.3], [2.86, 11.65], [2.7, 11.86], [2.66, 11.96], [2.7, 12.06], [2.74, 12.14], [2.7, 12.2], [2.6, 12.2], [2.53, 12.12], [2.49, 11.98], [2.45, 11.9], [2.42, 11.93],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const metal = alu(0.24);
  const base = new THREE.Mesh(new THREE.LatheGeometry(prof, 256), metal);
  const neck = new THREE.Mesh(new THREE.LatheGeometry(top, 256), metal);
  // lid panel
  const lidT = lidTextures(0);
  const lidMat = new THREE.MeshPhysicalMaterial({ map: lidT.map, normalMap: lidT.normal, metalness: 1, roughness: 0.32, envMap: ENV, envMapIntensity: 1.1 });
  const lid = new THREE.Mesh(new THREE.CircleGeometry(2.43, 128), lidMat);
  lid.rotation.x = -Math.PI / 2;
  lid.position.y = 11.93;
  // tab, pivoting at the rivet
  const tabMat = new THREE.MeshPhysicalMaterial({ color: 0xd4d8dc, metalness: 1, roughness: 0.2, envMap: ENV, envMapIntensity: 1.2 });
  const tabPivot = new THREE.Group();
  tabPivot.position.set(0, 11.97, 0.0);
  const tab = new THREE.Mesh(tabGeometry(), tabMat);
  tabPivot.add(tab);
  const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), tabMat);
  rivet.position.set(0, 11.96, 0);
  group.add(bodyMesh, base, neck, lid, tabPivot, rivet);
  if (crush) {
    const rand = rng(seed);
    const dents = Array.from({ length: 70 }, () => ({ a: rand() * Math.PI * 2, y: 1.6 + rand() * 8.4, r: 0.5 + rand() * 2.2, d: 0.15 + rand() * 0.75 }));
    const p = body.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const a = Math.atan2(x, z);
      let push = 0;
      for (const dn of dents) {
        let da = Math.abs(a - dn.a); da = Math.min(da, Math.PI * 2 - da);
        const dist = Math.hypot(da * R_CAN, y - dn.y);
        if (dist < dn.r) { const k = 1 - dist / dn.r; push += dn.d * (k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k)); }
      }
      const mid = Math.sin(((y - BODY0) / (BODY1 - BODY0)) * Math.PI);
      push += 0.9 * mid * Math.max(0, Math.cos(a - 1.2)) ** 2; // a big squeeze on one side
      const rr = Math.max(1.2, R_CAN - push * crush);
      p.setXYZ(i, Math.sin(a) * rr, y - mid * 0.35 * crush * Math.sin(a * 3), Math.cos(a) * rr);
    }
    body.computeVertexNormals();
  }
  return { group, tabPivot, lid, lidMat, bodyMesh };
}

function setLid(can, open) {
  const t = lidTextures(open);
  can.lidMat.map = t.map; can.lidMat.normalMap = t.normal; can.lidMat.needsUpdate = true;
}

// ------------------------------------------------------------------ can shots (transparent)
const canScene = new THREE.Scene();
canScene.environment = ENV;
const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-8, 14, 12); canScene.add(key);
const rim = new THREE.DirectionalLight(0xffffff, 1.0); rim.position.set(10, 6, -10); canScene.add(rim);
const canCam = new THREE.PerspectiveCamera(16, 800 / 1400, 1, 200);
function aimCan(elev = 7) {
  const d = 54, e = (elev * Math.PI) / 180;
  canCam.position.set(0, 6.3 + d * Math.sin(e), d * Math.cos(e));
  canCam.lookAt(0, 6.3, 0);
}
let can = null;
function useCan(opts) {
  if (can) canScene.remove(can.group);
  can = buildCan(opts);
  canScene.add(can.group);
}

function shot(scene, cam, w, h, type = 'image/webp', q = 0.95) {
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL(type, q);
}

window.api = {
  ready: Promise.all(['900 100px PF', '100px YT', '800 100px IN', '500 100px IN'].map((f) => document.fonts.load(f))).then(() => {
    label = canLabel();
    wet = condensation(7);
    buildBottles();
    return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family);
  }),
  // full-turn spin, i of n
  canSpin(i, n) {
    if (!can || can.crushed) useCan({});
    aimCan(7);
    can.group.rotation.y = (i / n) * Math.PI * 2;
    can.tabPivot.rotation.x = 0; setLid(can, 0);
    return shot(canScene, canCam, 800, 1400);
  },
  // tab opening, t 0..1 (hole appears at t≈0.375)
  canOpen(t) {
    if (!can || can.crushed) useCan({});
    aimCan(16);
    can.group.rotation.y = 0;
    const lift = t < 0.35 ? (t / 0.35) * 1.3 : t < 0.5 ? 1.3 : 1.3 - ((t - 0.5) / 0.5) * 1.05;
    can.tabPivot.rotation.x = Math.max(0, lift);
    setLid(can, t >= 0.375 ? 1 : 0);
    return shot(canScene, canCam, 800, 1400);
  },
  canCrushed() {
    useCan({ crush: 1, seed: 9 });
    can.crushed = true;
    aimCan(14);
    can.group.rotation.set(0, -0.25, 0);
    can.tabPivot.rotation.x = 0.35;
    setLid(can, 1);
    return shot(canScene, canCam, 800, 1400);
  },
};

// ------------------------------------------------------------------ bottle clink shot (opaque, full frame)
function bottleLabel() {
  const W = 4096, Hh = 760, col = canvas(W, Hh), g = col.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, Hh);
  gr.addColorStop(0, '#e9ebed'); gr.addColorStop(0.5, '#fbfbfb'); gr.addColorStop(1, '#e3e5e7');
  g.fillStyle = gr; g.fillRect(0, 0, W, Hh);
  // front: Coke with a small Diet over the "ke"
  g.font = '900 440px PF'; g.fillStyle = RED; g.textAlign = 'left';
  let x = W / 2 - 520;
  for (const ch of 'Coke') { g.fillText(ch, x, Hh * 0.6); x += g.measureText(ch).width - 16; }
  g.font = '150px YT'; g.textAlign = 'right'; g.fillText('Diet', W / 2 + 520, Hh * 0.2 + 30);
  g.save(); g.translate(W / 2 + 40, Hh * 0.7); g.rotate(0.12);
  g.font = '800 58px IN'; g.textAlign = 'center';
  ['NO SUGAR', 'NO CALORIES', 'CRISP TASTE'].forEach((l, i) => g.fillText(l, 0, i * 64));
  g.restore();
  g.save(); g.translate(W / 2 - 600, Hh * 0.5); g.rotate(-Math.PI / 2); g.font = '800 46px IN'; g.textAlign = 'center'; g.fillText('RECYCLE ME', 0, 0); g.restore();
  g.fillStyle = '#fff'; g.strokeStyle = INK; g.lineWidth = 4; g.fillRect(W / 2 - 560, Hh * 0.68, 70, 70); g.strokeRect(W / 2 - 560, Hh * 0.68, 70, 70);
  g.fillStyle = '#1e9e3a'; g.beginPath(); g.arc(W / 2 - 525, Hh * 0.68 + 35, 22, 0, Math.PI * 2); g.fill();
  // back panel text
  g.fillStyle = RED; g.font = '900 200px PF'; g.textAlign = 'center'; g.fillText('Coke', W * 0.08, Hh * 0.55); g.fillText('Coke', W * 0.92 + 0, Hh * 0.55);
  g.fillStyle = INK; g.font = '500 40px IN'; g.textAlign = 'left';
  ['INGREDIENTS: CARBONATED WATER, CARAMEL COLOUR,', 'PHOSPHORIC ACID, SWEETENERS, NATURAL FLAVOURS,', 'CAFFEINE.   300 mL'].forEach((l, i) => g.fillText(l, W * 0.2, Hh * 0.35 + i * 56));
  return tex(col);
}

function buildBottle(id) {
  const grp = new THREE.Group();
  const outer = [
    [0, 0.05], [2.4, 0.02], [2.95, 0.25], [3.1, 0.8], [3.12, 6], [3.08, 11.2], [3.0, 12.4], [2.6, 14.0], [2.0, 15.6], [1.5, 17.0], [1.28, 18.5], [1.22, 20.0], [1.24, 20.5], [1.42, 20.62], [1.45, 20.9], [1.3, 21.05], [1.15, 21.1],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xfbfefc, metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.2, ior: 1.5, envMap: ENV, envMapIntensity: 1.4, specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02, side: THREE.DoubleSide,
  });
  grp.add(new THREE.Mesh(new THREE.LatheGeometry(outer, 200), glass));
  // cola up to the shoulder
  const liq = [[0, 0.3], [2.85, 0.3], [2.95, 0.9], [2.96, 11.2], [2.86, 12.4], [2.45, 14.0], [2.05, 15.0], [0, 15.0]].map(([x, y]) => new THREE.Vector2(x, y));
  const cola = new THREE.MeshPhysicalMaterial({ color: 0x2a0a04, emissive: 0x160301, roughness: 0.08, metalness: 0, envMap: ENV, envMapIntensity: 0.6, sheen: 1, sheenColor: new THREE.Color(0x8a2a0c), sheenRoughness: 0.4 });
  const liquid = new THREE.Mesh(new THREE.LatheGeometry(liq, 160), cola);
  liquid.castShadow = true;
  grp.add(liquid);
  const foam = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.09, 12, 120), new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.8 }));
  foam.rotation.x = Math.PI / 2; foam.position.y = 15.0;
  grp.add(foam);
  // label
  const lab = new THREE.Mesh(
    new THREE.CylinderGeometry(3.135, 3.135, 4.0, 200, 1, true, -Math.PI, Math.PI * 2),
    new THREE.MeshPhysicalMaterial({ map: bottleLabel(), metalness: 0.35, roughness: 0.32, envMap: ENV, envMapIntensity: 1.0, clearcoat: 0.4 }),
  );
  lab.position.y = 7.6;
  grp.add(lab);
  // crown cap with crimped skirt
  const capG = new THREE.CylinderGeometry(1.5, 1.66, 0.62, 168, 6, false);
  const p = capG.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(x, z), r = Math.hypot(x, z);
    if (r < 0.01) continue;
    const skirt = Math.max(0, (0.31 - y) / 0.62);
    const k = 1 + 0.07 * skirt * Math.pow(Math.max(0, Math.cos(a * 21)), 0.6);
    p.setXYZ(i, (x / r) * r * k, y, (z / r) * r * k);
  }
  capG.computeVertexNormals();
  const cap = new THREE.Mesh(capG, new THREE.MeshPhysicalMaterial({ color: 0xeef0f2, metalness: 0.9, roughness: 0.22, envMap: ENV, envMapIntensity: 1.2 }));
  cap.position.y = 21.35;
  cap.castShadow = true;
  grp.add(cap);
  grp.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  grp.userData.id = id;
  return grp;
}

const clink = new THREE.Scene();
clink.background = new THREE.Color(0xedebe7);
clink.environment = ENV;
const wall = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshStandardMaterial({ color: 0xedebe7, roughness: 1 }));
wall.position.set(0, 10, -14); wall.receiveShadow = true; clink.add(wall);
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(-14, 26, 22); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 14; sun.shadow.blurSamples = 20;
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 34, bottom: -10, near: 1, far: 90 });
clink.add(sun);
clink.add(new THREE.HemisphereLight(0xffffff, 0xe8e0d8, 0.8));
let bl, br; // built once the fonts are in
function buildBottles() {
  bl = buildBottle('l'); br = buildBottle('r');
  bl.rotation.order = 'ZYX';
  br.rotation.order = 'ZYX';
  clink.add(bl, br);
}
const clinkCam = new THREE.PerspectiveCamera(30, 1920 / 1080, 1, 300);
clinkCam.position.set(5.5, 11.5, 50);
clinkCam.lookAt(5.5, 11.5, 0);

window.api.clink = (f) => {
  // matches the 2D timing: meet at f=20, then a damped knock
  const meet = 1 - Math.pow(1 - Math.min(1, f / 20), 3);
  const knock = f >= 20 ? Math.exp(-(f - 20) / 3) * Math.cos((f - 20) * 1.2) * 0.5 : 0;
  bl.position.set(-7.4 - (1 - meet) * 26 - knock, -1.5, 0.6);
  bl.rotation.set(0, 0.12, -0.28 - knock * 0.02);
  br.position.set(5.75 + (1 - meet) * 26 + knock, -2.4, -0.6);
  br.rotation.set(0, -0.1, 0.245 + knock * 0.02);
  return shot(clink, clinkCam, 1920, 1080, 'image/jpeg', 0.93);
};
window.api.clinkContact = () => {
  window.api.clink(30);
  const v = new THREE.Vector3(0, 21.6, 0).applyMatrix4(bl.matrixWorld).project(clinkCam);
  const u = new THREE.Vector3(0, 21.6, 0).applyMatrix4(br.matrixWorld).project(clinkCam);
  return { x: ((v.x + u.x) / 4 + 0.5) * 1920, y: (-(v.y + u.y) / 4 + 0.5) * 1080 };
};
