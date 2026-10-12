import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Burst, Can, Chip, Fizz, MaskLine} from './components';
import {C, DISPLAY, ease, lerp, MONO, sp, UI} from './theme';

const fill: React.CSSProperties = {width: 1080, height: 1080, position: 'absolute', inset: 0};

// ===========================================================================
// 1. HOOK (0-30): the pain, in one second.
// ===========================================================================
export const Hook: React.FC = () => {
	const f = useCurrentFrame();
	const settle = sp(f, -3, {damping: 9, stiffness: 260});
	const shake = Math.max(0, 1 - f / 16);
	const sx = Math.sin(f * 2.7) * 26 * shake;
	const sy = Math.cos(f * 3.3) * 14 * shake;
	const stamp = sp(f, 11, {damping: 10, stiffness: 300});
	const ab = Math.max(0, 1 - f / 9) * 14;
	const glow = 0.5 + 0.5 * Math.sin(f * 0.6);

	return (
		<AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 50%, rgba(255,68,54,${0.28 + glow * 0.14}) 0%, rgba(20,18,16,0) 62%)`,
				}}
			/>
			{/* marquee rows */}
			{[0, 1, 2, 3, 4].map((row) => (
				<div
					key={row}
					style={{
						position: 'absolute',
						top: 30 + row * 214,
						left: 0,
						whiteSpace: 'nowrap',
						fontFamily: DISPLAY,
						fontWeight: 800,
						fontSize: 190,
						lineHeight: 1,
						color: 'transparent',
						WebkitTextStroke: `2px rgba(244,238,227,${row === 2 ? 0 : 0.12})`,
						transform: `translateX(${(row % 2 ? -1 : 1) * (f * 14) - 600}px)`,
					}}
				>
					LIMIT REACHED · LIMIT REACHED · LIMIT REACHED ·
				</div>
			))}
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					transform: `translate(${sx}px, ${sy}px) scale(${1.25 - 0.25 * settle})`,
				}}
			>
				{/* chromatic ghosts */}
				{ab > 0.5 ? (
					<>
						<Toast style={{position: 'absolute', transform: `translateX(${-ab}px)`, opacity: 0.6, filter: 'drop-shadow(0 0 0 #ff0040)'}} tint="#ff2a55" />
						<Toast style={{position: 'absolute', transform: `translateX(${ab}px)`, opacity: 0.6}} tint="#22e0ff" />
					</>
				) : null}
				<Toast style={{position: 'relative'}} />
			</AbsoluteFill>
			{/* stamp */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 690,
					textAlign: 'center',
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontSize: 200,
					letterSpacing: -6,
					color: C.yellow,
					textShadow: `8px 8px 0 ${C.red}`,
					transform: `rotate(-7deg) scale(${f < 11 ? 0 : 2.4 - 1.4 * stamp})`,
					opacity: f < 11 ? 0 : 1,
				}}
			>
				AGAIN?!
			</div>
		</AbsoluteFill>
	);
};

const Toast: React.FC<{style?: React.CSSProperties; tint?: string}> = ({style, tint}) => (
	<div
		style={{
			width: 820,
			padding: '40px 44px',
			borderRadius: 34,
			background: tint ?? C.ink2,
			border: `3px solid ${tint ?? C.red}`,
			boxShadow: tint ? 'none' : `0 0 0 10px rgba(255,68,54,0.15), 0 30px 80px rgba(0,0,0,0.6)`,
			display: 'flex',
			gap: 30,
			alignItems: 'center',
			mixBlendMode: tint ? 'screen' : 'normal',
			...style,
		}}
	>
		<div
			style={{
				width: 104,
				height: 104,
				borderRadius: 52,
				background: tint ?? C.red,
				flexShrink: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: DISPLAY,
				fontWeight: 800,
				fontSize: 74,
				color: C.paper,
			}}
		>
			!
		</div>
		<div style={{fontFamily: UI, color: C.cream}}>
			<div style={{fontWeight: 800, fontSize: 48, lineHeight: 1.08, letterSpacing: -1}}>
				You&apos;ve hit your usage limit.
			</div>
			<div style={{fontSize: 30, opacity: 0.6, marginTop: 10, fontFamily: MONO}}>resets in 4h 59m</div>
		</div>
	</div>
);

// ===========================================================================
// 2. PROMISE (30-90)
// ===========================================================================
export const PromiseScene: React.FC = () => {
	const f = useCurrentFrame();
	const lines = ['Never get', 'blindsided', 'by Claude’s', 'limits again.'];
	const delays = [4, 9, 15, 20];
	const outStart = 48;
	const hi = lerp(f, [12, 22], [0, 1]);
	return (
		<AbsoluteFill style={{background: C.coral, overflow: 'hidden'}}>
			<Fizz color={C.paper} opacity={0.35} seed="p" />
			<AbsoluteFill style={{justifyContent: 'center', padding: '0 80px'}}>
				{lines.map((l, i) => {
					const p = sp(f, delays[i], {damping: 15, stiffness: 190});
					const out = lerp(f, [outStart + i * 2, outStart + 10 + i * 2], [0, 1], ease);
					const isHi = i === 1;
					return (
						<MaskLine key={l} p={p} out={out}>
							<div
								style={{
									fontFamily: DISPLAY,
									fontWeight: 800,
									fontSize: 146,
									lineHeight: 1.0,
									letterSpacing: -5,
									color: isHi ? C.paper : C.ink,
									position: 'relative',
									display: 'inline-block',
									padding: isHi ? '0 18px' : 0,
								}}
							>
								{isHi ? (
									<div
										style={{
											position: 'absolute',
											inset: '10px 0 6px 0',
											background: C.ink,
											transformOrigin: 'left',
											transform: `scaleX(${hi}) skewX(-6deg)`,
											zIndex: 0,
										}}
									/>
								) : null}
								<span style={{position: 'relative'}}>{l}</span>
							</div>
						</MaskLine>
					);
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ===========================================================================
// 3. REVEAL (90-165): the can drops, pops, brand lands.
// ===========================================================================
export const Reveal3: React.FC = () => {
	const f = useCurrentFrame();
	const drop = sp(f, 2, {damping: 11, stiffness: 140, mass: 1});
	const land = sp(f, 13, {damping: 6, stiffness: 300});
	const squash = f < 13 ? 1 : 1 - 0.12 * Math.sin(Math.min(1, land) * Math.PI) * (1 - land * 0.6);
	const tab = sp(f, 22, {damping: 8, stiffness: 400});
	const word = (i: number) => sp(f, 26 + i * 3, {damping: 12, stiffness: 200});
	const rays = f * 0.6;
	const pill = sp(f, 44);

	return (
		<AbsoluteFill style={{background: C.cream, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: 300 - 900,
					top: 560 - 900,
					width: 1800,
					height: 1800,
					background: `repeating-conic-gradient(from ${rays}deg, rgba(238,106,67,0.16) 0deg 9deg, rgba(0,0,0,0) 9deg 18deg)`,
					transform: `scale(${lerp(f, [10, 30], [0, 1])})`,
					borderRadius: '50%',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 120,
					top: 270,
					transform: `translateY(${(1 - drop) * -1100}px) scaleY(${squash}) scaleX(${2 - squash}) rotate(${(1 - drop) * -14}deg)`,
					transformOrigin: '50% 100%',
				}}
			>
				<Can level={0.96} height={600} tab={tab} fizz={f > 22 ? 0.9 : 0.3} id="rv" />
			</div>
			<Burst at={23} x={290} y={290} count={26} power={1.1} seed="rv" />
			<div style={{position: 'absolute', left: 520, top: 320}}>
				<div style={{transform: `translateY(${(1 - word(0)) * 40}px)`, opacity: word(0)}}>
					<Chip>meet</Chip>
				</div>
				<div
					style={{
						fontFamily: DISPLAY,
						fontWeight: 800,
						fontSize: 168,
						lineHeight: 0.9,
						letterSpacing: -7,
						marginTop: 24,
					}}
				>
					{['Diet', 'Claude'].map((w, i) => (
						<MaskLine key={w} p={word(i + 1)}>
							<span style={{color: i === 1 ? C.coral : C.ink}}>{w}</span>
						</MaskLine>
					))}
				</div>
				<div
					style={{
						marginTop: 34,
						transform: `scale(${pill})`,
						transformOrigin: 'left center',
					}}
				>
					<Chip bg={C.coral} color={C.ink} style={{fontSize: 24, border: `3px solid ${C.ink}`}}>
						Free Chrome extension
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ===========================================================================
// 4. LIVE METER (165-285)
// ===========================================================================
const MSGS: {me: boolean; text: string; bars?: number}[] = [
	{me: true, text: 'Refactor my auth module'},
	{me: false, text: 'Here’s a cleaner version:', bars: 3},
	{me: true, text: 'Now add tests'},
	{me: false, text: 'Added 14 tests ✓', bars: 2},
	{me: true, text: 'Explain the edge cases'},
	{me: false, text: 'Sure, there are three:', bars: 3},
];
const MSG_AT = [8, 22, 36, 50, 64, 78];

export const Meter: React.FC = () => {
	const f = useCurrentFrame();
	const steps = MSG_AT.reduce((acc, at) => acc + sp(f, at + 3, {damping: 18, stiffness: 120}), 0);
	const level = 0.94 - steps * 0.11;
	const used = Math.round((1 - level) * 100);
	const head = sp(f, 4);
	const scroll = MSG_AT.slice(4).reduce((acc, at) => acc + sp(f, at, {damping: 16, stiffness: 140}) * 78, 0);
	const secs = Math.max(0, 8047 - Math.floor(f * 23));
	const hh = Math.floor(secs / 3600);
	const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
	const ss = String(secs % 60).padStart(2, '0');
	const danger = used >= 70;

	return (
		<AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: `linear-gradient(rgba(244,238,227,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(244,238,227,0.05) 2px, transparent 2px)`,
					backgroundSize: '60px 60px',
					backgroundPosition: `0 ${f * 1.5}px`,
				}}
			/>
			<div style={{position: 'absolute', left: 70, top: 64, opacity: head, transform: `translateY(${(1 - head) * 30}px)`}}>
				<Chip bg={C.coral} color={C.ink}>
					<span style={{width: 12, height: 12, borderRadius: 6, background: C.ink, opacity: f % 20 < 10 ? 1 : 0.3}} />
					Live usage meter
				</Chip>
				<div
					style={{
						fontFamily: DISPLAY,
						fontWeight: 800,
						fontSize: 78,
						letterSpacing: -3,
						color: C.cream,
						marginTop: 18,
						lineHeight: 1,
					}}
				>
					Watch your limit <span style={{color: C.coral}}>drain.</span>
				</div>
			</div>

			{/* chat mock */}
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 270,
					width: 540,
					height: 530,
					borderRadius: 30,
					background: C.ink2,
					border: `2px solid ${C.ink3}`,
					overflow: 'hidden',
					transform: `translateX(${(1 - sp(f, 0)) * -600}px)`,
				}}
			>
				<div
					style={{
						height: 58,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						padding: '0 22px',
						borderBottom: `2px solid ${C.ink3}`,
						background: C.ink2,
						position: 'relative',
						zIndex: 2,
					}}
				>
					{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
						<div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
					))}
					<div style={{marginLeft: 14, fontFamily: MONO, fontSize: 20, color: C.cream, opacity: 0.55}}>
						claude.ai/chat
					</div>
				</div>
				<div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 14, transform: `translateY(${-scroll}px)`}}>
					{MSGS.map((m, i) => {
						const p = sp(f, MSG_AT[i], {damping: 13, stiffness: 220});
						if (f < MSG_AT[i]) return null;
						return (
							<div
								key={i}
								style={{
									alignSelf: m.me ? 'flex-end' : 'flex-start',
									maxWidth: 400,
									padding: '12px 18px',
									borderRadius: 20,
									background: m.me ? C.ink3 : 'transparent',
									border: m.me ? 'none' : `2px solid ${C.ink3}`,
									color: C.cream,
									fontFamily: UI,
									fontSize: 22,
									transform: `scale(${p})`,
									transformOrigin: m.me ? 'right top' : 'left top',
								}}
							>
								{m.text}
								{m.bars
									? new Array(m.bars).fill(0).map((_, b) => (
											<div
												key={b}
												style={{
													height: 8,
													borderRadius: 4,
													marginTop: 8,
													background: C.coral,
													opacity: 0.55,
													width: `${lerp(f, [MSG_AT[i] + 2 + b * 2, MSG_AT[i] + 10 + b * 2], [0, 100 - b * 18 - (i % 2) * 10])}%`,
												}}
											/>
										))
									: null}
							</div>
						);
					})}
				</div>
			</div>

			{/* can + counter */}
			<div style={{position: 'absolute', left: 680, top: 250, transform: `scale(${sp(f, 2)})`}}>
				<Can level={level} height={430} fizz={0.6} id="mt" />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 640,
					width: 340,
					top: 700,
					textAlign: 'center',
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontSize: 96,
					letterSpacing: -4,
					color: danger ? C.yellow : C.cream,
					lineHeight: 1,
				}}
			>
				{used}%<span style={{fontSize: 32, letterSpacing: 0, opacity: 0.6, marginLeft: 8}}>used</span>
			</div>

			{/* windows */}
			<div style={{position: 'absolute', left: 70, right: 70, top: 850, display: 'flex', gap: 30}}>
				{[
					{label: '5-hour session', v: used / 100},
					{label: 'Weekly window', v: 0.31 + (used / 100) * 0.18},
				].map((w, i) => (
					<div key={w.label} style={{flex: 1, opacity: sp(f, 10 + i * 4)}}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								fontFamily: MONO,
								fontSize: 21,
								color: C.cream,
								marginBottom: 10,
							}}
						>
							<span style={{opacity: 0.7}}>{w.label}</span>
							<span>{Math.round(w.v * 100)}%</span>
						</div>
						<div style={{height: 22, borderRadius: 11, background: C.ink3, overflow: 'hidden'}}>
							<div
								style={{
									height: '100%',
									width: `${w.v * 100}%`,
									background: i === 0 ? (danger ? C.yellow : C.coral) : C.mint,
									borderRadius: 11,
								}}
							/>
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 950,
					fontFamily: MONO,
					fontSize: 26,
					color: C.cream,
					opacity: sp(f, 18),
				}}
			>
				<span style={{opacity: 0.55}}>resets in </span>
				<span style={{color: C.mint, fontWeight: 700}}>
					{hh}:{mm}:{ss}
				</span>
			</div>
		</AbsoluteFill>
	);
};

// ===========================================================================
// 5. ALERTS (285-345)
// ===========================================================================
export const Alerts: React.FC = () => {
	const f = useCurrentFrame();
	const n1 = sp(f, 4, {damping: 13, stiffness: 200});
	const n2 = sp(f, 24, {damping: 13, stiffness: 200});
	const bell = Math.sin(f * 1.4) * 18 * Math.max(0, 1 - ((f - 4) % 20) / 14) * (f > 4 ? 1 : 0);
	const big1 = sp(f, 2, {damping: 20});
	const big2 = sp(f, 22, {damping: 20});
	const head = sp(f, 30);
	return (
		<AbsoluteFill style={{background: C.cream, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: -20,
					top: 40,
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontSize: 420,
					letterSpacing: -24,
					lineHeight: 0.82,
					color: 'transparent',
					WebkitTextStroke: `4px ${C.coral}`,
					transform: `translateX(${(1 - big1) * -300}px)`,
				}}
			>
				70%
			</div>
			<div
				style={{
					position: 'absolute',
					right: -30,
					top: 400,
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontSize: 420,
					letterSpacing: -24,
					lineHeight: 0.82,
					color: C.red,
					transform: `translateX(${(1 - big2) * 400}px)`,
				}}
			>
				90%
			</div>
			<Notif
				p={n1}
				top={230}
				accent={C.yellow}
				title="70% of your session used"
				body="Pace yourself. Resets in 2h 14m."
				bell={f < 24 ? bell : 0}
			/>
			<Notif
				p={n2}
				top={450}
				accent={C.red}
				title="90% used. Time to wrap up."
				body="Fork & Compress to keep going."
				bell={f >= 24 ? bell : 0}
			/>
			<div
				style={{
					position: 'absolute',
					left: 70,
					bottom: 70,
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontSize: 92,
					letterSpacing: -4,
					lineHeight: 0.95,
					color: C.ink,
				}}
			>
				<MaskLine p={head}>Heads-up</MaskLine>
				<MaskLine p={sp(f, 34)}>
					<span style={{color: C.coralD}}>before the wall.</span>
				</MaskLine>
			</div>
		</AbsoluteFill>
	);
};

const Notif: React.FC<{p: number; top: number; accent: string; title: string; body: string; bell: number}> = ({
	p,
	top,
	accent,
	title,
	body,
	bell,
}) => (
	<div
		style={{
			position: 'absolute',
			left: 130,
			top,
			width: 820,
			padding: '28px 32px',
			borderRadius: 30,
			background: C.paper,
			border: `4px solid ${C.ink}`,
			boxShadow: `12px 12px 0 ${C.ink}`,
			display: 'flex',
			gap: 26,
			alignItems: 'center',
			transform: `translateX(${(1 - p) * 1100}px) rotate(${(1 - p) * 8}deg)`,
		}}
	>
		<div
			style={{
				width: 96,
				height: 96,
				borderRadius: 24,
				background: accent,
				border: `4px solid ${C.ink}`,
				flexShrink: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transform: `rotate(${bell}deg)`,
			}}
		>
			<svg width="52" height="52" viewBox="0 0 24 24" fill={C.ink}>
				<path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3a1.5 1.5 0 0 0-3 0v1.16A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" />
			</svg>
		</div>
		<div style={{fontFamily: UI, color: C.ink}}>
			<div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, opacity: 0.6, textTransform: 'uppercase'}}>
				Diet Claude · now
			</div>
			<div style={{fontWeight: 800, fontSize: 40, letterSpacing: -1, marginTop: 4}}>{title}</div>
			<div style={{fontSize: 27, opacity: 0.7, marginTop: 4}}>{body}</div>
		</div>
	</div>
);

// ===========================================================================
// 6. TOOLKIT (345-435)
// ===========================================================================
export const Toolkit: React.FC = () => {
	const f = useCurrentFrame();
	const head = sp(f, 3);
	const tiles = [
		{bg: C.coral, title: 'Context gauge', vis: <Gauge f={f - 10} />},
		{bg: C.yellow, title: 'Cache-warmth timer', vis: <CacheRing f={f - 15} />},
		{bg: C.mint, title: 'New-chat advisor', vis: <Advisor f={f - 20} />},
		{bg: C.paper, title: 'Fork & Compress', vis: <Compress f={f - 25} />},
	];
	return (
		<AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 70, top: 60}}>
				<MaskLine p={head}>
					<div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: -4, color: C.cream, lineHeight: 1}}>
						Spend <span style={{color: C.coral}}>fewer</span> tokens.
					</div>
				</MaskLine>
				<div style={{fontFamily: MONO, fontSize: 24, color: C.cream, opacity: 0.6 * sp(f, 8), marginTop: 12, letterSpacing: 1}}>
					A token-saving toolkit, built in.
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 270,
					width: 940,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 28,
				}}
			>
				{tiles.map((t, i) => {
					const p = sp(f, 6 + i * 5, {damping: 12, stiffness: 180});
					return (
						<div
							key={t.title}
							style={{
								height: 350,
								borderRadius: 34,
								background: t.bg,
								border: `4px solid ${C.ink}`,
								padding: 30,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								transform: `perspective(1200px) rotateX(${(1 - p) * -80}deg) translateY(${(1 - p) * 120}px) scale(${0.7 + 0.3 * p})`,
								opacity: Math.min(1, p * 2),
								overflow: 'hidden',
							}}
						>
							<div style={{height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{t.vis}</div>
							<div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 42, letterSpacing: -1.5, color: C.ink}}>{t.title}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Gauge: React.FC<{f: number}> = ({f}) => {
	const v = lerp(f, [0, 30], [0, 0.62]) + Math.sin(f * 0.3) * 0.015 * (f > 30 ? 1 : 0);
	const ang = -180 + v * 180;
	const R = 110;
	const arc = (a0: number, a1: number) => {
		const p = (a: number) => [150 + R * Math.cos((a * Math.PI) / 180), 150 + R * Math.sin((a * Math.PI) / 180)];
		const [x0, y0] = p(a0);
		const [x1, y1] = p(a1);
		return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
	};
	return (
		<svg width="300" height="200" viewBox="0 0 300 190">
			<path d={arc(-180, 0)} stroke={C.ink} strokeOpacity={0.2} strokeWidth={26} fill="none" strokeLinecap="round" />
			<path d={arc(-180, ang)} stroke={C.ink} strokeWidth={26} fill="none" strokeLinecap="round" />
			<line
				x1="150"
				y1="150"
				x2={150 + 80 * Math.cos((ang * Math.PI) / 180)}
				y2={150 + 80 * Math.sin((ang * Math.PI) / 180)}
				stroke={C.paper}
				strokeWidth={8}
				strokeLinecap="round"
			/>
			<circle cx="150" cy="150" r="14" fill={C.ink} />
			<text x="150" y="186" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="22" fill={C.ink}>
				{Math.round(v * 200)}k / 200k
			</text>
		</svg>
	);
};

const CacheRing: React.FC<{f: number}> = ({f}) => {
	const t = Math.max(0, 300 - Math.max(0, f) * 3);
	const p = t / 300;
	const r = 80;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: 200, height: 200}}>
			<svg width="200" height="200" viewBox="0 0 200 200" style={{transform: 'rotate(-90deg)'}}>
				<circle cx="100" cy="100" r={r} stroke={C.ink} strokeOpacity={0.2} strokeWidth={20} fill="none" />
				<circle
					cx="100"
					cy="100"
					r={r}
					stroke={C.ink}
					strokeWidth={20}
					fill="none"
					strokeDasharray={c}
					strokeDashoffset={c * (1 - p)}
					strokeLinecap="round"
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: MONO,
					fontWeight: 700,
					color: C.ink,
				}}
			>
				<div style={{fontSize: 40}}>
					{Math.floor(t / 60)}:{String(Math.floor(t % 60)).padStart(2, '0')}
				</div>
				<div style={{fontSize: 16, letterSpacing: 2}}>CACHE WARM</div>
			</div>
		</div>
	);
};

const Advisor: React.FC<{f: number}> = ({f}) => {
	const b1 = sp(f, 0);
	const b2 = sp(f, 8);
	const pulse = 1 + Math.max(0, Math.sin((f - 16) * 0.35)) * 0.07 * (f > 16 ? 1 : 0);
	return (
		<div style={{width: 360, display: 'flex', flexDirection: 'column', gap: 14, fontFamily: UI}}>
			<div
				style={{
					alignSelf: 'flex-start',
					padding: '12px 18px',
					borderRadius: 18,
					background: C.paper,
					border: `3px solid ${C.ink}`,
					fontSize: 22,
					fontWeight: 600,
					transform: `scale(${b1})`,
					transformOrigin: 'left',
				}}
			>
				This chat is getting heavy
			</div>
			<div
				style={{
					alignSelf: 'flex-end',
					padding: '14px 24px',
					borderRadius: 999,
					background: C.ink,
					color: C.mint,
					fontSize: 26,
					fontWeight: 800,
					transform: `scale(${b2 * pulse})`,
					transformOrigin: 'right',
				}}
			>
				＋ Start fresh →
			</div>
		</div>
	);
};

const Compress: React.FC<{f: number}> = ({f}) => {
	const p = lerp(f, [8, 26], [0, 1], ease);
	return (
		<div style={{position: 'relative', width: 360, height: 210}}>
			{new Array(7).fill(0).map((_, i) => {
				const y0 = i * 29;
				const y1 = 70;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: i % 2 ? 60 : 0,
							top: interpolate(p, [0, 1], [y0, y1]),
							width: i % 2 ? 300 : 260 - (i % 3) * 30,
							height: 20,
							borderRadius: 10,
							background: C.ink,
							opacity: interpolate(p, [0, 0.8, 1], [0.25 + (i % 3) * 0.2, 0.3, 0]),
						}}
					/>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: 20,
					right: 20,
					top: 50,
					padding: '14px 20px',
					borderRadius: 20,
					background: C.coral,
					border: `3px solid ${C.ink}`,
					fontFamily: MONO,
					fontWeight: 700,
					fontSize: 22,
					color: C.ink,
					transform: `scale(${sp(f, 24, {damping: 9, stiffness: 260})})`,
					textAlign: 'center',
				}}
			>
				48 msgs → 1 summary
			</div>
		</div>
	);
};

// ===========================================================================
// 7. HOW TO USE (435-510)
// ===========================================================================
export const HowTo: React.FC = () => {
	const f = useCurrentFrame();
	const steps = [
		{n: 1, title: 'Add to Chrome', at: 6},
		{n: 2, title: 'Open claude.ai', at: 22},
		{n: 3, title: 'Watch the can', at: 38},
	];
	return (
		<AbsoluteFill style={{background: C.coral, overflow: 'hidden'}}>
			<Fizz color={C.ink} opacity={0.12} seed="h" count={18} />
			<div style={{position: 'absolute', left: 70, top: 60}}>
				<Chip>How it works</Chip>
				<MaskLine p={sp(f, 2)}>
					<div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, letterSpacing: -4, color: C.ink, marginTop: 16, lineHeight: 1}}>
						3 steps. That’s it.
					</div>
				</MaskLine>
			</div>
			{steps.map((s, i) => {
				const p = sp(f, s.at, {damping: 14, stiffness: 190});
				return (
					<div
						key={s.n}
						style={{
							position: 'absolute',
							left: 70,
							top: 290 + i * 245,
							width: 940,
							height: 215,
							borderRadius: 34,
							background: C.paper,
							border: `4px solid ${C.ink}`,
							boxShadow: `12px 12px 0 ${C.ink}`,
							display: 'flex',
							alignItems: 'center',
							padding: '0 36px',
							gap: 34,
							transform: `translateX(${(1 - p) * 1200}px) rotate(${(1 - p) * 6}deg)`,
						}}
					>
						<div
							style={{
								width: 120,
								height: 120,
								borderRadius: 60,
								background: C.ink,
								color: C.coral,
								fontFamily: DISPLAY,
								fontWeight: 800,
								fontSize: 76,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
							}}
						>
							{s.n}
						</div>
						<div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 58, letterSpacing: -2, color: C.ink, flex: 1}}>
							{s.title}
						</div>
						<div style={{width: 260, display: 'flex', justifyContent: 'center'}}>
							{i === 0 ? <AddBtn f={f - s.at} /> : i === 1 ? <UrlBar f={f - s.at} /> : <MiniCan f={f - s.at} />}
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const AddBtn: React.FC<{f: number}> = ({f}) => {
	const click = 12;
	const done = f >= click;
	const press = f >= click && f < click + 4 ? 0.9 : 1;
	const cx = lerp(f, [2, click], [120, 0]);
	const cy = lerp(f, [2, click], [90, 8]);
	return (
		<div style={{position: 'relative'}}>
			<div
				style={{
					padding: '18px 26px',
					borderRadius: 16,
					background: done ? C.mint : '#1A73E8',
					color: done ? C.ink : '#fff',
					fontFamily: UI,
					fontWeight: 800,
					fontSize: 24,
					border: `3px solid ${C.ink}`,
					transform: `scale(${press})`,
					whiteSpace: 'nowrap',
				}}
			>
				{done ? 'Added ✓' : 'Add to Chrome'}
			</div>
			<svg
				width="44"
				height="44"
				viewBox="0 0 24 24"
				style={{position: 'absolute', left: 120 + cx, top: 30 + cy}}
			>
				<path d="M4 2l16 9-7 2-3 7z" fill={C.paper} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" />
			</svg>
		</div>
	);
};

const UrlBar: React.FC<{f: number}> = ({f}) => {
	const txt = 'claude.ai';
	const n = Math.max(0, Math.min(txt.length, Math.floor((f - 3) / 1.3)));
	return (
		<div
			style={{
				width: 250,
				padding: '16px 20px',
				borderRadius: 999,
				background: C.cream,
				border: `3px solid ${C.ink}`,
				fontFamily: MONO,
				fontSize: 26,
				fontWeight: 700,
				color: C.ink,
			}}
		>
			{txt.slice(0, n)}
			<span style={{opacity: f % 10 < 5 ? 1 : 0}}>|</span>
		</div>
	);
};

const MiniCan: React.FC<{f: number}> = ({f}) => (
	<Can level={lerp(f, [4, 30], [0.95, 0.45])} height={180} fizz={0.4} id="mini" />
);

// ===========================================================================
// 8. CTA (510-600): refill, overflow, URL.
// ===========================================================================
export const Cta: React.FC = () => {
	const f = useCurrentFrame();
	const level = lerp(f, [4, 40], [0.12, 1.0], ease);
	const pop = sp(f, 0, {damping: 12});
	const l1 = sp(f, 6);
	const url = sp(f, 30, {damping: 10, stiffness: 220});
	const sub = sp(f, 36);
	const iris = lerp(f, [78, 90], [0, 1], ease);
	const pulse = 1 + Math.max(0, Math.sin(((f - 45) / 15) * Math.PI * 2)) * 0.03 * (f > 45 ? 1 : 0);
	return (
		<AbsoluteFill style={{background: C.cream, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: 540 - 800,
					top: 560 - 800,
					width: 1600,
					height: 1600,
					background: `repeating-conic-gradient(from ${-f * 0.8}deg, rgba(238,106,67,0.14) 0deg 8deg, rgba(0,0,0,0) 8deg 16deg)`,
					borderRadius: '50%',
				}}
			/>
			<Fizz color={C.coral} opacity={0.35} seed="c" count={30} />
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 60,
					textAlign: 'center',
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontSize: 112,
					letterSpacing: -5,
					color: C.ink,
					lineHeight: 1,
				}}
			>
				<MaskLine p={l1}>
					Stay on the <span style={{color: C.coral}}>diet.</span>
				</MaskLine>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 540 - 140,
					top: 230,
					transform: `scale(${pop * pulse})`,
					transformOrigin: '50% 100%',
				}}
			>
				<Can level={level} height={500} tab={1} fizz={1} id="cta" />
			</div>
			<Burst at={40} x={540} y={250} count={30} power={1.2} seed="cta" />
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 790,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 18,
				}}
			>
				<div
					style={{
						padding: '22px 48px',
						borderRadius: 999,
						background: C.ink,
						color: C.cream,
						fontFamily: DISPLAY,
						fontWeight: 800,
						fontSize: 76,
						letterSpacing: -2,
						transform: `scale(${url})`,
						boxShadow: `10px 10px 0 ${C.coral}`,
					}}
				>
					dietclaude.com
				</div>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.ink, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>
					FREE CHROME EXTENSION
				</div>
			</div>
			{/* iris back to the hook's ink for a seamless loop */}
			<AbsoluteFill
				style={{
					background: C.ink,
					clipPath: `circle(${iris * 75}% at 50% 50%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

export {fill};
