// style-lint-ignore-file hardcoded-jsx-text -- decorative SVG screen mock labels (not UI copy), ported verbatim from design/Mock.dc.html
import React from "react";
import { mockData } from "@/lib/art/mock-data";

interface MockPixelAltProps {}

export const MockPixelAlt: React.FC<MockPixelAltProps> = () => {
	return (
		<>
			<text
				x="24"
				y="84"
				fill="currentColor"
				fontSize="26"
				fontWeight="900"
				letterSpacing="-0.05em"
			>
				Missions
			</text>
			<text
				x="24"
				y="104"
				fill="currentColor"
				fontSize="10"
				opacity="0.6"
			>
				Daily · resets in 06:12
			</text>
			{mockData.missions.map((ms) => {
				const tone = ms.done ? "fill-card" : "fill-current";
				return (
					<g key={ms.y}>
						<rect
							x="20"
							y={ms.y}
							width="260"
							height="62"
							rx="16"
							fill={ms.done ? "currentColor" : "none"}
							stroke="currentColor"
							strokeOpacity="0.2"
						/>
						<text
							x="36"
							y={ms.y + 26}
							className={tone}
							fontSize="11"
							fontWeight="800"
						>
							{ms.t}
						</text>
						<rect
							x="36"
							y={ms.y + 40}
							width="150"
							height="5"
							rx="2.5"
							className={tone}
							opacity="0.2"
						/>
						<rect
							x="36"
							y={ms.y + 40}
							width={ms.pw}
							height="5"
							rx="2.5"
							className={tone}
						/>
						<rect
							x="206"
							y={ms.y + 19}
							width="58"
							height="24"
							rx="12"
							className={tone}
						/>
						<text
							x="235"
							y={ms.y + 34}
							textAnchor="middle"
							className={ms.done ? "fill-current" : "fill-card"}
							fontSize="9"
							fontWeight="900"
						>
							{ms.c}
						</text>
					</g>
				);
			})}
		</>
	);
};

export default MockPixelAlt;
