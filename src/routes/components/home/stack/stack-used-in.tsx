import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsForStop } from "@/lib/portfolio/stack-stops";
import { workPath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";
import { PillVariant } from "@/types/ui";
import type { StackStop } from "@/types/home";

interface StackUsedInProps {
	stop: StackStop;
}

/** "<Stop> — used in" chips linking to the projects that touch the selected stop. */
export const StackUsedIn: React.FC<StackUsedInProps> = ({ stop }) => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProjects();

	const renderChips = () => {
		if (isError) return <QueryErrorAlert onRetry={() => void refetch()} />;
		if (isPending)
			return Array.from({ length: 3 }, (_, i) => (
				<Skeleton key={i} className="h-9.5 w-28 rounded-pill" />
			));
		return projectsForStop(stop, data ?? []).map((project) => (
			<PillButton
				key={project.id}
				cursor={CursorLabel.Open}
				nativeButton={false}
				render={<Link to={workPath(project.id)} viewTransition />}
				variant={PillVariant.Outline}
			>
				{project.name}
			</PillButton>
		));
	};

	return (
		<div
			aria-live="polite"
			className="mt-10 flex flex-wrap items-center gap-2.5"
		>
			<span className="mr-1.5 text-[15px] text-muted-foreground">
				{t("home.stack.used-in", { name: t(stop.nameKey) })}
			</span>
			{renderChips()}
		</div>
	);
};

export default StackUsedIn;
