import React from "react";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileMotifProps extends TileProps {}

/** Project motif above a caption bar. */
export const TileMotif: React.FC<TileMotifProps> = ({ data }) => {
	return (
		<>
			<div className="absolute inset-x-0 top-0 bottom-(--wall-cap-h)">
				{data.motif ? (
					<ProjectMotif kind={data.motif} imageUrl={data.motifUrl} />
				) : null}
			</div>
			<TileCaption
				data={data}
				className="absolute inset-x-0 bottom-0 flex h-(--wall-cap-h) items-center justify-center"
			/>
		</>
	);
};

export default TileMotif;
