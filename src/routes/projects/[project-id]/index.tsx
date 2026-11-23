import React from "react";
import { projectQuery, projectsQuery } from "@/api/queries/portfolio";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import { ProjectPage } from "@/routes/projects/[project-id]/components/project-page";
import type { Route } from "./+types/index";

/** Client navigations wait for this page's data, so the transition lands on the loaded page. */
export function clientLoader({ params }: Route.ClientLoaderArgs) {
	return preloadQueries(
		queryClient.ensureQueryData(projectQuery(params.projectId)),
		queryClient.ensureQueryData(projectsQuery()),
	);
}

export function meta({ params }: Route.MetaArgs) {
	const project = queryClient.getQueryData(
		projectQuery(params.projectId).queryKey,
	);
	return [
		{
			title: project
				? i18n.t("projects.meta.project", { name: project.name })
				: i18n.t("projects.meta.title"),
		},
	];
}

interface ProjectRouteProps extends Route.ComponentProps {}

const ProjectRoute: React.FC<ProjectRouteProps> = ({ params }) => {
	return <ProjectPage projectId={params.projectId} />;
};

export default ProjectRoute;
