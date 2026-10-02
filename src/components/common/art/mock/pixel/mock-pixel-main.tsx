// style-lint-ignore-file hardcoded-jsx-text -- decorative SVG screen mock labels (not UI copy), ported verbatim from design/Mock.dc.html
import React from "react";
import { mockData } from "@/lib/art/mock-data";

interface MockPixelMainProps {}

export const MockPixelMain: React.FC<MockPixelMainProps> = () => {
	return (
		<>
			{mockData.resources.map((rs) => (
				<g key={rs.x}>
					<rect
						x={rs.x}
						y="56"
						width="80"
						height="24"
						rx="12"
						fill={rs.filled ? "currentColor" : "none"}
						stroke="currentColor"
						strokeOpacity="0.3"
					/>
					<text
						x={rs.x + 40}
						y="72"
						textAnchor="middle"
						className={rs.filled ? "fill-card" : "fill-current"}
						fontSize="10"
						fontWeight="800"
					>
						{rs.t}
					</text>
				</g>
			))}
			<rect
				x="22"
				y="94"
				width="256"
				height="62"
				rx="16"
				fill="currentColor"
			/>
			<text
				x="38"
				y="118"
				className="fill-card"
				fontSize="9"
				fontWeight="700"
				opacity="0.7"
			>
				MISSION
			</text>
			<text
				x="38"
				y="138"
				className="fill-card"
				fontSize="13"
				fontWeight="900"
			>
				Harvest 20 moon carrots
			</text>
			{mockData.pixelPlots.map((pp) => (
				<g key={`${pp.x}-${pp.y}`}>
					<rect
						x={pp.x}
						y={pp.y}
						width="54"
						height="54"
						rx="10"
						fill="currentColor"
						opacity={pp.op}
					/>
					{pp.fruit && (
						<circle
							cx={pp.x + 27}
							cy={pp.y + 27}
							r="9"
							fill="currentColor"
						/>
					)}
				</g>
			))}
			<rect
				x="22"
				y="520"
				width="256"
				height="56"
				rx="20"
				fill="currentColor"
				opacity="0.08"
			/>
			{mockData.tabs.map((tb) => (
				<g key={tb.x}>
					<rect
						x={tb.x}
						y="532"
						width="20"
						height="20"
						rx="6"
						fill="currentColor"
						opacity={tb.op}
					/>
					<text
						x={tb.x + 10}
						y="566"
						textAnchor="middle"
						fill="currentColor"
						fontSize="7"
						fontWeight="700"
						opacity={tb.op}
					>
						{tb.t}
					</text>
				</g>
			))}
		</>
	);
};

export default MockPixelMain;
