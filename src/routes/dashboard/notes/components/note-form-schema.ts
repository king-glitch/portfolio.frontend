import type { TFunction } from "i18next";
import { z } from "zod";
import type { AdminNoteDetail, NoteInput } from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import { MotifKind } from "@/api/types/portfolio/enums";
import { config } from "@/config";
import { noteBlockSpecs } from "@/lib/dynamic-form/specs";
import { blocksHaveMissing, normalizeBlocks } from "@/lib/dynamic-form/values";
import { fromLocalInput, joinList, splitList, toLocalInput } from "@/lib/forms";

export const noteFormSchema = (t: TFunction) =>
	z.object({
		title: z.string().trim().min(1, t("dashboard.errors.required")),
		kind: z.enum(MotifKind),
		status: z.enum(ContentStatus),
		sample: z.boolean(),
		excerpt: z.string(),
		tags: z.string(),
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
	kind: MotifKind.Radar,
	status: ContentStatus.Draft,
	sample: false,
	excerpt: "",
	tags: "",
	projectId: config.dashboard.noValue,
	publishedAt: "",
	blocks: [],
};

export const toNoteForm = (note: AdminNoteDetail): NoteFormValues => ({
	title: note.title,
	kind: note.kind,
	status: note.status,
	sample: note.sample,
	excerpt: note.excerpt,
	tags: joinList(note.tags),
	projectId: note.project?.id ?? config.dashboard.noValue,
	publishedAt: toLocalInput(note.publishedAt),
	blocks: note.blocks,
});

/** `unlink` is true only when the note had a project and the form now has none. */
export function toNoteInput(
	values: NoteFormValues,
	existing: AdminNoteDetail | undefined,
): NoteInput {
	const projectId =
		values.projectId === config.dashboard.noValue ? null : values.projectId;
	return {
		title: values.title,
		kind: values.kind,
		status: values.status,
		sample: values.sample,
		excerpt: values.excerpt,
		tags: splitList(values.tags),
		projectId,
		unlink: projectId === null && Boolean(existing?.project),
		publishedAt: fromLocalInput(values.publishedAt),
		blocks: normalizeBlocks(values.blocks, noteBlockSpecs, false),
	};
}

/** Field names the backend may reject by name (its snake_case ids map here). */
export const noteFieldNames = Object.keys(emptyNoteForm).filter(
	(key): key is keyof NoteFormValues => key in emptyNoteForm,
);
