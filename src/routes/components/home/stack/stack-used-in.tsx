import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsForStop } from "@/lib/portfolio/stack-stops";
import { projectPath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";
import type { StackStop } from "@/api/types/portfolio/project";

interface StackUsedInProps {
	stop: StackStop;
}

/** Shipped project links rendered inside the inverted StackFlow stage. */
export const StackUsedIn: React.FC<StackUsedInProps> = ({ stop }) => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProjects();

	const renderLinks = () => {
		if (isError) return <QueryErrorAlert onRetry={() => void refetch()} />;
		if (isPending)
			return Array.from({ length: 3 }, (_, i) => (
				<Skeleton key={i} className="h-5 w-20 bg-current/20" />
			));
		return projectsForStop(stop, data ?? []).map((project) => (
			<Link
				key={project.id}
				to={projectPath(project.id)}
				viewTransition
				data-cursor={CursorLabel.Open}
				className="group/proj inline-flex items-baseline gap-1.5 border-b border-current/30 pb-0.5 text-[15px] font-medium text-inherit transition-colors duration-200 hover:border-current"
			>
				<span>{project.name}</span>
				<span
					aria-hidden="true"
					className="text-xs opacity-65 transition-transform duration-200 group-hover/proj:translate-x-0.5 group-hover/proj:-translate-y-0.5 group-hover/proj:opacity-100"
				>
					↗
				</span>
			</Link>
		));
	};

	return (
		<div aria-live="polite" className="flex flex-col gap-3">
			<span className="font-mono text-xs opacity-55">
				{t("home.stack.used-in")}
			</span>
			<div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
				{renderLinks()}
			</div>
		</div>
	);
};

export default StackUsedIn;
