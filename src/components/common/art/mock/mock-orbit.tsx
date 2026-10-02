// style-lint-ignore-file hardcoded-jsx-text -- decorative SVG screen mock labels (not UI copy), ported verbatim from design/Mock.dc.html
import React from "react";
import { mockData } from "@/lib/art/mock-data";

interface MockOrbitProps {}

export const MockOrbit: React.FC<MockOrbitProps> = () => {
	return (
		<>
			<text
				x="24"
				y="68"
				fill="currentColor"
				fontSize="22"
				fontWeight="900"
				letterSpacing="-0.05em"
			>
				Season quests
			</text>
			<rect
				x="300"
				y="48"
				width="150"
				height="26"
				rx="13"
				fill="currentColor"
			/>
			<text
				x="375"
				y="65"
				textAnchor="middle"
				className="fill-card"
				fontSize="9"
				fontWeight="800"
			>
				Moon Power · 12,450 XP
			</text>
			{mockData.quests.map((q) => {
				const tone = q.filled ? "fill-card" : "fill-current";
				return (
					<g key={q.title}>
						<rect
							x={q.x}
							y={q.y}
							width="134"
							height="140"
							rx="14"
							fill={q.filled ? "currentColor" : "none"}
							stroke="currentColor"
							strokeOpacity="0.2"
						/>
						<rect
							x={q.x + 78}
							y={q.y + 12}
							width="44"
							height="16"
							rx="8"
							className={q.filled ? "fill-card" : "fill-current"}
						/>
						<text
							x={q.x + 100}
							y={q.y + 23}
							textAnchor="middle"
							className={q.filled ? "fill-current" : "fill-card"}
							fontSize="7"
							fontWeight="800"
						>
							{q.xp}
						</text>
						<text
							x={q.x + 14}
							y={q.y + 82}
							className={tone}
							fontSize="10"
							fontWeight="800"
						>
							{q.title}
						</text>
						<rect
							x={q.x + 14}
							y={q.y + 92}
							width="96"
							height="4"
							rx="2"
							className={tone}
							opacity="0.35"
						/>
						<rect
							x={q.x + 14}
							y={q.y + 116}
							width="110"
							height="6"
							rx="3"
							className={tone}
							opacity="0.18"
						/>
						<rect
							x={q.x + 14}
							y={q.y + 116}
							width={q.pw}
							height="6"
							rx="3"
							className={tone}
						/>
					</g>
				);
			})}
			<rect
				x="466"
				y="88"
				width="158"
				height="296"
				rx="14"
				fill="currentColor"
				opacity="0.06"
			/>
			<text
				x="480"
				y="112"
				fill="currentColor"
				fontSize="9"
				fontWeight="800"
				letterSpacing="0.1em"
			>
				LEADERBOARD
			</text>
			{mockData.board.map((lb) => (
				<g key={lb.n}>
					<text
						x="480"
						y={lb.y}
						fill="currentColor"
						fontSize="9"
						fontWeight="800"
						opacity="0.5"
					>
						{lb.n}
					</text>
					<circle
						cx="506"
						cy={lb.y - 3}
						r="8"
						fill="currentColor"
						opacity={lb.first ? 1 : 0.3}
					/>
					<rect
						x="520"
						y={lb.y - 6}
						width={lb.w}
						height="5"
						rx="2.5"
						fill="currentColor"
						opacity="0.5"
					/>
				</g>
			))}
		</>
	);
};

export default MockOrbit;
