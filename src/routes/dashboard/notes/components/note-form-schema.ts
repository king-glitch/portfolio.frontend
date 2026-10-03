import type { TFunction } from "i18next";
import { z } from "zod";
import type { AdminNoteDetail, NoteInput } from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import { MotifKind } from "@/api/types/portfolio/enums";
import { noteBlockSpecs } from "@/lib/dynamic-form/specs";
import { blocksHaveMissing, normalizeBlocks } from "@/lib/dynamic-form/values";
import { cleanList, fromLocalInput, toLocalInput } from "@/lib/forms";

export const noteFormSchema = (t: TFunction) =>
	z.object({
		title: z.string().trim().min(1, t("dashboard.errors.required")),
		slug: z.string().trim(),
		kind: z.enum(MotifKind),
		artUrl: z.string(),
		status: z.enum(ContentStatus),
		sample: z.boolean(),
		excerpt: z.string(),
		tags: z.array(z.string()),
		projectId: z.string(),
		publishedAt: z.string(),
		blocks: z
			.array(z.record(z.string(), z.unknown()))
			.refine(
				(blocks) => !blocksHaveMissing(blocks, noteBlockSpecs, false),
				t("dashboard.errors.block"),
			),
	});

export type NoteFormValues = z.infer<ReturnType<typeof noteFormSchema>>;

export const emptyNoteForm: NoteFormValues = {
	title: "",
	slug: "",
	kind: MotifKind.Radar,
	artUrl: "",
	status: ContentStatus.Draft,
	sample: false,
	excerpt: "",
	tags: [],
	projectId: "",
	publishedAt: "",
	blocks: [],
};

export const toNoteForm = (note: AdminNoteDetail): NoteFormValues => ({
	title: note.title,
	slug: note.slug,
	kind: note.kind,
	artUrl: note.artUrl,
	status: note.status,
	sample: note.sample,
	excerpt: note.excerpt,
	tags: note.tags,
	projectId: note.project?.id ?? "",
	publishedAt: toLocalInput(note.publishedAt),
	blocks: note.blocks,
});

/** `unlink` is true only when the note had a project and the form now has none. */
export function toNoteInput(
	values: NoteFormValues,
	existing: AdminNoteDetail | undefined,
): NoteInput {
	const projectId = values.projectId || null;
	return {
		title: values.title,
		slug: values.slug,
		kind: values.kind,
		artUrl: values.artUrl,
		status: values.status,
		sample: values.sample,
		excerpt: values.excerpt,
		tags: cleanList(values.tags),
		projectId,
		unlink: projectId === null && Boolean(existing?.project),
		publishedAt: fromLocalInput(values.publishedAt),
		blocks: normalizeBlocks(values.blocks, noteBlockSpecs, false),
	};
}

/** Field names the backend may reject by name (its snake_case keys are matched to these camelCase names). */
export const noteFieldNames = Object.keys(emptyNoteForm).filter(
	(key): key is keyof NoteFormValues => key in emptyNoteForm,
);
