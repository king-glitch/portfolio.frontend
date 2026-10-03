import React from "react";
import { useTranslation } from "react-i18next";
import { ProjectMock } from "@/components/common/art/project-mock";
import { ProjectMotif } from "@/components/common/art/project-motif";
import {
	GalleryArtKind,
	type GalleryFrame,
} from "@/api/types/portfolio/gallery";
import { ArtFit } from "@/types/ui";

interface GalleryArtProps {
	frame: GalleryFrame;
	className?: string;
}

/** The picture of a frame: the server's image, or (until one is uploaded) its stand-in art. */
export const GalleryArt: React.FC<GalleryArtProps> = ({ frame, className }) => {
	const { t } = useTranslation();
	const { art } = frame;
	if (frame.imageUrl)
		return (
			<img
				src={frame.imageUrl}
				alt={t("gallery.tile.alt", { name: frame.projectName })}
				width={frame.width}
				height={frame.height}
				loading="lazy"
				decoding="async"
				className={className}
			/>
		);
	if (art.art === GalleryArtKind.Concept)
		return <ProjectMotif kind={art.kind} className={className} />;
	return (
		<ProjectMock
			kind={art.kind}
			screen={art.screen}
			fit={frame.height > frame.width ? ArtFit.Meet : ArtFit.Slice}
			className={className}
		/>
	);
};

export default GalleryArt;
