import React from "react";
import { ProjectMock } from "@/components/common/art/project-mock";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileMockProps extends TileProps {}

/** Project screen mock above a caption bar. */
export const TileMock: React.FC<TileMockProps> = ({ data }) => {
	return (
		<>
			<div className="absolute inset-x-0 top-0 bottom-(--wall-cap-h) p-3">
				{data.motif ? <ProjectMock kind={data.motif} /> : null}
			</div>
			<TileCaption
				data={data}
				className="absolute inset-x-0 bottom-0 flex h-(--wall-cap-h) items-center justify-center"
			/>
		</>
	);
};

export default TileMock;
