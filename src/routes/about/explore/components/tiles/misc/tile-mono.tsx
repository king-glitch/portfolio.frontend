import React from "react";
import { useTranslation } from "react-i18next";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileMonoProps extends TileProps {}

/** Language monogram square over a caption. */
export const TileMono: React.FC<TileMonoProps> = ({ data }) => {
	const { t } = useTranslation();
	return (
		<div className="flex size-full flex-col items-center justify-center gap-2.5 text-center">
			<span className="flex size-(--wall-ico) items-center justify-center rounded-[30%] bg-foreground text-(length:--wall-m) font-black tracking-[-0.04em] text-background">
				{data.valueKey ? t(data.valueKey) : data.value}
			</span>
			<TileCaption data={data} />
		</div>
	);
};

export default TileMono;
