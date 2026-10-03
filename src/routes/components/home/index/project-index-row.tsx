import React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ProjectIndexTitle } from "@/routes/components/home/index/project-index-title";
import { projectPath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";

interface ProjectIndexRowProps {
	project: ProjectSummary;
	/** Reports the hovered/focused project (null on leave) so the floating preview follows. */
	onHover: (id: string | null) => void;
}

/** One index row: number, rolling name, first three tags, side and an arrow; inverts on hover/focus. */
export const ProjectIndexRow: React.FC<ProjectIndexRowProps> = ({
	project,
	onHover,
}) => {
	const { t } = useTranslation();
	return (
		<Link
			to={projectPath(project.id)}
			viewTransition
			data-cursor={CursorLabel.View}
			aria-label={t("home.index.row.aria-label", { name: project.name })}
			onMouseEnter={() => onHover(project.id)}
			onMouseLeave={() => onHover(null)}
			onFocus={() => onHover(project.id)}
			onBlur={() => onHover(null)}
			className="group/row grid reveal-on-scroll grid-cols-[52px_minmax(0,1fr)_28px] items-center gap-6 border-b px-1 py-7.5 transition-[background-color,color,padding,opacity] duration-500 ease-(--ease-out-expo) outline-none hover:bg-foreground hover:px-7 hover:text-background focus-visible:bg-foreground focus-visible:px-7 focus-visible:text-background desk:grid-cols-[96px_minmax(0,1fr)_minmax(0,0.9fr)_130px_40px]"
		>
			<span className="text-[13px] font-medium tracking-widest tabular-nums opacity-60">
				{project.num}
			</span>
			<span className="min-w-0">
				<span className="block text-[clamp(26px,3.6vw,56px)] leading-[1.05] font-bold tracking-[-0.045em]">
					<ProjectIndexTitle name={project.name} />
				</span>
				<span className="mt-2 block text-[13px] text-muted-foreground desk:hidden">
					{project.tags.slice(0, 3).join(" · ")}
				</span>
			</span>
			<span className="text-sm leading-[1.4] text-muted-foreground transition-colors group-hover/row:text-background group-focus-visible/row:text-background max-desk:hidden">
				{project.tags.slice(0, 3).join(" · ")}
			</span>
			<span className="text-[13px] font-medium text-muted-foreground transition-colors group-hover/row:text-background group-focus-visible/row:text-background max-desk:hidden">
				{t(`common.sides.${project.side}`)}
			</span>
			<RiArrowRightLine
				aria-hidden="true"
				className="size-7 transition-transform duration-600 ease-(--ease-out-expo) group-hover/row:-rotate-45"
			/>
		</Link>
	);
};

export default ProjectIndexRow;
