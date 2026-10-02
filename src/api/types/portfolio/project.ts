import type { Block } from "@/api/types/portfolio/block";
import type {
	MotifKind,
	ProjectFilter,
	ProjectSide,
} from "@/api/types/portfolio/enums";

export interface ProjectSummary {
	id: string;
	num: string;
	name: string;
	full: string;
	kind: MotifKind;
	side: ProjectSide;
	tags: string[];
	/** Never contains ProjectFilter.All. */
	categories: ProjectFilter[];
	stack: string[];
	about: string;
	role: string[];
}

export interface Project extends ProjectSummary {
	blocks: Block[];
}
