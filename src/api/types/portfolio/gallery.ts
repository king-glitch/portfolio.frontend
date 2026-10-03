export interface GalleryFrame {
	id: string;
	/** Frames not linked to a project (or whose project is gone) have none. */
	projectSlug: string | null;
	projectName: string | null;
	tags: string[];
	/** Picture size, so a tile reserves its space before the image loads. */
	width: number;
	height: number;
	imageUrl: string;
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
