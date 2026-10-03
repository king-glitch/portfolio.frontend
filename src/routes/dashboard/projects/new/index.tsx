import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { ProjectForm } from "@/routes/dashboard/projects/components/project-form";

export function meta() {
	return [{ title: i18n.t("dashboard.projects.new.meta.title") }];
}

interface ProjectNewProps {}

const ProjectNew: React.FC<ProjectNewProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			<PageHeader title={t("dashboard.projects.new.title")} />
			<ProjectForm />
		</>
	);
};

export default ProjectNew;
