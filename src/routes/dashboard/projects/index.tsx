import React, { useState } from "react";
import { RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";
import { useDeleteProject } from "@/api/hooks/admin/projects/use-delete-project";
import type { AdminProject } from "@/api/types/admin/content";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { useRetainedValue } from "@/hooks/use-retained-value";
import i18n from "@/lib/i18n";
import { DeleteDialog } from "@/routes/dashboard/components/delete-dialog";
import { ListSkeleton } from "@/routes/dashboard/components/list-skeleton";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { ProjectsTable } from "@/routes/dashboard/projects/components/projects-table";

export function meta() {
	return [{ title: i18n.t("dashboard.projects.list.meta.title") }];
}

interface ProjectsProps {}

const Projects: React.FC<ProjectsProps> = () => {
	const { t } = useTranslation();
	const projects = useAdminProjects();
	const remove = useDeleteProject();
	const [target, setTarget] = useState<AdminProject>();
	const [open, setOpen] = useState(false);
	const retained = useRetainedValue(target);

	const askDelete = (project: AdminProject) => {
		setTarget(project);
		setOpen(true);
	};
	const confirmDelete = () => {
		if (!target) return;
		remove.mutate(target.id, {
			onSuccess: () => {
				setOpen(false);
				toast.add({
					type: "success",
					title: t("dashboard.projects.list.deleted"),
				});
			},
		});
	};

	const renderBody = () => {
		if (projects.isPending) return <ListSkeleton />;
		if (projects.isError)
			return (
				<QueryErrorAlert
					onRetry={() => void projects.refetch()}
					error={projects.error}
				/>
			);
		if (!projects.data.length)
			return (
				<QueryEmpty
					titleKey="dashboard.projects.list.empty.title"
					descriptionKey="dashboard.projects.list.empty.description"
					action={{
						to: config.routes.dashboardProjectNew,
						labelKey: "dashboard.projects.list.empty.action",
					}}
				/>
			);
		return <ProjectsTable projects={projects.data} onDelete={askDelete} />;
	};

	return (
		<>
			<PageHeader
				title={t("dashboard.projects.list.title")}
				description={t("dashboard.projects.list.description")}
				action={
					<Button
						nativeButton={false}
						render={<Link to={config.routes.dashboardProjectNew} />}
					>
						<RiAddLine data-icon="inline-start" />
						{t("dashboard.projects.list.new")}
					</Button>
				}
			/>
			{renderBody()}
			<DeleteDialog
				open={open}
				onOpenChange={setOpen}
				name={retained?.name}
				pending={remove.isPending}
				onConfirm={confirmDelete}
			/>
		</>
	);
};

export default Projects;
