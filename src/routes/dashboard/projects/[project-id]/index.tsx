import React from "react";
import { useTranslation } from "react-i18next";
import { isNotFound } from "@/api/errors";
import { useAdminProject } from "@/api/hooks/admin/projects/use-admin-project";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import i18n from "@/lib/i18n";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { ProjectForm } from "@/routes/dashboard/projects/components/project-form";
import { ProjectFormSkeleton } from "@/routes/dashboard/projects/[project-id]/components/project-form-skeleton";
import type { Route } from "./+types/index";

export function meta() {
	return [{ title: i18n.t("dashboard.projects.edit.meta.title") }];
}

interface ProjectEditProps extends Route.ComponentProps {}

const ProjectEdit: React.FC<ProjectEditProps> = ({ params }) => {
	const { t } = useTranslation();
	const project = useAdminProject(params.projectId);

	const renderBody = () => {
		if (project.isPending) return <ProjectFormSkeleton />;
		if (isNotFound(project.error))
			return (
				<QueryEmpty
					titleKey="dashboard.projects.not-found.title"
					action={{
						to: config.routes.dashboardProjects,
						labelKey: "dashboard.projects.not-found.action",
					}}
				/>
			);
		if (project.isError)
			return (
				<QueryErrorAlert
					onRetry={() => void project.refetch()}
					error={project.error}
				/>
			);
		return <ProjectForm key={project.data.id} project={project.data} />;
	};

	return (
		<>
			<PageHeader
				title={project.data?.name ?? t("dashboard.projects.edit.title")}
			/>
			{renderBody()}
		</>
	);
};

export default ProjectEdit;
