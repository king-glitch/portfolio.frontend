import React from "react";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useAdminProjectCategories } from "@/api/hooks/admin/settings/use-admin-project-categories";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { config } from "@/config";
import type { ProjectFormValues } from "@/routes/dashboard/projects/components/project-form-schema";

interface ProjectCategoriesFieldProps {
	control: Control<ProjectFormValues>;
}

const SKELETON_CHIPS = 3;

/** Category toggles built from the `project_categories` setting. A slug the project has but the setting no longer lists shows as "unknown" and goes away when switched off. */
export const ProjectCategoriesField: React.FC<ProjectCategoriesFieldProps> = ({
	control,
}) => {
	const { t } = useTranslation();
	const categories = useAdminProjectCategories();

	const renderBody = (
		selected: string[],
		onChange: (v: string[]) => void,
	) => {
		if (categories.isPending)
			return (
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: SKELETON_CHIPS }, (_, index) => (
						<Skeleton key={index} className="h-10 w-28" />
					))}
				</div>
			);
		if (categories.isError)
			return (
				<QueryErrorAlert
					onRetry={() => void categories.refetch()}
					error={categories.error}
				/>
			);
		const known = new Set(categories.data.map((c) => c.slug));
		// labels are owner-defined data: rendered as they are
		const options = [
			...categories.data.map(({ slug, label }) => ({
				value: slug,
				label,
			})),
			...selected
				.filter((slug) => !known.has(slug))
				.map((slug) => ({
					value: slug,
					label: t("dashboard.projects.form.categories.unknown", {
						slug,
					}),
				})),
		];
		if (!options.length)
			return (
				<FieldDescription>
					{t("dashboard.projects.form.categories.empty")}{" "}
					<Link
						to={config.routes.dashboardSettingsCategories}
						className="underline"
					>
						{t("dashboard.projects.form.categories.manage")}
					</Link>
				</FieldDescription>
			);
		return (
			<ToggleGroup
				multiple
				variant="outline"
				value={selected}
				onValueChange={onChange}
				className="flex-wrap"
			>
				{options.map((option) => (
					<ToggleGroupItem key={option.value} value={option.value}>
						{option.label}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		);
	};

	return (
		<Controller
			control={control}
			name="categories"
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>
						{t("dashboard.projects.form.categories.label")}
					</FieldLabel>
					{renderBody(field.value, field.onChange)}
					{fieldState.invalid ? (
						<FieldError errors={[fieldState.error]} />
					) : null}
				</Field>
			)}
		/>
	);
};

export default ProjectCategoriesField;
