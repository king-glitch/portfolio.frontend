import React from "react";

const RINGS = [30, 60, 90, 120];
const BLIPS = [
	{ cx: 248, cy: 96, r: 3.5, blink: true },
	{ cx: 150, cy: 198, r: 3, blink: false },
	{ cx: 276, cy: 190, r: 3, blink: true },
	{ cx: 132, cy: 112, r: 2.5, blink: false },
];
const CAPTIONS = [
	{ x: 276, y: 70, text: "TRK 041 · SUSPECT" },
	{ x: 160, y: 214, text: "TRK 017 · FRIEND" },
	{ x: 18, y: 24, text: "TRML / DR127ADV" },
	{ x: 18, y: 284, text: "RANGE 150 NM" },
];

interface MotifRadarProps {}

export const MotifRadar: React.FC<MotifRadarProps> = () => {
	return (
		<>
			<g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
				{RINGS.map((r) => (
					<circle key={r} cx="200" cy="150" r={r} />
				))}
				<circle cx="200" cy="150" r="150" strokeDasharray="2 6" />
				<path d="M40 150 H360 M200 10 V290" />
				<path
					d="M115 65 L285 235 M285 65 L115 235"
					strokeDasharray="2 6"
				/>
			</g>
			<g className="art-spin">
				<path
					d="M200 150 L200 30 A120 120 0 0 1 284.85 65.15 Z"
					fill="currentColor"
					opacity="0.16"
				/>
				<line
					x1="200"
					y1="150"
					x2="200"
					y2="30"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
			</g>
			<g fill="currentColor">
				{BLIPS.map((b) => (
					<circle
						key={`${b.cx}-${b.cy}`}
						className={b.blink ? "art-blink" : undefined}
						cx={b.cx}
						cy={b.cy}
						r={b.r}
					/>
				))}
			</g>
			<g fill="none" stroke="currentColor" strokeWidth="1.2">
				<rect x="240" y="88" width="16" height="16" />
				<line x1="256" y1="88" x2="272" y2="72" />
				<path d="M276 180 L286 190 L276 200 L266 190 Z" />
			</g>
			<g
				fill="currentColor"
				fontSize="8"
				letterSpacing="0.08em"
				opacity="0.8"
			>
				{CAPTIONS.map((c) => (
					<text key={c.text} x={c.x} y={c.y}>
						{c.text}
					</text>
				))}
			</g>
		</>
	);
};

export default MotifRadar;
