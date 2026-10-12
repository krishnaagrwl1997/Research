import { interpolate } from 'remotion';
import { Line, pulse, Section } from '../data';

const LEAF = 'M0,-80 C14,-58 30,-62 44,-70 C40,-48 52,-36 74,-34 C58,-18 60,0 72,14 C48,14 36,24 30,48 C18,36 8,38 0,60 C-8,38 -18,36 -30,48 C-36,24 -48,14 -72,14 C-60,0 -58,-18 -74,-34 C-52,-36 -40,-48 -44,-70 C-30,-62 -14,-58 0,-80 Z';
const SHY = /pretty|cute|kiss|smile|heart|crush|hand|closer|touched/i;

// "Maple", an original leaf buddy who bops along, blinks, and blushes on the flirty lines.
export const Mascot: React.FC<{ t: number; section: Section; line?: Line }> = ({ t, section, line }) => {
  if (section.kind === 'intro' || section.kind === 'outro' || section.kind === 'bridge') return null;
  const loud = section.kind === 'chorus' || section.kind === 'final' || section.kind === 'post';
  const p = pulse(t);
  const enter = interpolate(t, [section.start, section.start + 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hop = loud ? -p * 34 : -Math.abs(Math.sin(t * Math.PI * 1.1)) * 10;
  const blink = (t % 3.2) < 0.12 ? 0.1 : 1;
  const shy = line && SHY.test(line.text) && t >= line.start;
  const spin = section.kind === 'final' ? Math.sin(t * 2) * 14 : Math.sin(t * 1.6) * 6;
  return (
    <svg width={220} height={240} viewBox="-110 -120 220 240"
      style={{ position: 'absolute', left: 40, bottom: 20, transform: `translateY(${hop + (1 - enter) * 260}px)`, overflow: 'visible' }}>
      <ellipse cx={0} cy={108} rx={56 - p * 10} ry={10} fill="rgba(0,0,0,0.25)" />
      <g transform={`rotate(${spin}) scale(${1 + p * 0.06} ${1 - p * 0.05})`}>
        <path d="M0,58 C2,80 -4,96 -12,108" stroke="#7A3410" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={LEAF} fill="#EF7627" stroke="#7A3410" strokeWidth={5} strokeLinejoin="round" />
        <path d="M0,-60 L0,40 M0,-10 L-34,-36 M0,-10 L34,-36 M0,14 L-30,0 M0,14 L30,0" stroke="#C2410C" strokeWidth={3} opacity={0.5} />
        <ellipse cx={-20} cy={-14} rx={8} ry={11 * blink} fill="#2A0F08" />
        <ellipse cx={20} cy={-14} rx={8} ry={11 * blink} fill="#2A0F08" />
        <circle cx={-17} cy={-18} r={3} fill="#fff" opacity={blink} />
        <circle cx={23} cy={-18} r={3} fill="#fff" opacity={blink} />
        <path d={loud ? 'M-14,6 C-10,22 10,22 14,6 Z' : 'M-12,8 C-6,16 6,16 12,8'} fill={loud ? '#7A1020' : 'none'} stroke="#2A0F08" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={-36} cy={6} rx={11} ry={7} fill="#FF6FA8" opacity={shy ? 0.9 : 0.35} />
        <ellipse cx={36} cy={6} rx={11} ry={7} fill="#FF6FA8" opacity={shy ? 0.9 : 0.35} />
      </g>
      {shy && [0, 1, 2].map((i) => {
        const k = ((t - line!.start) * 0.9 + i / 3) % 1;
        return <path key={i} d="M0,6 C-10,-2 -7,-11 0,-6 C7,-11 10,-2 0,6 Z" fill="#FF4F8B" opacity={1 - k}
          transform={`translate(${40 + i * 18} ${-70 - k * 90}) scale(${1.4 + k})`} />;
      })}
    </svg>
  );
};
