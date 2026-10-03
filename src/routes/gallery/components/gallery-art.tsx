import React from "react";
import { useTranslation } from "react-i18next";
import type { GalleryFrame } from "@/api/types/portfolio/gallery";

interface GalleryArtProps {
	frame: GalleryFrame;
	className?: string;
}

/** The picture of a frame, at its stored size so the tile never shifts while it loads. */
export const GalleryArt: React.FC<GalleryArtProps> = ({ frame, className }) => {
	const { t } = useTranslation();
	return (
		<img
			src={frame.imageUrl}
			alt={t("gallery.tile.alt", {
				name: frame.projectName ?? t("gallery.tile.untitled"),
			})}
			width={frame.width}
			height={frame.height}
			loading="lazy"
			decoding="async"
			className={className}
		/>
	);
};

export default GalleryArt;
