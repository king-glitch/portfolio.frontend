import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { usePanWall, useWallGeometry } from "@/hooks/pointer/use-pan-wall";
import { cellRect, minimapBox } from "@/lib/motion/wall";
import { buildAboutStats } from "@/lib/portfolio/about-stats";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { CursorLabel } from "@/types/cursor";
import { WALL_CELLS, buildWallTiles } from "@/lib/portfolio/wall-tiles";
import { ModeSwitch } from "@/routes/about/components/mode-switch";
import { WallMinimap } from "@/routes/about/explore/components/wall/wall-minimap";
import { WallRecenter } from "@/routes/about/explore/components/wall/wall-recenter";
import { WallTile } from "@/routes/about/explore/components/wall/wall-tile";

interface ExploreWallProps {
	profile: Profile;
	projects: ProjectSummary[];
	/** null while the posts query has no data. */
	notesCount: number | null;
}

/** Fixed-viewport draggable wall of 27 tiles with minimap and recenter control. */
export const ExploreWall: React.FC<ExploreWallProps> = ({
	profile,
	projects,
	notesCount,
}) => {
	const { t } = useTranslation();
	const geometry = useWallGeometry();
	const tiles = useMemo(
		() =>
			buildWallTiles({
				profile,
				projects,
				stats: buildAboutStats(profile, projects),
				notesCount,
			}),
		[profile, projects, notesCount],
	);
	const heroRect = useMemo(() => {
		const hero = WALL_CELLS.find((c) => c.id === "hero");
		return hero ? cellRect(hero, geometry) : undefined;
	}, [geometry]);
	const mini = minimapBox(geometry, config.about.wall.minimapWidthPx);
	const {
		viewportRef,
		wallRef,
		miniRef,
		dragged,
		recenter,
		wasDragged,
		viewportProps,
	} = usePanWall({
		geometry,
		hero: {
			x: heroRect?.cx ?? geometry.width / 2,
			y: heroRect?.cy ?? geometry.height / 2,
		},
		miniScale: mini.scale,
	});

	// custom properties: --k scales the type, --wall-rad rounds the tiles
	const wallStyle = {
		width: geometry.width,
		height: geometry.height,
		"--k": geometry.unit / 200,
		"--wall-rad": `${geometry.radius}px`,
	};

	return (
		<>
			<div
				ref={viewportRef}
				role="region"
				tabIndex={0}
				aria-label={t("about.explore.viewport.label")}
				data-cursor={CursorLabel.Drag}
				className="relative h-svh cursor-grab touch-none overflow-hidden select-none data-dragging:cursor-grabbing"
				{...viewportProps}
			>
				<div
					ref={wallRef}
					className="absolute top-0 left-0 will-change-transform [--wall-big:calc(72px*var(--k))] [--wall-cap-h:calc(44px*var(--k))] [--wall-donut:calc(96px*var(--k))] [--wall-hero:calc(96px*var(--k))] [--wall-ico:calc(72px*var(--k))] [--wall-label:calc(110px*var(--k))] [--wall-m:calc(18px*var(--k))] [--wall-s:max(11px,calc(14px*var(--k)))] [--wall-xs:max(10px,calc(12px*var(--k)))]"
					style={wallStyle}
				>
					{tiles.map((tile) => (
						<WallTile
							key={tile.id}
							tile={tile}
							rect={cellRect(tile, geometry)}
							wasDragged={wasDragged}
						/>
					))}
				</div>
				<p
					className={cn(
						"pointer-events-none absolute top-25 left-1/2 -translate-x-1/2 text-[13px] font-semibold whitespace-nowrap text-muted-foreground transition-opacity duration-600 print:hidden",
						dragged && "opacity-0",
					)}
				>
					{t("about.explore.hint")}
				</p>
				<WallMinimap
					tiles={tiles}
					geometry={geometry}
					scale={mini.scale}
					miniRef={miniRef}
				/>
			</div>
			<ModeSwitch>
				<WallRecenter onRecenter={recenter} />
			</ModeSwitch>
		</>
	);
};

export default ExploreWall;
