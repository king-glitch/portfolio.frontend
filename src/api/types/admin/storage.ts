/** What a stored file is, derived by the backend from its sniffed MIME type. */
export enum FileKind {
	Image = "image",
	Video = "video",
	Audio = "audio",
	Document = "document",
	Archive = "archive",
	Other = "other",
}

export interface AdminFile {
	id: string;
	kind: FileKind;
	mime: string;
	/** Bytes after server-side processing. */
	size: number;
	/** Images only; 0 otherwise. */
	width: number;
	height: number;
	name: string;
	alt: string;
	url: string;
	createdAt: string;
}

export interface FilePage {
	files: AdminFile[];
	nextCursor: string | null;
}

export interface FileListParams {
	/** Empty = every kind. */
	kinds: FileKind[];
	q: string;
}

export interface FileUploadInput {
	file: File;
	alt: string;
}

export interface FileUpdateInput {
	name?: string;
	alt?: string;
}
