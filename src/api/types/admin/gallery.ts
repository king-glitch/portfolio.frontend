import type { ProjectRef } from "@/api/types/admin/content";

export interface AdminFrame {
	id: string;
	project: ProjectRef | null;
	tags: string[];
	width: number;
	height: number;
	imageUrl: string;
}

export interface AdminFramePage {
	frames: AdminFrame[];
	nextCursor: string | null;
}

export interface FrameUploadInput {
	file: File;
	tags: string[];
	projectId: string | null;
}

export interface FrameUpdateInput {
	tags: string[];
	/** Empty string unlinks the project. */
	projectId: string;
}
