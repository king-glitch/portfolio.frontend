import React from "react";
import i18n from "@/lib/i18n";
import { ProjectPage } from "@/routes/work/[project-id]/components/project-page";
import type { Route } from "./+types/index";

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("work.meta.title") }];
}

interface WorkProps extends Route.ComponentProps {}

const Work: React.FC<WorkProps> = ({ params }) => {
	return <ProjectPage projectId={params.projectId} />;
};

export default Work;
