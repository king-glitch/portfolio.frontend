import React, { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useSaveNote } from "@/api/hooks/admin/notes/use-save-note";
import type { AdminNoteDetail } from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import { PostBlockType } from "@/api/types/portfolio/enums";
import { FormSwitchField } from "@/components/common/fields/form/form-switch-field";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form/form-textarea-field";
import { UnsavedChangesDialog } from "@/components/common/forms/unsaved-changes-dialog";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import { focusBlock } from "@/lib/dynamic-form/focus";
import { noteBlockSpecs } from "@/lib/dynamic-form/specs";
import { invalidBlockIndexes } from "@/lib/dynamic-form/values";
import { applyViolations } from "@/lib/forms";
import { dashboardNotePath, notePath } from "@/lib/routes";
import { FormArtField } from "@/routes/dashboard/components/art/form-art-field";
import { BlockEditor } from "@/routes/dashboard/components/dynamic-form/block/block-editor";
import { FormProjectSelectField } from "@/routes/dashboard/components/fields/form-project-select-field";
import { FormTagsField } from "@/routes/dashboard/components/fields/form-tags-field";
import { StatusActions } from "@/routes/dashboard/components/status/status-actions";
import {
	emptyNoteForm,
	noteFieldNames,
	noteFormSchema,
	toNoteForm,
	toNoteInput,
	type NoteFormValues,
} from "@/routes/dashboard/notes/components/note-form-schema";
import { NoteSlugField } from "@/routes/dashboard/notes/components/note-slug-field";

interface NoteFormProps {
	/** Undefined = create. */
	note?: AdminNoteDetail;
}

/** Create or edit a note. Blocks are edited with the block editor (one card per block, fields from the block type's spec); the backend validates every block against its schema. Status is chosen by the action bar's buttons. */
export const NoteForm: React.FC<NoteFormProps> = ({ note }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const save = useSaveNote(note?.id);
	const schema = useMemo(() => noteFormSchema(t), [t]);
	const form = useForm<NoteFormValues>({
		resolver: zodResolver(schema),
		defaultValues: note ? toNoteForm(note) : emptyNoteForm,
	});
	const { blocker, allowLeave } = useUnsavedGuard(form.formState.isDirty);
	const [target, setTarget] = useState<ContentStatus>();
	const status = note?.status ?? ContentStatus.Draft;

	const blockTypes = Object.values(PostBlockType).map((value) => ({
		value,
		label: t(`dashboard.blocks.types.note.${value}`),
	}));

	const submit = (next: ContentStatus) => {
		setTarget(next);
		void form.handleSubmit(
			(values) =>
				save.mutate(toNoteInput({ ...values, status: next }, note), {
					onSuccess: (saved) => {
						toast.add({
							type: "success",
							title: t("dashboard.notes.form.success"),
						});
						if (note) {
							form.reset(toNoteForm(saved));
							return;
						}
						// a new note goes on to its edit page so the author can keep working
						allowLeave();
						void navigate(dashboardNotePath(saved.id));
					},
					onError: (error) =>
						applyViolations(
							error,
							form.setError,
							noteFieldNames,
							(index, message) =>
								form.setError(`blocks.${index}.root`, {
									message,
								}),
						),
				}),
			(errors) => {
				if (errors.blocks && Object.keys(errors).length === 1) {
					const first = invalidBlockIndexes(
						form.getValues("blocks"),
						noteBlockSpecs,
						false,
					)[0];
					if (first !== undefined) focusBlock(first);
				}
			},
		)();
	};

	return (
		<FormProvider {...form}>
			<form
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					submit(status);
				}}
				className="max-w-3xl"
			>
				<FieldGroup>
					<FormTextField
						control={form.control}
						name="title"
						label={t("dashboard.notes.form.title.label")}
					/>
					<NoteSlugField control={form.control} />
					<div className="grid gap-6 md:grid-cols-2">
						<FormProjectSelectField
							control={form.control}
							name="projectId"
							label={t("dashboard.notes.form.project.label")}
						/>
						<FormTextField
							control={form.control}
							name="publishedAt"
							label={t("dashboard.notes.form.published.label")}
							description={t(
								"dashboard.notes.form.published.hint",
							)}
							type="datetime-local"
						/>
					</div>
					<FormArtField />
					<FormTagsField
						control={form.control}
						name="tags"
						label={t("dashboard.notes.form.tags.label")}
					/>
					<FormTextareaField
						control={form.control}
						name="excerpt"
						label={t("dashboard.notes.form.excerpt.label")}
						rows={3}
					/>
					<FormSwitchField
						control={form.control}
						name="sample"
						label={t("dashboard.notes.form.sample.label")}
						description={t(
							"dashboard.notes.form.sample.description",
						)}
					/>
					<BlockEditor
						label={t("dashboard.notes.form.blocks.label")}
						types={blockTypes}
						specs={noteBlockSpecs}
						nested={false}
					/>
					<StatusActions
						status={status}
						dirty={form.formState.isDirty}
						pending={save.isPending}
						pendingStatus={target}
						saved={save.isSuccess}
						cancelTo={config.routes.dashboardNotes}
						viewTo={note ? notePath(note.slug) : undefined}
						onSave={submit}
					/>
				</FieldGroup>
			</form>
			<UnsavedChangesDialog blocker={blocker} />
		</FormProvider>
	);
};

export default NoteForm;
