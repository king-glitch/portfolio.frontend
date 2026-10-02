// style-lint-ignore-file hardcoded-jsx-text -- decorative SVG screen mock labels (not UI copy), ported verbatim from design/Mock.dc.html
import React from "react";
import { mockData } from "@/lib/art/mock-data";

interface MockPinsAltProps {}

export const MockPinsAlt: React.FC<MockPinsAltProps> = () => {
	return (
		<>
			<text
				x="24"
				y="80"
				fill="currentColor"
				fontSize="18"
				fontWeight="900"
				letterSpacing="-0.04em"
			>
				Ask about a home
			</text>
			{mockData.phoneChat.map((pc) => (
				<g key={pc.y}>
					<rect
						x={pc.x}
						y={pc.y}
						width={pc.w}
						height={pc.h}
						rx="16"
						fill={pc.filled ? "currentColor" : "none"}
						stroke="currentColor"
						strokeOpacity={pc.filled ? 0 : 0.3}
					/>
					<rect
						x={pc.x + 14}
						y={pc.y + 15}
						width={pc.lw1}
						height="5"
						rx="2.5"
						className={pc.filled ? "fill-card" : "fill-current"}
						opacity="0.75"
					/>
					<rect
						x={pc.x + 14}
						y={pc.y + 28}
						width={pc.lw2}
						height="5"
						rx="2.5"
						className={pc.filled ? "fill-card" : "fill-current"}
						opacity="0.75"
					/>
				</g>
			))}
			<rect
				x="20"
				y="330"
				width="220"
				height="150"
				rx="18"
				className="fill-card"
				stroke="currentColor"
				strokeOpacity="0.35"
			/>
			<rect
				x="32"
				y="342"
				width="196"
				height="76"
				rx="10"
				fill="currentColor"
				opacity="0.18"
			/>
			<text
				x="32"
				y="440"
				fill="currentColor"
				fontSize="11"
				fontWeight="800"
			>
				[LISTING TITLE]
			</text>
			<rect
				x="32"
				y="452"
				width="64"
				height="16"
				rx="8"
				fill="currentColor"
			/>
			<text
				x="64"
				y="463"
				textAnchor="middle"
				className="fill-card"
				fontSize="7"
				fontWeight="800"
			>
				Low risk
			</text>
			<rect
				x="20"
				y="520"
				width="260"
				height="44"
				rx="22"
				fill="none"
				stroke="currentColor"
				strokeOpacity="0.35"
			/>
			<circle cx="258" cy="542" r="14" fill="currentColor" />
			<path
				d="M252 542 L264 542 M259 537 L264 542 L259 547"
				fill="none"
				className="stroke-card"
				strokeWidth="1.8"
			/>
		</>
	);
};

export default MockPinsAlt;
