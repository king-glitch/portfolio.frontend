// style-lint-ignore-file query-states -- projects only fill a select; a failed load leaves "No project" and says so
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";
import { useSaveNote } from "@/api/hooks/admin/notes/use-save-note";
import type { AdminNoteDetail } from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import { MotifKind, PostBlockType } from "@/api/types/portfolio/enums";
import { FormSelectField } from "@/components/common/fields/form-select-field";
import { FormSwitchField } from "@/components/common/fields/form-switch-field";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form-textarea-field";
import { FormButton } from "@/components/common/buttons/form-button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { noteBlockSpecs } from "@/lib/dynamic-form/specs";
import { applyViolations } from "@/lib/forms";
import { BlockEditor } from "@/routes/dashboard/components/dynamic-form/block-editor";
import {
	emptyNoteForm,
	noteFieldNames,
	noteFormSchema,
	toNoteForm,
	toNoteInput,
	type NoteFormValues,
} from "@/routes/dashboard/notes/components/note-form-schema";

interface NoteFormProps {
	/** Undefined = create. */
	note?: AdminNoteDetail;
}

/** Create or edit a note. `blocks` is edited as JSON; the backend validates every block against its schema. */
export const NoteForm: React.FC<NoteFormProps> = ({ note }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const save = useSaveNote(note?.id);
	const projects = useAdminProjects();
	const schema = useMemo(() => noteFormSchema(t), [t]);
	const form = useForm<NoteFormValues>({
		resolver: zodResolver(schema),
		defaultValues: note ? toNoteForm(note) : emptyNoteForm,
	});

	const kinds = Object.values(MotifKind).map((value) => ({
		value,
		label: t(`dashboard.options.kinds.${value}`),
	}));
	const statuses = Object.values(ContentStatus).map((value) => ({
		value,
		label: t(`dashboard.statuses.${value}`),
	}));
	const projectOptions = [
		{
			value: config.dashboard.noValue,
			label: t("dashboard.notes.form.project.none"),
		},
		...(projects.data ?? []).map((project) => ({
			value: project.id,
			label: project.name,
		})),
	];

	const blockTypes = Object.values(PostBlockType).map((value) => ({
		value,
		label: t(`dashboard.blocks.types.note.${value}`),
	}));

	const onSubmit = form.handleSubmit((values) =>
		save.mutate(toNoteInput(values, note), {
			onSuccess: () => {
				toast.add({
					type: "success",
					title: t("dashboard.notes.form.success"),
				});
				void navigate(config.routes.dashboardNotes);
			},
			onError: (error) =>
				applyViolations(error, form.setError, noteFieldNames),
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit} className="max-w-3xl">
			<FieldGroup>
				<FormTextField
					control={form.control}
					name="title"
					label={t("dashboard.notes.form.title.label")}
				/>
				<div className="grid gap-6 md:grid-cols-2">
					<FormSelectField
						control={form.control}
						name="kind"
						label={t("dashboard.notes.form.kind.label")}
						options={kinds}
					/>
					<FormSelectField
						control={form.control}
						name="status"
						label={t("dashboard.notes.form.status.label")}
						options={statuses}
					/>
					<FormSelectField
						control={form.control}
						name="projectId"
						label={t("dashboard.notes.form.project.label")}
						options={projectOptions}
						disabled={projects.isPending}
						description={
							projects.isError
								? t("dashboard.notes.form.project.error")
								: undefined
						}
					/>
					<FormTextField
						control={form.control}
						name="publishedAt"
						label={t("dashboard.notes.form.published.label")}
						description={t("dashboard.notes.form.published.hint")}
						type="datetime-local"
					/>
				</div>
				<FormTextField
					control={form.control}
					name="tags"
					label={t("dashboard.notes.form.tags.label")}
					description={t("dashboard.form.list.hint")}
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
					description={t("dashboard.notes.form.sample.description")}
				/>
				<Controller
					control={form.control}
					name="blocks"
					render={({ field, fieldState }) => (
						<BlockEditor
							label={t("dashboard.notes.form.blocks.label")}
							value={field.value}
							onChange={field.onChange}
							types={blockTypes}
							specs={noteBlockSpecs}
							nested={false}
							error={fieldState.error?.message}
						/>
					)}
				/>
				<div className="flex gap-2">
					<FormButton type="submit" disabled={save.isPending}>
						{save.isPending ? (
							<Spinner data-icon="inline-start" />
						) : null}
						{t("dashboard.form.submit")}
					</FormButton>
					<FormButton
						variant="outline"
						disabled={save.isPending}
						nativeButton={false}
						render={<Link to={config.routes.dashboardNotes} />}
					>
						{t("dashboard.form.cancel")}
					</FormButton>
				</div>
			</FieldGroup>
		</form>
	);
};

export default NoteForm;
