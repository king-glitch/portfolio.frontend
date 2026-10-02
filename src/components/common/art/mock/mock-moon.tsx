import React from "react";
import { useTranslation } from "react-i18next";
import { mockData } from "@/lib/art/mock-data";

interface MockMoonProps {}

export const MockMoon: React.FC<MockMoonProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			<rect
				x="16"
				y="40"
				width="96"
				height="22"
				rx="11"
				fill="currentColor"
			/>
			<circle cx="30" cy="51" r="6" className="fill-card" />
			<text
				x="42"
				y="55"
				className="fill-card"
				fontSize="10"
				fontWeight="800"
			>
				1,240
			</text>
			<rect
				x="120"
				y="40"
				width="76"
				height="22"
				rx="11"
				fill="none"
				stroke="currentColor"
				strokeOpacity="0.4"
			/>
			<text
				x="158"
				y="55"
				textAnchor="middle"
				fill="currentColor"
				fontSize="9"
				fontWeight="700"
			>
				{t("components.common.art.mocks.moon.day-count")}
			</text>
			{mockData.plots.map((pl) => (
				<g key={`${pl.x}-${pl.y}`}>
					<rect
						x={pl.x}
						y={pl.y}
						width="54"
						height="54"
						rx="8"
						fill="currentColor"
						opacity={pl.op}
					/>
					{pl.sprout && (
						<path
							d={pl.leaf}
							fill="none"
							stroke="currentColor"
							strokeWidth="1.6"
						/>
					)}
					{pl.fruit && (
						<circle
							cx={pl.x + 27}
							cy={pl.y + 27}
							r="9"
							fill="currentColor"
						/>
					)}
				</g>
			))}
			<rect
				x="430"
				y="40"
				width="194"
				height="290"
				rx="14"
				fill="currentColor"
				opacity="0.06"
			/>
			<text
				x="446"
				y="66"
				fill="currentColor"
				fontSize="14"
				fontWeight="900"
				letterSpacing="-0.03em"
			>
				{t("components.common.art.mocks.moon.shop")}
			</text>
			{mockData.shop.map((sh) => (
				<g key={sh.y}>
					<rect
						x="446"
						y={sh.y}
						width="162"
						height="50"
						rx="10"
						className="fill-card"
						stroke="currentColor"
						strokeOpacity="0.2"
					/>
					<rect
						x="456"
						y={sh.y + 10}
						width="30"
						height="30"
						rx="8"
						fill="currentColor"
						opacity="0.25"
					/>
					<text
						x="496"
						y={sh.y + 29}
						fill="currentColor"
						fontSize="9"
						fontWeight="700"
					>
						{sh.name}
					</text>
					<rect
						x="566"
						y={sh.y + 17}
						width="34"
						height="16"
						rx="8"
						fill="currentColor"
					/>
					<text
						x="583"
						y={sh.y + 28}
						textAnchor="middle"
						className="fill-card"
						fontSize="7"
						fontWeight="800"
					>
						{sh.price}
					</text>
				</g>
			))}
			<rect
				x="16"
				y="344"
				width="400"
				height="40"
				rx="12"
				fill="currentColor"
			/>
			<text
				x="32"
				y="368"
				className="fill-card"
				fontSize="10"
				fontWeight="800"
			>
				{t("components.common.art.mocks.moon.new-resources-spawned")}
			</text>
		</>
	);
};

export default MockMoon;
