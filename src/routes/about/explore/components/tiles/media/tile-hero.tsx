import React from "react";
import { useTranslation } from "react-i18next";
import { MotifKind } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import type { TileProps } from "@/types/about";

interface TileHeroProps extends TileProps {}

/** Centre tile: orbit art, "About", the first name, tagline. */
export const TileHero: React.FC<TileHeroProps> = ({ data }) => {
	const { t } = useTranslation();
	return (
		<>
			<div className="absolute inset-0 opacity-22">
				<ProjectMotif
					kind={MotifKind.Orbit}
					className="bg-transparent text-inherit"
				/>
			</div>
			<div className="relative flex size-full flex-col items-center justify-center p-5 text-center">
				<span className="text-(length:--wall-s) font-semibold opacity-60">
					{t("about.explore.tile.hero.eyebrow")}
				</span>
				<span className="text-(length:--wall-hero) leading-[0.95] font-bold tracking-[-0.06em]">
					{data.title}
				</span>
				<span className="mt-2.5 text-(length:--wall-m) font-medium opacity-70">
					{t("about.explore.tile.hero.tagline")}
				</span>
			</div>
		</>
	);
};

export default TileHero;
