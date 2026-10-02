import React from "react";
import { MotifHex } from "@/components/common/art/motif/motif-hex";
import { MotifMoon } from "@/components/common/art/motif/motif-moon";
import { MotifOrbit } from "@/components/common/art/motif/motif-orbit";
import { MotifPins } from "@/components/common/art/motif/motif-pins";
import { MotifPixel } from "@/components/common/art/motif/motif-pixel";
import { MotifRadar } from "@/components/common/art/motif/motif-radar";
import { MotifKind } from "@/api/types/portfolio/enums";
import { cn } from "@/lib/utils";

const MOTIFS: Record<MotifKind, React.FC> = {
	[MotifKind.Radar]: MotifRadar,
	[MotifKind.Moon]: MotifMoon,
	[MotifKind.Pixel]: MotifPixel,
	[MotifKind.Hex]: MotifHex,
	[MotifKind.Orbit]: MotifOrbit,
	[MotifKind.Pins]: MotifPins,
};

interface ProjectMotifProps {
	kind: MotifKind;
	className?: string;
}

/** Decorative project art (400x300, `currentColor`). Fills its box; colour comes from the parent. */
export const ProjectMotif: React.FC<ProjectMotifProps> = ({
	kind,
	className,
}) => {
	const Motif = MOTIFS[kind];
	return (
		<svg
			viewBox="0 0 400 300"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
			className={cn(
				"block size-full bg-card text-card-foreground",
				className,
			)}
		>
			<Motif />
		</svg>
	);
};

export default ProjectMotif;
