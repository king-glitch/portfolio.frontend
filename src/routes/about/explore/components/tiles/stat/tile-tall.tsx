import React from "react";
import { useTranslation } from "react-i18next";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileTallProps extends TileProps {}

/** Tall tile: eyebrow, huge number with a unit, caption. */
export const TileTall: React.FC<TileTallProps> = ({ data }) => {
	const { t } = useTranslation();
	return (
		<div className="flex size-full flex-col justify-between p-4.5">
			<span className="text-(length:--wall-s) font-semibold opacity-70">
				{data.eyebrowKey ? t(data.eyebrowKey) : null}
			</span>
			<span className="text-(length:--wall-big) leading-[0.85] font-bold tracking-[-0.06em]">
				{data.value}
				<span className="text-[0.36em] tracking-[-0.02em]">
					{data.unitKey ? t(data.unitKey) : null}
				</span>
			</span>
			<TileCaption data={data} />
		</div>
	);
};

export default TileTall;
