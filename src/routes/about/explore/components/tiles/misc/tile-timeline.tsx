import React from "react";
import { TileBarRow } from "@/routes/about/explore/components/tiles/tile-bar-row";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileTimelineProps extends TileProps {}

/** Education and jobs as bars on a shared year ruler. */
export const TileTimeline: React.FC<TileTimelineProps> = ({ data }) => {
	return (
		<div className="flex size-full flex-col justify-center gap-2.5 px-5.5 py-4">
			{data.bars?.map((bar) => (
				<TileBarRow key={bar.label} label={bar.label}>
					<span className="relative h-2.5 rounded-full bg-current/12">
						<span
							className="absolute inset-y-0 rounded-full bg-current"
							style={{
								left: `${bar.left.toFixed(1)}%`,
								width: `${bar.width.toFixed(1)}%`,
							}}
						/>
					</span>
				</TileBarRow>
			))}
			<TileCaption data={data} className="mt-1 text-center" />
		</div>
	);
};

export default TileTimeline;
