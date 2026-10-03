import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useSaveProject } from "@/api/hooks/admin/projects/use-save-project";
import type { AdminProjectDetail } from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import {
	BlockType,
	MotifKind,
	ProjectFilter,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import { FormSelectField } from "@/components/common/fields/form-select-field";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form-textarea-field";
import { FormToggleGroupField } from "@/components/common/fields/form-toggle-group-field";
import { FormButton } from "@/components/common/buttons/form-button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { projectBlockSpecs } from "@/lib/dynamic-form/specs";
import { applyViolations } from "@/lib/forms";
import { BlockEditor } from "@/routes/dashboard/components/dynamic-form/block-editor";
import {
	emptyProjectForm,
	projectFieldNames,
	projectFormSchema,
	toProjectForm,
	toProjectInput,
	type ProjectFormValues,
} from "@/routes/dashboard/projects/components/project-form-schema";

const listFields = ["tags", "stack", "role"] as const;

interface ProjectFormProps {
	/** Undefined = create. */
	project?: AdminProjectDetail;
}

/** Create or edit a project. `blocks` is edited as JSON; the backend validates every block against its schema. */
export const ProjectForm: React.FC<ProjectFormProps> = ({ project }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const save = useSaveProject(project?.id);
	const schema = useMemo(() => projectFormSchema(t), [t]);
	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(schema),
		defaultValues: project ? toProjectForm(project) : emptyProjectForm,
	});

	const kinds = Object.values(MotifKind).map((value) => ({
		value,
		label: t(`dashboard.options.kinds.${value}`),
	}));
	const sides = Object.values(ProjectSide).map((value) => ({
		value,
		label: t(`dashboard.options.sides.${value}`),
	}));
	const statuses = Object.values(ContentStatus).map((value) => ({
		value,
		label: t(`dashboard.statuses.${value}`),
	}));
	const categories = Object.values(ProjectFilter)
		.filter((value) => value !== ProjectFilter.All)
		.map((value) => ({
			value,
			label: t(`dashboard.options.categories.${value}`),
		}));

	const selects = [
		{ name: "kind", options: kinds },
		{ name: "side", options: sides },
		{ name: "status", options: statuses },
	] as const;

	const blockTypes = Object.values(BlockType).map((value) => ({
		value,
		label: t(`dashboard.blocks.types.project.${value}`),
	}));

	const onSubmit = form.handleSubmit((values) =>
		save.mutate(toProjectInput(values), {
			onSuccess: () => {
				toast.add({
					type: "success",
					title: t("dashboard.projects.form.success"),
				});
				void navigate(config.routes.dashboardProjects);
			},
			onError: (error) =>
				applyViolations(error, form.setError, projectFieldNames),
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit} className="max-w-3xl">
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
					{selects.map(({ name, options }) => (
						<FormSelectField
							key={name}
							control={form.control}
							name={name}
							label={t(`dashboard.projects.form.${name}.label`)}
							options={options}
						/>
					))}
				</div>
				<FormToggleGroupField
					control={form.control}
					name="categories"
					label={t("dashboard.projects.form.categories.label")}
					options={categories}
				/>
				{listFields.map((name) => (
					<FormTextField
						key={name}
						control={form.control}
						name={name}
						label={t(`dashboard.projects.form.${name}.label`)}
						description={t("dashboard.form.list.hint")}
					/>
				))}
				<FormTextareaField
					control={form.control}
					name="about"
					label={t("dashboard.projects.form.about.label")}
					rows={4}
				/>
				<Controller
					control={form.control}
					name="blocks"
					render={({ field, fieldState }) => (
						<BlockEditor
							label={t("dashboard.projects.form.blocks.label")}
							value={field.value}
							onChange={field.onChange}
							types={blockTypes}
							specs={projectBlockSpecs}
							nested={true}
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
						render={<Link to={config.routes.dashboardProjects} />}
					>
						{t("dashboard.form.cancel")}
					</FormButton>
				</div>
			</FieldGroup>
		</form>
	);
};

export default ProjectForm;
