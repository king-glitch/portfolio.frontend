import React from "react";
import { useTranslation } from "react-i18next";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ProjectPreviewMock } from "@/components/shared/projects/project-preview-mock";
import { TagPill } from "@/components/common/badges/tag-pill";
import { cn } from "@/lib/utils";

interface ProjectPreviewCardProps {
	project: ProjectSummary;
	className?: string;
}

/** Non-interactive project card: screen mock, number, name and side. Wrap it in a link or button at the call site. */
export const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({
	project,
	className,
}) => {
	const { t } = useTranslation();
	return (
		<span
			className={cn(
				"flex size-full flex-col overflow-hidden rounded-2xl bg-card text-left ring-1 ring-border",
				className,
			)}
		>
			<span className="relative block min-h-0 grow">
				<ProjectPreviewMock kind={project.kind} />
			</span>
			<span className="flex items-center justify-between gap-3 border-t border-border px-3 py-3 sm:px-4">
				<span className="flex min-w-0 items-baseline gap-2.5">
					<span className="text-[11px] font-medium tracking-widest text-muted-foreground tabular-nums">
						{project.num}
					</span>
					<span className="truncate text-[15px] font-bold tracking-tight">
						{project.name}
					</span>
				</span>
				<TagPill className="shrink-0 text-muted-foreground max-sm:hidden">
					{t(`common.sides.${project.side}`)}
				</TagPill>
			</span>
		</span>
	);
};

export default ProjectPreviewCard;
