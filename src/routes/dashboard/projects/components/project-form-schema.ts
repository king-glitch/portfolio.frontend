import type { TFunction } from "i18next";
import { z } from "zod";
import type {
	AdminProjectDetail,
	ProjectInput,
} from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import {
	MotifKind,
	ProjectFilter,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import { projectBlockSpecs } from "@/lib/dynamic-form/specs";
import { blocksHaveMissing, normalizeBlocks } from "@/lib/dynamic-form/values";
import { joinList, splitList } from "@/lib/forms";

export const projectFormSchema = (t: TFunction) =>
	z.object({
		name: z.string().trim().min(1, t("dashboard.errors.required")),
		full: z.string().trim().min(1, t("dashboard.errors.required")),
		kind: z.enum(MotifKind),
		side: z.enum(ProjectSide),
		status: z.enum(ContentStatus),
		categories: z.array(z.enum(ProjectFilter)),
		tags: z.string(),
		stack: z.string(),
		role: z.string(),
		about: z.string(),
		blocks: z
			.array(z.record(z.string(), z.unknown()))
			.refine(
				(blocks) => !blocksHaveMissing(blocks, projectBlockSpecs, true),
				t("dashboard.errors.block"),
			),
	});

export type ProjectFormValues = z.infer<ReturnType<typeof projectFormSchema>>;

export const emptyProjectForm: ProjectFormValues = {
	name: "",
	full: "",
	kind: MotifKind.Radar,
	side: ProjectSide.OnScreen,
	status: ContentStatus.Draft,
	categories: [],
	tags: "",
	stack: "",
	role: "",
	about: "",
	blocks: [],
};

export const toProjectForm = (
	project: AdminProjectDetail,
): ProjectFormValues => ({
	name: project.name,
	full: project.full,
	kind: project.kind,
	side: project.side,
	status: project.status,
	categories: project.categories,
	tags: joinList(project.tags),
	stack: joinList(project.stack),
	role: joinList(project.role),
	about: project.about,
	blocks: project.blocks,
});

export const toProjectInput = (values: ProjectFormValues): ProjectInput => ({
	...values,
	tags: splitList(values.tags),
	stack: splitList(values.stack),
	role: splitList(values.role),
	blocks: normalizeBlocks(values.blocks, projectBlockSpecs, true),
});

/** Field names the backend may reject by name. */
export const projectFieldNames = Object.keys(emptyProjectForm).filter(
	(key): key is keyof ProjectFormValues => key in emptyProjectForm,
);
