import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";
import { nextId, prevId } from "@/lib/portfolio/project-nav";
import { workPath } from "@/lib/routes";
import { ProjectJsonSheet } from "@/routes/work/[project-id]/components/json/project-json-sheet";
import { ProjectViewport } from "@/routes/work/[project-id]/components/scroller/project-viewport";
import { ProjectTopbar } from "@/routes/work/[project-id]/components/topbar/project-topbar";

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
	const [jsonOpen, setJsonOpen] = useState(false);
	const barRef = useRef<HTMLDivElement>(null);
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
	const goNext = () => {
		if (nextProjectId)
			void navigate(workPath(nextProjectId), { viewTransition: true });
	};

	return (
		<div className="fixed inset-0 overflow-hidden bg-background text-foreground">
			<ProjectTopbar
				num={project.num}
				name={project.name}
				position={position}
				total={projects?.length}
				showCounter={!projectsFailed}
				prevTo={prevProjectId ? workPath(prevProjectId) : undefined}
				nextTo={nextProjectId ? workPath(nextProjectId) : undefined}
				jsonOpen={jsonOpen}
				onClose={close}
				onToggleJson={() => setJsonOpen((open) => !open)}
				barRef={barRef}
			/>
			<ProjectJsonSheet
				project={project}
				open={jsonOpen}
				onOpenChange={setJsonOpen}
			/>
			<ProjectViewport
				project={project}
				next={next}
				onNext={goNext}
				onClose={close}
				barRef={barRef}
			/>
		</div>
	);
};

export default ProjectContent;
