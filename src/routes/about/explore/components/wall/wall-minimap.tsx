import React from "react";
import { cellRect, type WallGeometry } from "@/lib/motion/wall";
import type { WallTile } from "@/types/about";

interface WallMinimapProps {
	tiles: WallTile[];
	geometry: WallGeometry;
	scale: number;
	/** Written by `usePanWall` every frame (viewport rectangle). */
	miniRef: React.RefObject<HTMLSpanElement | null>;
}

/** Decorative overview: every tile as a dot, the viewport as a rectangle. Hidden on mobile. */
export const WallMinimap: React.FC<WallMinimapProps> = ({
	tiles,
	geometry,
	scale,
	miniRef,
}) => {
	return (
		<div
			aria-hidden="true"
			className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-border desk:block"
			style={{
				width: geometry.width * scale,
				height: geometry.height * scale,
			}}
		>
			{tiles.map((tile) => {
				const r = cellRect(tile, geometry);
				return (
					<span
						key={tile.id}
						className="absolute rounded-xs bg-current opacity-18"
						style={{
							left: r.x * scale,
							top: r.y * scale,
							width: Math.max(2, r.w * scale - 1),
							height: Math.max(2, r.h * scale - 1),
						}}
					/>
				);
			})}
			<span
				ref={miniRef}
				className="absolute top-0 left-0 size-2.5 rounded-sm ring-[1.5px] ring-current ring-inset"
			/>
		</div>
	);
};

export default WallMinimap;
