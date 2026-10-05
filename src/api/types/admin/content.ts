import type {
	MotifKind,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import type { ProjectLink } from "@/api/types/portfolio/project";
import type { ContentStatus } from "@/api/types/admin/enums";

/** A block as stored: validated by the backend against its JSON schema, edited here as JSON. */
export type StoredBlock = Record<string, unknown>;

export interface ProjectRef {
	id: string;
	slug: string;
	name: string;
}

export interface AdminProject {
	id: string;
	slug: string;
	num: string;
	name: string;
	full: string;
	kind: MotifKind;
	side: ProjectSide;
	tags: string[];
	categories: string[];
	stack: string[];
	about: string;
	role: string[];
	/** Uploaded art; "" = none (the motif of `kind` is shown). */
	artUrl: string;
	position: string;
	period: string;
	team: string;
	/** "" on projects saved before content version 2. */
	lifecycle: ProjectLifecycle | "";
	platforms: string[];
	chains: string[];
	links: ProjectLink[];
	status: ContentStatus;
	order: number;
}

export interface AdminProjectDetail extends AdminProject {
	blocks: StoredBlock[];
}

/** Create/update body (`slug`, `num`, `order` are the backend's). */
export interface ProjectInput {
	name: string;
	full: string;
	kind: MotifKind;
	side: ProjectSide;
	tags: string[];
	categories: string[];
	stack: string[];
	about: string;
	role: string[];
	artUrl: string;
	position: string;
	period: string;
	team: string;
	lifecycle: ProjectLifecycle;
	platforms: string[];
	chains: string[];
	links: ProjectLink[];
	status: ContentStatus;
	blocks: StoredBlock[];
}

export interface AdminNote {
	id: string;
	slug: string;
	num: string;
	title: string;
	publishedAt: string | null;
	tags: string[];
	kind: MotifKind;
	excerpt: string;
	readMinutes: number;
	sample: boolean;
	/** Uploaded art; "" = none (the motif of `kind` is shown). */
	artUrl: string;
	project: ProjectRef | null;
	status: ContentStatus;
}

export interface AdminNoteDetail extends AdminNote {
	blocks: StoredBlock[];
}

export interface NoteInput {
	title: string;
	/** Empty = generated from the title. */
	slug: string;
	tags: string[];
	kind: MotifKind;
	excerpt: string;
	sample: boolean;
	artUrl: string;
	status: ContentStatus;
	/** Document id of the linked project; null = none. */
	projectId: string | null;
	/** True when an existing link is being removed. */
	unlink: boolean;
	/** ISO instant. */
	publishedAt: string | null;
	blocks: StoredBlock[];
}
