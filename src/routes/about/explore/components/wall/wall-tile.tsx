import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { TileBars } from "@/routes/about/explore/components/tiles/stat/tile-bars";
import { TileDonut } from "@/routes/about/explore/components/tiles/stat/tile-donut";
import { TileStat } from "@/routes/about/explore/components/tiles/stat/tile-stat";
import { TileTall } from "@/routes/about/explore/components/tiles/stat/tile-tall";
import { TileHero } from "@/routes/about/explore/components/tiles/media/tile-hero";
import { TileMock } from "@/routes/about/explore/components/tiles/media/tile-mock";
import { TileMotif } from "@/routes/about/explore/components/tiles/media/tile-motif";
import { TileChat } from "@/routes/about/explore/components/tiles/text/tile-chat";
import { TileHabits } from "@/routes/about/explore/components/tiles/text/tile-habits";
import { TileHello } from "@/routes/about/explore/components/tiles/text/tile-hello";
import { TileSoft } from "@/routes/about/explore/components/tiles/text/tile-soft";
import { TileWords } from "@/routes/about/explore/components/tiles/text/tile-words";
import { TileChips } from "@/routes/about/explore/components/tiles/misc/tile-chips";
import { TileIcon } from "@/routes/about/explore/components/tiles/misc/tile-icon";
import { TileMono } from "@/routes/about/explore/components/tiles/misc/tile-mono";
import { TileTimeline } from "@/routes/about/explore/components/tiles/misc/tile-timeline";
import { cn } from "@/lib/utils";
import type { CellRect } from "@/lib/motion/wall";
import {
	AboutTileKind,
	TileTone,
	type TileProps,
	type WallTile as WallTileModel,
} from "@/types/about";

const TILES: Record<AboutTileKind, React.FC<TileProps>> = {
	[AboutTileKind.Mock]: TileMock,
	[AboutTileKind.Stat]: TileStat,
	[AboutTileKind.Words]: TileWords,
	[AboutTileKind.Icon]: TileIcon,
	[AboutTileKind.Timeline]: TileTimeline,
	[AboutTileKind.Mono]: TileMono,
	[AboutTileKind.Chat]: TileChat,
	[AboutTileKind.Motif]: TileMotif,
	[AboutTileKind.Chips]: TileChips,
	[AboutTileKind.Donut]: TileDonut,
	[AboutTileKind.Hero]: TileHero,
	[AboutTileKind.Tall]: TileTall,
	[AboutTileKind.Habits]: TileHabits,
	[AboutTileKind.Bars]: TileBars,
	[AboutTileKind.Soft]: TileSoft,
	[AboutTileKind.Hello]: TileHello,
};

const TONES: Record<TileTone, string> = {
	[TileTone.Card]: "bg-card text-foreground",
	[TileTone.Invert]: "bg-foreground text-background",
};

interface WallTileProps {
	tile: WallTileModel;
	rect: CellRect;
	/** True when the pointer dragged past the click guard: the link must not fire. */
	wasDragged: () => boolean;
}

/** One absolutely positioned tile; opacity/transform are driven by `usePanWall`. */
export const WallTile: React.FC<WallTileProps> = ({
	tile,
	rect,
	wasDragged,
}) => {
	const { t } = useTranslation();
	const Content = TILES[tile.kind];
	return (
		<div
			data-tile=""
			data-cx={rect.cx}
			data-cy={rect.cy}
			className={cn(
				"absolute box-border overflow-hidden rounded-(--wall-rad) opacity-0 ring-1 ring-border will-change-[transform,opacity] ring-inset",
				TONES[tile.tone],
			)}
			style={{
				left: rect.x,
				top: rect.y,
				width: rect.w,
				height: rect.h,
			}}
		>
			<Content data={tile.data} />
			{tile.data.link ? (
				<Link
					to={tile.data.link.to}
					viewTransition
					draggable={false}
					data-cursor={tile.data.link.cursor}
					aria-label={t(
						tile.data.link.labelKey,
						tile.data.link.labelValues,
					)}
					onClick={(e) => {
						if (wasDragged()) e.preventDefault();
					}}
					className="absolute inset-0 rounded-(--wall-rad) outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ring"
				/>
			) : null}
		</div>
	);
};

export default WallTile;
