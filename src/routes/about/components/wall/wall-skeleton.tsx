import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { useWallGeometry } from "@/hooks/pointer/use-pan-wall";
import { cellRect } from "@/lib/motion/wall";
import { WALL_CELLS } from "@/routes/about/components/wall/layout";

interface WallSkeletonProps {}

/** Same 10x7 grid as the wall, centred on the hero, no motion. */
export const WallSkeleton: React.FC<WallSkeletonProps> = () => {
	const geometry = useWallGeometry();
	const hero = WALL_CELLS.find((c) => c.id === "hero");
	const heroRect = hero
		? cellRect(hero, geometry)
		: { cx: geometry.width / 2, cy: geometry.height / 2 };
	return (
		<div className="relative h-svh overflow-hidden" aria-hidden="true">
			<div
				className="absolute"
				style={{
					width: geometry.width,
					height: geometry.height,
					left: `calc(50% - ${heroRect.cx}px)`,
					top: `calc(50% - ${heroRect.cy}px + ${config.about.wall.recenterOffsetYPx}px)`,
				}}
			>
				{WALL_CELLS.map((cell) => {
					const r = cellRect(cell, geometry);
					return (
						<Skeleton
							key={cell.id}
							className="absolute"
							style={{
								left: r.x,
								top: r.y,
								width: r.w,
								height: r.h,
								borderRadius: geometry.radius,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default WallSkeleton;
