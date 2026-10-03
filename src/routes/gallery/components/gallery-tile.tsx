import React from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { GalleryFrame } from "@/api/types/portfolio/gallery";
import { Button } from "@/components/ui/button";
import { GalleryArt } from "@/routes/gallery/components/gallery-art";
import { CursorLabel } from "@/types/cursor";

interface GalleryTileProps {
	frame: GalleryFrame;
	onOpen: (id: string) => void;
}

/**
 * One frame. On desktop the picture zooms and drifts against the pointer and an inverted caption
 * slides up; below `desk` the caption sits under the picture (no hover needed). 2D only: 3D tilt
 * inside an overflow-hidden box renders wrongly in Safari.
 */
export const GalleryTile: React.FC<GalleryTileProps> = ({ frame, onOpen }) => {
	const { t } = useTranslation();
	const name = frame.projectName ?? t("gallery.tile.untitled");

	const drift = (e: React.PointerEvent<HTMLButtonElement>) => {
		const box = e.currentTarget.getBoundingClientRect();
		const { style } = e.currentTarget;
		style.setProperty(
			"--px",
			String(((e.clientX - box.left) / box.width - 0.5) * 2),
		);
		style.setProperty(
			"--py",
			String(((e.clientY - box.top) / box.height - 0.5) * 2),
		);
	};
	const settle = (e: React.PointerEvent<HTMLButtonElement>) => {
		e.currentTarget.style.setProperty("--px", "0");
		e.currentTarget.style.setProperty("--py", "0");
	};

	return (
		<Button
			variant="ghost"
			data-cursor={CursorLabel.View}
			aria-label={t("gallery.tile.open.aria-label", { name })}
			onClick={() => onOpen(frame.id)}
			onPointerMove={drift}
			onPointerLeave={settle}
			className="group/tile mb-4 block h-auto w-full reveal-on-scroll break-inside-avoid rounded-none border-0 p-0 text-left font-normal whitespace-normal hover:bg-transparent focus-visible:ring-0 sm:mb-5 dark:hover:bg-transparent"
		>
			<span className="relative block overflow-hidden rounded-3xl bg-card text-foreground ring-1 ring-border transition-shadow duration-300 group-hover/tile:shadow-2xl group-focus-visible/tile:ring-3 group-focus-visible/tile:ring-foreground">
				<span
					style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
					className="relative block overflow-hidden"
				>
					<GalleryArt
						frame={frame}
						className="block size-full translate-[calc(var(--px,0)*-10px)_calc(var(--py,0)*-8px)] transition-transform duration-1000 ease-(--ease-out-expo) group-hover/tile:scale-110 group-focus-visible/tile:scale-110"
					/>
				</span>
				<span className="flex items-center justify-between gap-3 border-t px-4 py-3 transition-transform duration-600 ease-(--ease-out-expo) desk:absolute desk:inset-x-0 desk:bottom-0 desk:translate-y-full desk:border-t-0 desk:bg-foreground desk:text-background desk:group-hover/tile:translate-y-0 desk:group-focus-visible/tile:translate-y-0">
					<span className="truncate text-sm font-bold tracking-tight">
						{name}
					</span>
					<RiArrowRightUpLine
						aria-hidden="true"
						className="size-5 shrink-0"
					/>
				</span>
			</span>
		</Button>
	);
};

export default GalleryTile;
