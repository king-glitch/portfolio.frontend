import type { ProjectRef } from "@/api/types/admin/content";

export interface AdminFrame {
	id: string;
	/** The stored file this frame shows. */
	fileId: string;
	alt: string;
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

export interface FrameCreateInput {
	fileId: string;
	tags: string[];
	projectId: string | null;
}

export interface FrameUpdateInput {
	fileId: string;
	tags: string[];
	/** Empty string unlinks the project. */
	projectId: string;
}
