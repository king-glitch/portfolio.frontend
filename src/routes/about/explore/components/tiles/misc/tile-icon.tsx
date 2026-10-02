import React from "react";
import {
	RiArrowLeftRightLine,
	RiGamepadLine,
	RiGraduationCapLine,
	RiStickyNoteLine,
	type RemixiconComponentType,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import { TileIcon as Icon, TileTone, type TileProps } from "@/types/about";

const GLYPHS: Record<Icon, RemixiconComponentType> = {
	[Icon.Socket]: RiArrowLeftRightLine,
	[Icon.Education]: RiGraduationCapLine,
	[Icon.Gamepad]: RiGamepadLine,
	[Icon.Notes]: RiStickyNoteLine,
};

interface TileIconProps extends TileProps {}

/** Rounded glyph square over a caption. */
export const TileIcon: React.FC<TileIconProps> = ({ data }) => {
	const Glyph = GLYPHS[data.icon ?? Icon.Notes];
	const inverted = data.iconTone === TileTone.Invert;
	return (
		<div className="flex size-full flex-col items-center justify-center gap-3 p-3 text-center">
			<span
				className={cn(
					"flex size-(--wall-ico) items-center justify-center rounded-[30%]",
					inverted ? "bg-foreground text-background" : "bg-card",
				)}
			>
				<Glyph className="size-[58%]" aria-hidden="true" />
			</span>
			<TileCaption data={data} />
		</div>
	);
};

export default TileIcon;
