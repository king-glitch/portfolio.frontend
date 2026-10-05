import React, { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useSaveProject } from "@/api/hooks/admin/projects/use-save-project";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import type { AdminProjectDetail } from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import { BlockType } from "@/api/types/portfolio/enums";
import { FormLinesField } from "@/components/common/fields/form/form-lines-field";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form/form-textarea-field";
import { FormToggleGroupField } from "@/components/common/fields/form/form-toggle-group-field";
import { UnsavedChangesDialog } from "@/components/common/forms/unsaved-changes-dialog";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { focusBlock } from "@/lib/dynamic-form/focus";
import { OptionSet } from "@/types/dynamic-form";
import { selectItems } from "@/lib/dynamic-form/options";
import { projectBlockSpecs } from "@/lib/dynamic-form/specs";
import { invalidBlockIndexes } from "@/lib/dynamic-form/values";
import { applyViolations } from "@/lib/forms";
import { dashboardProjectPath, projectPath } from "@/lib/routes";
import { FormArtField } from "@/routes/dashboard/components/art/form-art-field";
import { BlockEditor } from "@/routes/dashboard/components/dynamic-form/block/block-editor";
import { FormTagsField } from "@/routes/dashboard/components/fields/form-tags-field";
import { StatusActions } from "@/routes/dashboard/components/status/status-actions";
import { ProjectCategoriesField } from "@/routes/dashboard/projects/components/project-categories-field";
import {
	emptyProjectForm,
	projectFieldNames,
	projectFormSchema,
	toProjectForm,
	toProjectInput,
	type ProjectFormValues,
} from "@/routes/dashboard/projects/components/project-form-schema";

interface ProjectFormProps {
	/** Undefined = create. */
	project?: AdminProjectDetail;
}

/** Create or edit a project. Blocks are edited with the block editor (one card per block, fields from the block type's spec); the backend validates every block against its schema. Status is chosen by the action bar's buttons. */
/** The short facts shown on the project page's cover and overview. */
const factFields = [
	{ name: "position", labelKey: "dashboard.projects.form.position.label" },
	{ name: "period", labelKey: "dashboard.projects.form.period.label" },
	{ name: "team", labelKey: "dashboard.projects.form.team.label" },
] as const;

export const ProjectForm: React.FC<ProjectFormProps> = ({ project }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const save = useSaveProject(project?.id);
	const schema = useMemo(() => projectFormSchema(t), [t]);
	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(schema),
		defaultValues: project ? toProjectForm(project) : emptyProjectForm,
	});
	const { blocker, allowLeave } = useUnsavedGuard(form.formState.isDirty);
	const [target, setTarget] = useState<ContentStatus>();
	const status = project?.status ?? ContentStatus.Draft;

	const blockTypes = Object.values(BlockType).map((value) => ({
		value,
		label: t(`dashboard.blocks.types.project.${value}`),
	}));

	const submit = (next: ContentStatus) => {
		setTarget(next);
		void form.handleSubmit(
			(values) =>
				save.mutate(toProjectInput({ ...values, status: next }), {
					onSuccess: (saved) => {
						toast.add({
							type: "success",
							title: t("dashboard.projects.form.success"),
						});
						if (project) {
							form.reset(toProjectForm(saved));
							return;
						}
						// a new project goes on to its edit page so the author can keep working
						allowLeave();
						void navigate(dashboardProjectPath(saved.id));
					},
					onError: (error) =>
						applyViolations(
							error,
							form.setError,
							projectFieldNames,
							(index, message) =>
								form.setError(`blocks.${index}.root`, {
									message,
								}),
						),
				}),
			(errors) => {
				// fields are focused by the form; blocks are not fields, so find the first bad card
				if (errors.blocks && Object.keys(errors).length === 1) {
					const first = invalidBlockIndexes(
						form.getValues("blocks"),
						projectBlockSpecs,
						true,
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
					<div className="grid gap-6 md:grid-cols-2">
						<FormTextField
							control={form.control}
							name="name"
							label={t("dashboard.projects.form.name.label")}
						/>
						<FormTextField
							control={form.control}
							name="full"
							label={t("dashboard.projects.form.full.label")}
						/>
					</div>
					<FormToggleGroupField
						control={form.control}
						name="side"
						label={t("dashboard.projects.form.side.label")}
						options={selectItems(OptionSet.Side, t)}
					/>
					<FormArtField />
					<ProjectCategoriesField control={form.control} />
					<FormTagsField
						control={form.control}
						name="tags"
						label={t("dashboard.projects.form.tags.label")}
					/>
					<FormTagsField
						control={form.control}
						name="stack"
						label={t("dashboard.projects.form.stack.label")}
					/>
					<FormLinesField
						control={form.control}
						name="role"
						label={t("dashboard.projects.form.role.label")}
					/>
					<FormTextareaField
						control={form.control}
						name="about"
						label={t("dashboard.projects.form.about.label")}
						rows={4}
					/>
					<div className="grid gap-6 md:grid-cols-3">
						{factFields.map((field) => (
							<FormTextField
								key={field.name}
								control={form.control}
								name={field.name}
								label={t(field.labelKey)}
							/>
						))}
					</div>
					<FormToggleGroupField
						control={form.control}
						name="lifecycle"
						label={t("dashboard.projects.form.lifecycle.label")}
						options={selectItems(OptionSet.Lifecycle, t)}
					/>
					<FormTagsField
						control={form.control}
						name="platforms"
						label={t("dashboard.projects.form.platforms.label")}
					/>
					<FormTagsField
						control={form.control}
						name="chains"
						label={t("dashboard.projects.form.chains.label")}
					/>
					<FormLinesField
						control={form.control}
						name="links"
						label={t("dashboard.projects.form.links.label")}
						description={t(
							"dashboard.projects.form.links.description",
						)}
					/>
					<BlockEditor
						label={t("dashboard.projects.form.blocks.label")}
						types={blockTypes}
						specs={projectBlockSpecs}
						nested={true}
					/>
					<StatusActions
						status={status}
						dirty={form.formState.isDirty}
						pending={save.isPending}
						pendingStatus={target}
						saved={save.isSuccess}
						cancelTo={config.routes.dashboardProjects}
						viewTo={project ? projectPath(project.slug) : undefined}
						onSave={submit}
					/>
				</FieldGroup>
			</form>
			<UnsavedChangesDialog blocker={blocker} />
		</FormProvider>
	);
};

export default ProjectForm;
