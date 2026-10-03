import type { MockScreen, MotifKind } from "@/api/types/portfolio/enums";

/** Which stand-in picture to draw while a frame has no uploaded image. */
export enum GalleryArtKind {
	Screen = "screen",
	Concept = "concept",
}

export interface GalleryArt {
	kind: MotifKind;
	screen: MockScreen;
	art: GalleryArtKind;
}

export interface GalleryFrame {
	id: string;
	projectId: string;
	projectName: string;
	tags: string[];
	/** Picture size, so a tile reserves its space before the image loads. */
	width: number;
	height: number;
	/** Uploaded picture; null until one exists, then `art` is drawn instead. */
	imageUrl: string | null;
	art: GalleryArt;
}

/** One page of frames; `nextCursor` is null on the last page. */
export interface GalleryPage {
	frames: GalleryFrame[];
	nextCursor: string | null;
}

export interface GalleryTag {
	tag: string;
	count: number;
}

/** Filter chips: the most used tags and the number of frames without a filter. */
export interface GalleryTags {
	total: number;
	tags: GalleryTag[];
}

export interface GalleryParams {
	tag?: string;
	cursor?: string;
	limit: number;
}
