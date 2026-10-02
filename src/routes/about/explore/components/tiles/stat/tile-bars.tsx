import React from "react";
import { TileBarRow } from "@/routes/about/explore/components/tiles/tile-bar-row";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileBarsProps extends TileProps {}

/** Horizontal bars (word frequency): label, track, fill. */
export const TileBars: React.FC<TileBarsProps> = ({ data }) => {
	return (
		<div className="flex size-full flex-col justify-center gap-2 px-5 py-3.5">
			{data.bars?.map((bar) => (
				<TileBarRow key={bar.label} label={bar.label}>
					<span className="h-2 overflow-hidden rounded-full bg-current/12">
						<span
							className="block h-full rounded-full bg-current"
							style={{ width: `${bar.width}%` }}
						/>
					</span>
				</TileBarRow>
			))}
			<TileCaption data={data} className="text-center" />
		</div>
	);
};

export default TileBars;
