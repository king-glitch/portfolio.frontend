import React from "react";
import { useTranslation } from "react-i18next";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileStatProps extends TileProps {}

/** Big number plus caption, optional faint art behind. */
export const TileStat: React.FC<TileStatProps> = ({ data }) => {
	const { t } = useTranslation();
	return (
		<>
			{data.art ? (
				<div className="absolute inset-0 opacity-28">
					<ProjectMotif
						kind={data.art}
						className="bg-transparent text-inherit"
					/>
				</div>
			) : null}
			<div className="relative flex size-full flex-col items-center justify-center gap-1 p-3.5 text-center">
				<span className="text-(length:--wall-big) leading-[0.9] font-bold tracking-[-0.06em]">
					{data.valueKey ? t(data.valueKey) : data.value}
				</span>
				<TileCaption data={data} className="opacity-75" />
			</div>
		</>
	);
};

export default TileStat;
