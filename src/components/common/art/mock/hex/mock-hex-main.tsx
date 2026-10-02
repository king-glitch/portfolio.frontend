import React from "react";
import { useTranslation } from "react-i18next";
import { mockData } from "@/lib/art/mock-data";

const LIMBS = [
	{ x: 252, y: 130, height: 56, opacity: 0.7 },
	{ x: 364, y: 130, height: 56, opacity: 0.7 },
	{ x: 290, y: 196, height: 64, opacity: 0.8 },
	{ x: 326, y: 196, height: 64, opacity: 0.8 },
];

interface MockHexMainProps {}

export const MockHexMain: React.FC<MockHexMainProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			{mockData.hexMap.map((hm) => (
				<polygon
					key={hm.pts}
					points={hm.pts}
					fill={hm.filled ? "currentColor" : "none"}
					stroke="currentColor"
					opacity={hm.op}
				/>
			))}
			<g fill="currentColor">
				<rect x="282" y="120" width="76" height="70" rx="10" />
				<rect
					x="296"
					y="96"
					width="48"
					height="30"
					rx="8"
					opacity="0.85"
				/>
				<rect
					x="306"
					y="106"
					width="28"
					height="6"
					rx="3"
					className="fill-card"
				/>
				{LIMBS.map((l) => (
					<rect key={`${l.x}-${l.y}`} {...l} width="24" rx="8" />
				))}
			</g>
			<circle
				cx="320"
				cy="180"
				r="118"
				fill="none"
				stroke="currentColor"
				strokeDasharray="4 6"
				opacity="0.4"
				className="origin-[200px_150px] transform-view motion-safe:animate-art-spin-slow"
				style={{ transformOrigin: "320px 180px" }}
			/>
			<rect
				x="470"
				y="44"
				width="154"
				height="222"
				rx="14"
				fill="currentColor"
				opacity="0.06"
			/>
			<text
				x="486"
				y="70"
				fill="currentColor"
				fontSize="14"
				fontWeight="900"
				letterSpacing="-0.03em"
			>
				{t("components.common.art.mocks.hex-main.wild-mech")}
			</text>
			<text x="486" y="86" fill="currentColor" fontSize="8" opacity="0.6">
				{t("components.common.art.mocks.hex-main.status")}
			</text>
			{mockData.stats.map((st) => (
				<g key={st.name}>
					<text
						x="486"
						y={st.y}
						fill="currentColor"
						fontSize="8"
						fontWeight="700"
					>
						{st.name}
					</text>
					<rect
						x="486"
						y={st.y + 6}
						width="122"
						height="5"
						rx="2.5"
						fill="currentColor"
						opacity="0.15"
					/>
					<rect
						x="486"
						y={st.y + 6}
						width={st.w}
						height="5"
						rx="2.5"
						fill="currentColor"
					/>
				</g>
			))}
			<rect
				x="486"
				y="222"
				width="122"
				height="30"
				rx="15"
				fill="currentColor"
			/>
			<text
				x="547"
				y="241"
				textAnchor="middle"
				className="fill-card"
				fontSize="10"
				fontWeight="900"
				letterSpacing="0.08em"
			>
				{t("components.common.art.mocks.hex-main.capture")}
			</text>
			{mockData.party.map((pt) => (
				<rect
					key={pt.x}
					x={pt.x}
					y="316"
					width="64"
					height="64"
					rx="14"
					fill={pt.filled ? "currentColor" : "none"}
					stroke="currentColor"
					strokeOpacity="0.3"
				/>
			))}
			<text
				x="16"
				y="306"
				fill="currentColor"
				fontSize="8"
				fontWeight="700"
				letterSpacing="0.12em"
				opacity="0.6"
			>
				{t("components.common.art.mocks.hex-main.party")}
			</text>
		</>
	);
};

export default MockHexMain;
