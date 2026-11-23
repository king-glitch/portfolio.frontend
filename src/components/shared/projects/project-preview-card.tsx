import React from "react";
import { useTranslation } from "react-i18next";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ProjectPreviewMock } from "@/components/shared/projects/project-preview-mock";
import { TagPill } from "@/components/common/badges/tag-pill";
import { MetaCode } from "@/components/common/typography/meta-code";
import { cn } from "@/lib/utils";

interface ProjectPreviewCardProps {
	project: ProjectSummary;
	/** Eager-load above-the-fold hero thumbnails for LCP. */
	priority?: boolean;
	className?: string;
}

/** Non-interactive project card: screen mock, number, name and side. Wrap it in a link or button at the call site. */
export const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({
	project,
	priority = false,
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
				<ProjectPreviewMock
					kind={project.kind}
					imageUrl={project.artUrl}
					priority={priority}
				/>
				<TagPill className="absolute top-3 left-3 bg-card/85 text-muted-foreground backdrop-blur-sm max-sm:hidden">
					{t(`common.sides.${project.side}`)}
				</TagPill>
			</span>
			<span className="flex items-center gap-3 border-t border-border px-3 py-3 sm:px-4">
				<span className="flex min-w-0 items-baseline gap-2.5">
					<MetaCode>{project.num}</MetaCode>
					<span className="truncate text-[15px] font-semibold tracking-tight">
						{project.name}
					</span>
				</span>
			</span>
		</span>
	);
};

export default ProjectPreviewCard;
