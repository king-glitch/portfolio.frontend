import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";
import { nextId, prevId } from "@/lib/portfolio/project-nav";
import { projectPath } from "@/lib/routes";
import { ProjectViewport } from "@/routes/projects/[project-id]/components/scroller/project-viewport";
import { ProjectTopbar } from "@/routes/projects/[project-id]/components/topbar/project-topbar";

interface ProjectContentProps {
	project: Project;
	/** Undefined until the project list loads (or if it failed). */
	projects?: ProjectSummary[];
	projectsFailed: boolean;
}

/** Fixed full-viewport project page. Mount it with `key={project.id}` so scroll state resets per project. */
export const ProjectContent: React.FC<ProjectContentProps> = ({
	project,
	projects,
	projectsFailed,
}) => {
	const navigate = useNavigate();
	const barRef = useRef<HTMLDivElement>(null);
	const [leaving, setLeaving] = useState(false);
	const ids = projects?.map((p) => p.id);
	const position = ids ? ids.indexOf(project.id) + 1 || undefined : undefined;
	const nextProjectId = ids && nextId(ids, project.id);
	const prevProjectId = ids && prevId(ids, project.id);
	const next = projects?.find((p) => p.id === nextProjectId);

	const close = () => {
		// React Router keeps the entry index in history.state; > 0 means an in-app entry to go back to.
		const idx: unknown = window.history.state?.idx;
		if (typeof idx === "number" && idx > 0) void navigate(-1);
		else void navigate(config.routes.home);
	};
	// Replace, not push: stepping through projects keeps one history entry, so Close returns to
	// wherever the visitor came from instead of the previous project.
	const goNext = (animated: boolean) => {
		if (nextProjectId)
			void navigate(projectPath(nextProjectId), {
				replace: true,
				viewTransition: animated,
			});
	};

	return (
		<div className="fixed inset-0 overflow-hidden bg-background text-foreground">
			<ProjectTopbar
				num={project.num}
				name={project.name}
				position={position}
				total={projects?.length}
				showCounter={!projectsFailed}
				prevTo={prevProjectId ? projectPath(prevProjectId) : undefined}
				nextTo={nextProjectId ? projectPath(nextProjectId) : undefined}
				onClose={close}
				leaving={leaving}
				barRef={barRef}
			/>
			<ProjectViewport
				project={project}
				next={next}
				onNext={goNext}
				onClose={close}
				onPushStart={() => setLeaving(true)}
				barRef={barRef}
			/>
		</div>
	);
};

export default ProjectContent;
