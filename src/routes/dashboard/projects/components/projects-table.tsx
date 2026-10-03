import React from "react";
import { useTranslation } from "react-i18next";
import { useReorderProjects } from "@/api/hooks/admin/projects/use-reorder-projects";
import type { AdminProject } from "@/api/types/admin/content";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ProjectRow } from "@/routes/dashboard/projects/components/project-row";

const columns = ["num", "name", "status", "categories", "actions"] as const;
const hidden: string[] = ["categories"];

interface ProjectsTableProps {
	projects: AdminProject[];
	onDelete: (project: AdminProject) => void;
}

/** Projects in site order; the arrows swap neighbours and save the full order. */
export const ProjectsTable: React.FC<ProjectsTableProps> = ({
	projects,
	onDelete,
}) => {
	const { t } = useTranslation();
	const reorder = useReorderProjects();
	const ordered = [...projects].sort((a, b) => a.order - b.order);

	const move = (index: number, delta: number) => {
		const ids = ordered.map((project) => project.id);
		const [moved] = ids.splice(index, 1);
		if (moved === undefined) return;
		ids.splice(index + delta, 0, moved);
		reorder.mutate(ids);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					{columns.map((column) => (
						<TableHead
							key={column}
							className={
								hidden.includes(column)
									? "max-md:hidden"
									: undefined
							}
						>
							{column === "actions" ? (
								<span className="sr-only">
									{t(
										`dashboard.projects.list.columns.${column}`,
									)}
								</span>
							) : (
								t(`dashboard.projects.list.columns.${column}`)
							)}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{ordered.map((project, index) => (
					<ProjectRow
						key={project.id}
						project={project}
						canMoveUp={index > 0}
						canMoveDown={index < ordered.length - 1}
						busy={reorder.isPending}
						onMove={(delta) => move(index, delta)}
						onDelete={onDelete}
					/>
				))}
			</TableBody>
		</Table>
	);
};

export default ProjectsTable;
