import React from "react";

const CAPTIONS = [
	{ x: 18, y: 24, text: "MOON POWER +120 XP" },
	{ x: 300, y: 284, text: "QUEST 07/12" },
];

interface MotifOrbitProps {}

export const MotifOrbit: React.FC<MotifOrbitProps> = () => {
	return (
		<>
			<g fill="none" stroke="currentColor" strokeWidth="1">
				<ellipse
					cx="200"
					cy="150"
					rx="170"
					ry="54"
					transform="rotate(-18 200 150)"
					opacity="0.45"
				/>
				<ellipse
					cx="200"
					cy="150"
					rx="120"
					ry="92"
					transform="rotate(24 200 150)"
					opacity="0.35"
				/>
				<circle
					cx="200"
					cy="150"
					r="70"
					strokeDasharray="2 5"
					opacity="0.5"
				/>
			</g>
			<circle cx="200" cy="150" r="28" fill="currentColor" />
			<g className="origin-[200px_150px] transform-view motion-safe:animate-art-spin-slow">
				<circle cx="270" cy="150" r="5" fill="currentColor" />
				<circle cx="130" cy="150" r="3" fill="currentColor" />
			</g>
			<g className="origin-[200px_150px] transform-view motion-safe:animate-art-spin-rev">
				<circle
					cx="200"
					cy="58"
					r="4"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<circle cx="200" cy="242" r="2.5" fill="currentColor" />
			</g>
			<g
				fill="currentColor"
				fontSize="8"
				letterSpacing="0.1em"
				opacity="0.75"
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

export default MotifOrbit;
