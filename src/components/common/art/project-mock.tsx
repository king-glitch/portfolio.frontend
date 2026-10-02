import React from "react";
import { useTranslation } from "react-i18next";
import { MockHexAlt } from "@/components/common/art/mock/hex/mock-hex-alt";
import { MockHexMain } from "@/components/common/art/mock/hex/mock-hex-main";
import { MockPinsAlt } from "@/components/common/art/mock/pins/mock-pins-alt";
import { MockPinsMain } from "@/components/common/art/mock/pins/mock-pins-main";
import { MockPixelAlt } from "@/components/common/art/mock/pixel/mock-pixel-alt";
import { MockPixelMain } from "@/components/common/art/mock/pixel/mock-pixel-main";
import { MockMoon } from "@/components/common/art/mock/mock-moon";
import { MockOrbit } from "@/components/common/art/mock/mock-orbit";
import { MockRadar } from "@/components/common/art/mock/mock-radar";
import { MockScreen, MotifKind } from "@/api/types/portfolio/enums";
import { mockMeta } from "@/lib/art/mock-meta";
import { cn } from "@/lib/utils";
import { ArtFit } from "@/types/ui";

const MOCKS: Record<MotifKind, Record<MockScreen, React.FC>> = {
	[MotifKind.Radar]: {
		[MockScreen.Main]: MockRadar,
		[MockScreen.Alt]: MockRadar,
	},
	[MotifKind.Moon]: {
		[MockScreen.Main]: MockMoon,
		[MockScreen.Alt]: MockMoon,
	},
	[MotifKind.Pixel]: {
		[MockScreen.Main]: MockPixelMain,
		[MockScreen.Alt]: MockPixelAlt,
	},
	[MotifKind.Hex]: {
		[MockScreen.Main]: MockHexMain,
		[MockScreen.Alt]: MockHexAlt,
	},
	[MotifKind.Orbit]: {
		[MockScreen.Main]: MockOrbit,
		[MockScreen.Alt]: MockOrbit,
	},
	[MotifKind.Pins]: {
		[MockScreen.Main]: MockPinsMain,
		[MockScreen.Alt]: MockPinsAlt,
	},
};

const TRAFFIC_LIGHTS = [
	{ cx: 16, opacity: 0.35 },
	{ cx: 30, opacity: 0.2 },
	{ cx: 44, opacity: 0.12 },
];

interface ProjectMockProps {
	kind: MotifKind;
	screen?: MockScreen;
	fit?: ArtFit;
	className?: string;
}

/** Illustrative screen mock: desktop window (640x400) or phone (300x600) per kind/screen. */
export const ProjectMock: React.FC<ProjectMockProps> = ({
	kind,
	screen = MockScreen.Main,
	fit = ArtFit.Meet,
	className,
}) => {
	const { t } = useTranslation();
	const meta = mockMeta(kind, screen);
	const Scene = MOCKS[kind][screen];
	const aspect = `xMidYMid ${fit}`;
	const classes = cn("block size-full text-foreground", className);

	if (meta.phone) {
		return (
			<svg
				viewBox="0 0 300 600"
				preserveAspectRatio={aspect}
				role="img"
				aria-label={t(meta.labelKey)}
				className={classes}
			>
				<rect
					x="4"
					y="4"
					width="292"
					height="592"
					rx="44"
					className="fill-card"
					stroke="currentColor"
					strokeWidth="2"
					strokeOpacity="0.35"
				/>
				<rect
					x="110"
					y="18"
					width="80"
					height="22"
					rx="11"
					fill="currentColor"
					opacity="0.9"
				/>
				<Scene />
			</svg>
		);
	}

	return (
		<svg
			viewBox="0 0 640 400"
			preserveAspectRatio={aspect}
			role="img"
			aria-label={t(meta.labelKey)}
			className={classes}
		>
			<rect
				x="0.5"
				y="0.5"
				width="639"
				height="399"
				rx="14"
				className="fill-card"
				stroke="currentColor"
				strokeOpacity="0.25"
			/>
			<line
				x1="0"
				y1="28"
				x2="640"
				y2="28"
				stroke="currentColor"
				strokeOpacity="0.18"
			/>
			{TRAFFIC_LIGHTS.map(({ cx, opacity }) => (
				<circle
					key={cx}
					cx={cx}
					cy="14"
					r="4"
					fill="currentColor"
					opacity={opacity}
				/>
			))}
			<rect
				x="220"
				y="7"
				width="200"
				height="14"
				rx="7"
				fill="currentColor"
				opacity="0.08"
			/>
			<text
				x="320"
				y="17.5"
				textAnchor="middle"
				fill="currentColor"
				fontSize="8"
				opacity="0.6"
			>
				{meta.url}
			</text>
			<Scene />
		</svg>
	);
};

export default ProjectMock;
