// style-lint-ignore-file hardcoded-jsx-text -- decorative SVG screen mock labels (not UI copy), ported verbatim from design/Mock.dc.html
import React from "react";
import { mockData } from "@/lib/art/mock-data";

const MESSAGES = [
	{ x: 502, y: 200, width: 96, opacity: 0.12 },
	{ x: 522, y: 222, width: 96, opacity: 0.25 },
	{ x: 502, y: 244, width: 70, opacity: 0.12 },
];

interface MockRadarProps {}

export const MockRadar: React.FC<MockRadarProps> = () => {
	return (
		<>
			<rect
				x="0"
				y="28"
				width="150"
				height="372"
				fill="currentColor"
				opacity="0.04"
			/>
			<text
				x="14"
				y="50"
				fill="currentColor"
				fontSize="8"
				fontWeight="700"
				letterSpacing="0.12em"
				opacity="0.6"
			>
				TRACKS · LIVE
			</text>
			{mockData.tracks.map((t) => (
				<g key={t.y}>
					<rect
						x="10"
						y={t.y}
						width="130"
						height="30"
						rx="6"
						fill="currentColor"
						opacity={t.bgop}
					/>
					<rect
						x="18"
						y={t.y + 8}
						width="8"
						height="8"
						fill={t.enemy ? "currentColor" : "none"}
						stroke="currentColor"
					/>
					<text
						x="34"
						y={t.y + 14}
						fill="currentColor"
						fontSize="8"
						fontWeight="700"
					>
						{t.label}
					</text>
					<rect
						x="34"
						y={t.y + 20}
						width={t.w}
						height="3"
						rx="1.5"
						fill="currentColor"
						opacity="0.35"
					/>
				</g>
			))}
			<g fill="none" stroke="currentColor" opacity="0.35">
				{[40, 80, 120].map((r) => (
					<circle key={r} cx="320" cy="214" r={r} />
				))}
				<circle cx="320" cy="214" r="160" strokeDasharray="2 6" />
				<path d="M160 214 H480 M320 40 V390" />
			</g>
			<g className="art-spin" style={{ transformOrigin: "320px 214px" }}>
				<path
					d="M320 214 L320 94 A120 120 0 0 1 404.85 129.15 Z"
					fill="currentColor"
					opacity="0.16"
				/>
				<line
					x1="320"
					y1="214"
					x2="320"
					y2="94"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
			</g>
			<rect
				x="364"
				y="150"
				width="10"
				height="10"
				fill="currentColor"
				className="art-blink"
			/>
			<circle cx="268" cy="262" r="4" fill="currentColor" />
			<circle cx="350" cy="296" r="4" fill="currentColor" />
			<circle cx="250" cy="170" r="3" fill="none" stroke="currentColor" />
			<text
				x="380"
				y="148"
				fill="currentColor"
				fontSize="8"
				fontWeight="700"
			>
				TRK 041
			</text>
			<rect
				x="490"
				y="40"
				width="140"
				height="120"
				rx="10"
				fill="currentColor"
			/>
			<g className="fill-card">
				<text
					x="502"
					y="60"
					fontSize="8"
					fontWeight="800"
					letterSpacing="0.12em"
				>
					ALERT · SUSPECT
				</text>
				<text
					x="502"
					y="88"
					fontSize="20"
					fontWeight="900"
					letterSpacing="-0.04em"
				>
					TRK 041
				</text>
				<rect
					x="502"
					y="100"
					width="90"
					height="4"
					rx="2"
					opacity="0.5"
				/>
				<rect
					x="502"
					y="110"
					width="60"
					height="4"
					rx="2"
					opacity="0.5"
				/>
				<rect x="502" y="128" width="54" height="20" rx="10" />
			</g>
			<text
				x="529"
				y="141"
				textAnchor="middle"
				fill="currentColor"
				fontSize="7"
				fontWeight="800"
			>
				FRIEND
			</text>
			<rect
				x="562"
				y="128"
				width="56"
				height="20"
				rx="10"
				fill="none"
				className="stroke-card"
			/>
			<text
				x="590"
				y="141"
				textAnchor="middle"
				className="fill-card"
				fontSize="7"
				fontWeight="800"
			>
				ENEMY
			</text>
			<rect
				x="490"
				y="172"
				width="140"
				height="150"
				rx="10"
				fill="none"
				stroke="currentColor"
				strokeOpacity="0.25"
			/>
			<text
				x="502"
				y="190"
				fill="currentColor"
				fontSize="8"
				fontWeight="700"
				letterSpacing="0.12em"
				opacity="0.6"
			>
				COMMS · ENCRYPTED
			</text>
			{MESSAGES.map((m) => (
				<rect key={m.y} {...m} height="16" rx="8" fill="currentColor" />
			))}
			<rect
				x="502"
				y="292"
				width="56"
				height="20"
				rx="10"
				fill="currentColor"
			/>
			<text
				x="530"
				y="305"
				textAnchor="middle"
				className="fill-card"
				fontSize="7"
				fontWeight="800"
			>
				VOICE
			</text>
			<rect
				x="564"
				y="292"
				width="54"
				height="20"
				rx="10"
				fill="none"
				stroke="currentColor"
			/>
			<text
				x="591"
				y="305"
				textAnchor="middle"
				fill="currentColor"
				fontSize="7"
				fontWeight="800"
			>
				MSG
			</text>
			<rect
				x="490"
				y="334"
				width="140"
				height="54"
				rx="10"
				fill="currentColor"
				opacity="0.06"
			/>
			<text
				x="502"
				y="352"
				fill="currentColor"
				fontSize="8"
				opacity="0.6"
			>
				ACCESS · IP ALLOW-LIST
			</text>
			<text
				x="502"
				y="372"
				fill="currentColor"
				fontSize="12"
				fontWeight="800"
			>
				Operator 02
			</text>
		</>
	);
};

export default MockRadar;
