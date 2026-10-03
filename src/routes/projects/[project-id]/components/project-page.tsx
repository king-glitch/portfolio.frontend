import React from "react";
import { isNotFound } from "@/api/errors";
import { useProject } from "@/api/hooks/portfolio/use-project";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { ProjectContent } from "@/routes/projects/[project-id]/components/project-content";
import { ProjectPageSkeleton } from "@/routes/projects/[project-id]/components/project-page-skeleton";

interface ProjectPageProps {
	projectId: string;
}

/** Loading, error, not-found and success states of `/projects/:projectId`. */
export const ProjectPage: React.FC<ProjectPageProps> = ({ projectId }) => {
	const project = useProject(projectId);
	const projects = useProjects();

	if (project.isPending) return <ProjectPageSkeleton />;
	if (project.isError) {
		const body = isNotFound(project.error) ? (
			<QueryEmpty
				titleKey="common.not-found.title"
				action={{
					to: config.routes.home,
					labelKey: "common.not-found.action",
				}}
			/>
		) : (
			<QueryErrorAlert
				onRetry={() => void project.refetch()}
				error={project.error}
			/>
		);
		return (
			<main className="fixed inset-0 flex items-center justify-center p-6">
				<div className="w-full max-w-md">{body}</div>
			</main>
		);
	}
	return (
		<ProjectContent
			key={project.data.id}
			project={project.data}
			projects={projects.data}
			projectsFailed={projects.isError}
		/>
	);
};

export default ProjectPage;
