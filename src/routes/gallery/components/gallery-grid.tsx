import React from "react";
import type { GalleryFrame } from "@/api/types/portfolio/gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryTile } from "@/routes/gallery/components/gallery-tile";
import { cn } from "@/lib/utils";

const SKELETONS = [
	"aspect-8/5",
	"aspect-3/4",
	"aspect-5/4",
	"aspect-5/4",
	"aspect-8/5",
	"aspect-3/4",
];

interface GalleryGridProps {
	/** Frames to show; undefined renders skeleton tiles in the same columns. */
	frames: GalleryFrame[] | undefined;
	onOpen: (id: string) => void;
	className?: string;
}

/** Masonry by CSS columns: one column on phones, two on tablets, three on desktop. */
export const GalleryGrid: React.FC<GalleryGridProps> = ({
	frames,
	onOpen,
	className,
}) => {
	return (
		<div
			className={cn(
				"columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3",
				className,
			)}
		>
			{frames
				? frames.map((frame) => (
						<GalleryTile
							key={frame.id}
							frame={frame}
							onOpen={onOpen}
						/>
					))
				: SKELETONS.map((shape, i) => (
						<Skeleton
							key={i}
							className={cn(
								"mb-4 w-full break-inside-avoid rounded-3xl sm:mb-5",
								shape,
							)}
						/>
					))}
		</div>
	);
};

export default GalleryGrid;
