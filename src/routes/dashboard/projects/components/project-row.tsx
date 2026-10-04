// style-lint-ignore-file query-states -- the categories only supply labels; until they load (or if they fail) the slug shows
import React from "react";
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useAdminProjectCategories } from "@/api/hooks/admin/settings/use-admin-project-categories";
import type { AdminProject } from "@/api/types/admin/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { dashboardProjectPath } from "@/lib/routes";
import { RowActions } from "@/routes/dashboard/components/row-actions";
import { StatusBadge } from "@/routes/dashboard/components/status/status-badge";

interface ProjectRowProps {
	project: AdminProject;
	canMoveUp: boolean;
	canMoveDown: boolean;
	/** Reorder request in flight: moves are disabled. */
	busy: boolean;
	onMove: (delta: number) => void;
	onDelete: (project: AdminProject) => void;
}

/** One project: number, name, status, categories, move/edit/delete. */
export const ProjectRow: React.FC<ProjectRowProps> = ({
	project,
	canMoveUp,
	canMoveDown,
	busy,
	onMove,
	onDelete,
}) => {
	const { t } = useTranslation();
	// labels are owner-defined data; a slug no longer in the setting shows as it is
	const categories = useAdminProjectCategories();
	const labelOf = (slug: string) =>
		categories.data?.find((c) => c.slug === slug)?.label ?? slug;
	return (
		<TableRow className="group/row">
			<TableCell className="w-16 text-muted-foreground tabular-nums">
				{project.num}
			</TableCell>
			<TableCell>
				<div className="flex flex-col">
					<span className="font-medium">{project.name}</span>
					<span className="text-xs text-muted-foreground">
						{project.slug}
					</span>
				</div>
			</TableCell>
			<TableCell>
				<StatusBadge status={project.status} />
			</TableCell>
			<TableCell className="max-md:hidden">
				<div className="flex flex-wrap gap-1">
					{project.categories.map((category) => (
						<Badge key={category} variant="secondary">
							{labelOf(category)}
						</Badge>
					))}
				</div>
			</TableCell>
			<TableCell>
				<RowActions
					name={project.name}
					editTo={dashboardProjectPath(project.id)}
					onDelete={() => onDelete(project)}
				>
					<Button
						variant="ghost"
						size="icon"
						disabled={!canMoveUp || busy}
						aria-label={t("dashboard.projects.list.move.up", {
							name: project.name,
						})}
						onClick={() => onMove(-1)}
					>
						<RiArrowUpLine />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						disabled={!canMoveDown || busy}
						aria-label={t("dashboard.projects.list.move.down", {
							name: project.name,
						})}
						onClick={() => onMove(1)}
					>
						<RiArrowDownLine />
					</Button>
				</RowActions>
			</TableCell>
		</TableRow>
	);
};

export default ProjectRow;
