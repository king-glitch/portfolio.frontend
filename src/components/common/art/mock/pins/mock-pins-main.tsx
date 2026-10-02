import React from "react";
import { useTranslation } from "react-i18next";
import { mockData } from "@/lib/art/mock-data";

const ROADS = [
	"M200 110 C 290 80, 360 150, 450 110 S 600 90, 640 130",
	"M200 220 C 280 190, 380 270, 470 220 S 600 210, 640 250",
	"M200 320 C 300 290, 380 360, 480 320 S 600 300, 640 340",
	"M200 270 L640 170",
];

interface MockPinsMainProps {}

export const MockPinsMain: React.FC<MockPinsMainProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			<rect
				x="0"
				y="28"
				width="200"
				height="372"
				fill="currentColor"
				opacity="0.05"
			/>
			{mockData.chat.map((ch) => (
				<g key={ch.y}>
					<rect
						x={ch.x}
						y={ch.y}
						width={ch.w}
						height={ch.h}
						rx="10"
						fill={ch.filled ? "currentColor" : "none"}
						stroke="currentColor"
						strokeOpacity={ch.filled ? 0 : 0.3}
					/>
					<rect
						x={ch.x + 10}
						y={ch.y + 10}
						width={ch.lw1}
						height="4"
						rx="2"
						className={ch.filled ? "fill-card" : "fill-current"}
						opacity="0.7"
					/>
					<rect
						x={ch.x + 10}
						y={ch.y + 20}
						width={ch.lw2}
						height="4"
						rx="2"
						className={ch.filled ? "fill-card" : "fill-current"}
						opacity="0.7"
					/>
				</g>
			))}
			<rect
				x="12"
				y="356"
				width="176"
				height="30"
				rx="15"
				fill="none"
				stroke="currentColor"
				strokeOpacity="0.35"
			/>
			<text x="26" y="375" fill="currentColor" fontSize="8" opacity="0.6">
				{t("components.common.art.mocks.pins-main.2-bed-near")}
			</text>
			<g fill="none" stroke="currentColor" opacity="0.2">
				{ROADS.map((d) => (
					<path key={d} d={d} />
				))}
			</g>
			{mockData.dots.map((d) => (
				<circle
					key={`${d.x}-${d.y}`}
					cx={d.x}
					cy={d.y}
					r={d.r}
					fill="currentColor"
					opacity={d.op}
				/>
			))}
			{mockData.clusters.map((cl) => (
				<g key={cl.n}>
					<circle cx={cl.x} cy={cl.y} r={cl.r} fill="currentColor" />
					<text
						x={cl.x}
						y={cl.y + 3}
						textAnchor="middle"
						className="fill-card"
						fontSize="9"
						fontWeight="900"
					>
						{cl.n}
					</text>
				</g>
			))}
			<rect
				x="430"
				y="232"
				width="176"
				height="120"
				rx="14"
				className="fill-card"
				stroke="currentColor"
				strokeOpacity="0.35"
			/>
			<rect
				x="442"
				y="244"
				width="152"
				height="52"
				rx="8"
				fill="currentColor"
				opacity="0.18"
			/>
			<text
				x="442"
				y="314"
				fill="currentColor"
				fontSize="10"
				fontWeight="800"
			>
				{t("components.common.art.mocks.pins-main.listing.title")}
			</text>
			<rect
				x="442"
				y="324"
				width="70"
				height="16"
				rx="8"
				fill="currentColor"
			/>
			<text
				x="477"
				y="335"
				textAnchor="middle"
				className="fill-card"
				fontSize="7"
				fontWeight="800"
			>
				{t("components.common.art.mocks.pins-main.low-risk")}
			</text>
		</>
	);
};

export default MockPinsMain;
