import React from "react";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileChipsProps extends TileProps {}

/** Wrapped chips over a caption. */
export const TileChips: React.FC<TileChipsProps> = ({ data }) => {
	return (
		<div className="flex size-full flex-col justify-center gap-2.5 px-4.5 py-3.5">
			<div className="flex flex-wrap justify-center gap-1.5">
				{data.items?.map((item) => (
					<span
						key={item}
						className="rounded-full px-2.5 py-1.5 text-(length:--wall-xs) font-bold ring-1 ring-current/20 ring-inset"
					>
						{item}
					</span>
				))}
			</div>
			<TileCaption data={data} className="text-center" />
		</div>
	);
};

export default TileChips;
