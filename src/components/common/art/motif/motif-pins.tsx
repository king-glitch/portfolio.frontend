import React from "react";
import { motifPins } from "@/lib/art/motif-data";

const ROADS = [
	"M-10 80 C 80 40, 150 120, 240 70 S 380 60, 420 100",
	"M-10 140 C 70 110, 160 190, 250 130 S 380 120, 420 160",
	"M-10 210 C 90 170, 170 250, 260 200 S 380 190, 420 230",
	"M0 186 L400 120",
	"M140 0 L190 300",
];
const CAPTIONS = [
	{ y: 24, text: "4,000+ PINS" },
	{ y: 284, text: "CLIMATE RISK · LOW" },
];

interface MotifPinsProps {}

export const MotifPins: React.FC<MotifPinsProps> = () => {
	return (
		<>
			<g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22">
				{ROADS.map((d) => (
					<path key={d} d={d} />
				))}
			</g>
			{motifPins.map((pn) => (
				<circle
					key={`${pn.x}-${pn.y}`}
					cx={pn.x}
					cy={pn.y}
					r={pn.r}
					fill="currentColor"
					opacity={pn.op}
				/>
			))}
			<g fill="currentColor">
				<path d="M248 112 C 248 98, 268 98, 268 112 C 268 122, 258 130, 258 138 C 258 130, 248 122, 248 112 Z" />
				<path
					className="motion-safe:animate-art-blink"
					d="M118 168 C 118 156, 134 156, 134 168 C 134 176, 126 182, 126 188 C 126 182, 118 176, 118 168 Z"
				/>
			</g>
			<circle
				cx="258"
				cy="140"
				r="34"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeDasharray="3 4"
				className="origin-[200px_150px] transform-view motion-safe:animate-art-spin-slow"
			/>
			<g
				fill="currentColor"
				fontSize="8"
				letterSpacing="0.1em"
				opacity="0.75"
			>
				{CAPTIONS.map((c) => (
					<text key={c.text} x="18" y={c.y}>
						{c.text}
					</text>
				))}
			</g>
		</>
	);
};

export default MotifPins;
