// style-lint-ignore-file hardcoded-jsx-text -- decorative SVG screen mock labels (not UI copy), ported verbatim from design/Mock.dc.html
import React from "react";
import { mockData } from "@/lib/art/mock-data";

interface MockHexAltProps {}

export const MockHexAlt: React.FC<MockHexAltProps> = () => {
	return (
		<>
			<text
				x="24"
				y="70"
				fill="currentColor"
				fontSize="24"
				fontWeight="900"
				letterSpacing="-0.05em"
			>
				Bridge assets
			</text>
			<text x="24" y="88" fill="currentColor" fontSize="9" opacity="0.6">
				Move items between the game and the chain
			</text>
			<rect
				x="24"
				y="108"
				width="250"
				height="190"
				rx="14"
				fill="none"
				stroke="currentColor"
				strokeOpacity="0.25"
			/>
			<text
				x="40"
				y="132"
				fill="currentColor"
				fontSize="9"
				fontWeight="800"
				letterSpacing="0.1em"
			>
				IN GAME
			</text>
			<rect
				x="366"
				y="108"
				width="250"
				height="190"
				rx="14"
				fill="currentColor"
				opacity="0.06"
			/>
			<text
				x="382"
				y="132"
				fill="currentColor"
				fontSize="9"
				fontWeight="800"
				letterSpacing="0.1em"
			>
				ON CHAIN
			</text>
			{mockData.bridgeRows.map((br) => (
				<g key={br.y}>
					<rect
						x="40"
						y={br.y}
						width="218"
						height="30"
						rx="8"
						fill="currentColor"
						opacity={br.opL}
					/>
					<rect
						x="48"
						y={br.y + 7}
						width="16"
						height="16"
						rx="4"
						fill="currentColor"
						opacity="0.4"
					/>
					<text
						x="72"
						y={br.y + 18}
						fill="currentColor"
						fontSize="8"
						fontWeight="700"
					>
						{br.a}
					</text>
					<rect
						x="382"
						y={br.y}
						width="218"
						height="30"
						rx="8"
						fill="currentColor"
						opacity={br.opR}
					/>
					<rect
						x="390"
						y={br.y + 7}
						width="16"
						height="16"
						rx="4"
						fill="currentColor"
						opacity="0.4"
					/>
					<text
						x="414"
						y={br.y + 18}
						fill="currentColor"
						fontSize="8"
						fontWeight="700"
					>
						{br.b}
					</text>
				</g>
			))}
			<circle cx="320" cy="203" r="26" fill="currentColor" />
			<path
				d="M308 203 L330 203 M322 195 L330 203 L322 211"
				fill="none"
				className="stroke-card"
				strokeWidth="2"
			/>
			{mockData.nfts.map((nf) => (
				<g key={nf.x}>
					<rect
						x={nf.x}
						y="314"
						width="110"
						height="72"
						rx="12"
						fill={nf.filled ? "currentColor" : "none"}
						stroke="currentColor"
						strokeOpacity="0.25"
					/>
					<text
						x={nf.x + 12}
						y="374"
						fill={nf.filled ? undefined : "currentColor"}
						className={nf.filled ? "fill-card" : undefined}
						fontSize="8"
						fontWeight="700"
					>
						{nf.name}
					</text>
				</g>
			))}
		</>
	);
};

export default MockHexAlt;
