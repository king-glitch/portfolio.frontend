import React from "react";
import { motifSprouts } from "@/lib/art/motif-data";

const LINES = [
	{ y: 236, dash: undefined, op: 0.6 },
	{ y: 252, dash: "10 6", op: 0.45 },
	{ y: 268, dash: "6 8", op: 0.35 },
	{ y: 284, dash: "3 9", op: 0.25 },
];
const STARS = [
	{ cx: 70, cy: 60, r: 1.6, blink: true },
	{ cx: 330, cy: 48, r: 1.6, blink: false },
	{ cx: 348, cy: 120, r: 1.2, blink: true },
	{ cx: 54, cy: 150, r: 1.2, blink: false },
];

interface MotifMoonProps {}

export const MotifMoon: React.FC<MotifMoonProps> = () => {
	return (
		<>
			<g className="motion-safe:animate-art-float">
				<circle
					cx="200"
					cy="120"
					r="88"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					opacity="0.4"
				/>
				<path
					d="M200 32 A88 88 0 1 1 200 208 A58 88 0 1 0 200 32 Z"
					fill="currentColor"
				/>
			</g>
			<g stroke="currentColor" strokeWidth="1" fill="none">
				{LINES.map((l) => (
					<line
						key={l.y}
						x1="20"
						y1={l.y}
						x2="380"
						y2={l.y}
						strokeDasharray={l.dash}
						opacity={l.op}
					/>
				))}
			</g>
			{motifSprouts.map((sp) => (
				<g
					key={sp.x}
					stroke="currentColor"
					strokeWidth="1.2"
					fill="none"
				>
					<line x1={sp.x} y1="236" x2={sp.x} y2={sp.top} />
					<path d={sp.leaf} />
				</g>
			))}
			<g fill="currentColor" opacity="0.6">
				{STARS.map((s) => (
					<circle
						key={`${s.cx}-${s.cy}`}
						className={
							s.blink
								? "motion-safe:animate-art-blink"
								: undefined
						}
						cx={s.cx}
						cy={s.cy}
						r={s.r}
					/>
				))}
			</g>
		</>
	);
};

export default MotifMoon;
