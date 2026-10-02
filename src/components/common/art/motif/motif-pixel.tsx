import React from "react";
import { motifPixels } from "@/lib/art/motif-data";

const SIDE_LINES = [
	{ x1: 40, y: 60, x2: 120 },
	{ x1: 40, y: 74, x2: 100 },
	{ x1: 280, y: 226, x2: 360 },
	{ x1: 300, y: 240, x2: 360 },
];

interface MotifPixelProps {}

export const MotifPixel: React.FC<MotifPixelProps> = () => {
	return (
		<>
			<rect
				x="140"
				y="22"
				width="120"
				height="256"
				rx="20"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<rect
				x="182"
				y="30"
				width="36"
				height="6"
				rx="3"
				fill="currentColor"
				opacity="0.6"
			/>
			{motifPixels.map((px) => (
				<rect
					key={`${px.x}-${px.y}`}
					x={px.x}
					y={px.y}
					width="10"
					height="10"
					fill="currentColor"
					className={px.blink ? "art-blink" : undefined}
					opacity={px.op}
				/>
			))}
			<g stroke="currentColor" strokeWidth="1" opacity="0.35">
				{SIDE_LINES.map((l) => (
					<line key={l.y} x1={l.x1} y1={l.y} x2={l.x2} y2={l.y} />
				))}
			</g>
		</>
	);
};

export default MotifPixel;
