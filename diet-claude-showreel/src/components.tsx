import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, DISPLAY, ease, lerp, MONO} from './theme';

// ---------------------------------------------------------------------------
// The soda can: the product's own metaphor. `level` is how much limit is left.
// ---------------------------------------------------------------------------
export const Can: React.FC<{
	level: number;
	height?: number;
	tab?: number; // 0 closed, 1 popped
	fizz?: number; // bubble intensity 0..1
	style?: React.CSSProperties;
	id?: string;
}> = ({level, height = 520, tab = 0, fizz = 0.5, style, id = 'can'}) => {
	const frame = useCurrentFrame();
	const top = 72;
	const bottom = 392;
	const liquidY = top + (1 - Math.max(0, Math.min(1, level))) * (bottom - top);
	const amp = 5 + fizz * 4;
	let wave = `M 0 ${liquidY}`;
	for (let x = 0; x <= 240; x += 8) {
		const y =
			liquidY +
			Math.sin(x * 0.045 + frame * 0.28) * amp * 0.6 +
			Math.sin(x * 0.11 - frame * 0.17) * amp * 0.4;
		wave += ` L ${x} ${y}`;
	}
	wave += ' L 240 420 L 0 420 Z';

	const bubbles = new Array(Math.round(10 + fizz * 26)).fill(0).map((_, i) => {
		const speed = 1.2 + random(`${id}s${i}`) * 2.6;
		const x = 34 + random(`${id}x${i}`) * 172;
		const r = 2 + random(`${id}r${i}`) * 5;
		const span = bottom - liquidY + 30;
		const y = bottom - (((frame + random(`${id}o${i}`) * 400) * speed) % Math.max(span, 1));
		const wob = Math.sin(frame * 0.2 + i) * 3;
		return {x: x + wob, y, r};
	});

	const body =
		'M48 46 Q48 32 66 30 H174 Q192 32 192 46 L214 78 V372 L200 398 Q196 408 180 408 H60 Q44 408 40 398 L26 372 V78 Z';

	return (
		<svg
			viewBox="0 0 240 430"
			style={{height, width: (height * 240) / 430, overflow: 'visible', ...style}}
		>
			<defs>
				<clipPath id={`${id}-clip`}>
					<path d={body} />
				</clipPath>
				<linearGradient id={`${id}-metal`} x1="0" x2="1">
					<stop offset="0" stopColor={C.silver3} />
					<stop offset="0.18" stopColor={C.silver1} />
					<stop offset="0.42" stopColor={C.silver2} />
					<stop offset="0.7" stopColor={C.silver1} />
					<stop offset="1" stopColor={C.silver3} />
				</linearGradient>
				<linearGradient id={`${id}-liquid`} x1="0" x2="1">
					<stop offset="0" stopColor={C.coralD} />
					<stop offset="0.3" stopColor={C.coral} />
					<stop offset="0.6" stopColor="#FF8A62" />
					<stop offset="1" stopColor={C.coralD} />
				</linearGradient>
				<linearGradient id={`${id}-shine`} x1="0" x2="1">
					<stop offset="0" stopColor="#fff" stopOpacity="0" />
					<stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
					<stop offset="1" stopColor="#fff" stopOpacity="0" />
				</linearGradient>
			</defs>
			{/* shadow */}
			<ellipse cx="120" cy="416" rx="96" ry="12" fill="#000" opacity="0.18" />
			<g clipPath={`url(#${id}-clip)`}>
				<rect x="0" y="0" width="240" height="430" fill={`url(#${id}-metal)`} />
				<path d={wave} fill={`url(#${id}-liquid)`} />
				{bubbles.map((b, i) =>
					b.y > liquidY + 6 ? (
						<circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#fff" opacity={0.35} />
					) : null,
				)}
				{/* gauge ticks */}
				{[0.25, 0.5, 0.75].map((t) => {
					const y = top + (1 - t) * (bottom - top);
					return (
						<g key={t}>
							<line x1="184" x2="206" y1={y} y2={y} stroke={C.ink} strokeWidth="3" opacity="0.45" />
						</g>
					);
				})}
				{/* label */}
				<text
					x="120"
					y="104"
					textAnchor="middle"
					fontFamily={MONO}
					fontWeight={700}
					fontSize="20"
					letterSpacing="8"
					fill={C.ink}
				>
					DIET
				</text>
				<text
					x="0"
					y="0"
					transform="translate(140 262) rotate(-90)"
					textAnchor="middle"
					fontFamily={DISPLAY}
					fontWeight={800}
					fontSize="74"
					fill={C.paper}
					stroke={C.ink}
					strokeWidth="5"
					paintOrder="stroke"
					letterSpacing="-2"
				>
					claude
				</text>
				<rect x="56" y="70" width="22" height="340" fill={`url(#${id}-shine)`} />
				<rect x="150" y="70" width="10" height="340" fill={`url(#${id}-shine)`} opacity="0.5" />
			</g>
			<path d={body} fill="none" stroke={C.ink} strokeWidth="5" />
			{/* lid */}
			<ellipse cx="120" cy="38" rx="70" ry="11" fill={C.silver2} stroke={C.ink} strokeWidth="5" />
			<g transform={`rotate(${-tab * 58} 150 36)`}>
				<rect x="104" y="28" width="50" height="16" rx="8" fill={C.silver1} stroke={C.ink} strokeWidth="4" />
				<circle cx="116" cy="36" r="3.5" fill={C.ink} />
			</g>
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Transition wrapper: reveals its children over the scene underneath.
// ---------------------------------------------------------------------------
export const Reveal: React.FC<{
	type: 'circle' | 'up' | 'left' | 'right' | 'diag';
	dur?: number;
	origin?: [number, number];
	children: React.ReactNode;
	edge?: string;
}> = ({type, dur = 10, origin = [50, 50], children, edge}) => {
	const frame = useCurrentFrame();
	const p = lerp(frame, [0, dur], [0, 1], ease);
	let clip = 'none';
	if (p < 1) {
		if (type === 'circle') clip = `circle(${p * 75}% at ${origin[0]}% ${origin[1]}%)`;
		if (type === 'up') clip = `inset(${(1 - p) * 100}% 0 0 0)`;
		if (type === 'left') clip = `inset(0 ${(1 - p) * 100}% 0 0)`;
		if (type === 'right') clip = `inset(0 0 0 ${(1 - p) * 100}%)`;
		if (type === 'diag') {
			const a = (1 - p) * 200;
			clip = `polygon(${a}% 0, 100% 0, 100% 100%, ${a - 100}% 100%)`;
		}
	}
	// coloured leading edge strip trails the wipe
	const edgeP = lerp(frame, [2, dur + 2], [0, 1], ease);
	return (
		<AbsoluteFill>
			{edge && p < 1 && type !== 'circle' ? (
				<AbsoluteFill
					style={{
						background: edge,
						clipPath:
							type === 'up'
								? `inset(${(1 - edgeP) * 100 - 6}% 0 0 0)`
								: type === 'left'
									? `inset(0 ${(1 - edgeP) * 100 - 6}% 0 0)`
									: type === 'right'
										? `inset(0 0 0 ${(1 - edgeP) * 100 - 6}%)`
										: `polygon(${(1 - edgeP) * 200 - 12}% 0, 100% 0, 100% 100%, ${(1 - edgeP) * 200 - 112}% 100%)`,
					}}
				/>
			) : null}
			<AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Rising fizz across a whole scene.
// ---------------------------------------------------------------------------
export const Fizz: React.FC<{count?: number; color?: string; opacity?: number; seed?: string}> = ({
	count = 26,
	color = '#fff',
	opacity = 0.25,
	seed = 'f',
}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(count).fill(0).map((_, i) => {
				const s = 2 + random(`${seed}s${i}`) * 5;
				const x = random(`${seed}x${i}`) * 1080;
				const r = 4 + random(`${seed}r${i}`) * 14;
				const y = 1140 - (((frame + random(`${seed}o${i}`) * 300) * s) % 1240);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x + Math.sin(frame * 0.1 + i) * 12,
							top: y,
							width: r * 2,
							height: r * 2,
							borderRadius: '50%',
							border: `3px solid ${color}`,
							opacity,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Droplet burst (can popping, overflow).
// ---------------------------------------------------------------------------
export const Burst: React.FC<{
	at: number;
	x: number;
	y: number;
	count?: number;
	color?: string;
	power?: number;
	seed?: string;
}> = ({at, x, y, count = 22, color = C.coral, power = 1, seed = 'b'}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 40) return null;
	return (
		<>
			{new Array(count).fill(0).map((_, i) => {
				const ang = -Math.PI / 2 + (random(`${seed}a${i}`) - 0.5) * Math.PI * 1.3;
				const v = (10 + random(`${seed}v${i}`) * 16) * power;
				const px = x + Math.cos(ang) * v * t;
				const py = y + Math.sin(ang) * v * t + 0.9 * t * t;
				const r = (5 + random(`${seed}r${i}`) * 9) * (1 - t / 44);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: px - r,
							top: py - r,
							width: r * 2,
							height: r * 2,
							borderRadius: '50%',
							background: i % 3 === 0 ? '#fff' : color,
							border: `3px solid ${C.ink}`,
						}}
					/>
				);
			})}
		</>
	);
};

// ---------------------------------------------------------------------------
// Animated film grain on top of everything.
// ---------------------------------------------------------------------------
export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.22}}>
			<svg width="1080" height="1080">
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="1080" height="1080" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

// Text line that slides up out of a mask.
export const MaskLine: React.FC<{
	p: number; // 0..1 in
	out?: number; // 0..1 out
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({p, out = 0, children, style}) => (
	<div style={{overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
		<div
			style={{
				transform: `translateY(${(1 - p) * 110 - out * 110}%) rotate(${(1 - p) * 6}deg)`,
				transformOrigin: 'left bottom',
				...style,
			}}
		>
			{children}
		</div>
	</div>
);

export const Chip: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({
	children,
	bg = C.ink,
	color = C.cream,
	style,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 10,
			padding: '10px 20px',
			borderRadius: 999,
			background: bg,
			color,
			fontFamily: MONO,
			fontWeight: 700,
			fontSize: 22,
			letterSpacing: 2,
			textTransform: 'uppercase',
			...style,
		}}
	>
		{children}
	</div>
);
