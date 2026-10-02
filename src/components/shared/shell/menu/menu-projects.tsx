import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { workPath } from "@/lib/routes";

interface MenuProjectsProps {
	onHover: (projectId: string) => void;
	/** Called on link click so the menu can close. */
	onSelect: () => void;
}

const SKELETON_ROWS = Array.from(
	{ length: config.shell.menu.projectRows },
	(_, row) => row,
);

/** Project list: loading skeleton (same row height), error + retry, empty, rows. Row height 44px = tap target. */
export const MenuProjects: React.FC<MenuProjectsProps> = ({
	onHover,
	onSelect,
}) => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProjects();

	let body: React.ReactNode;
	if (isPending)
		body = SKELETON_ROWS.map((row) => (
			<Skeleton
				key={row}
				className="h-11 w-full rounded-none border-b border-current/25 bg-current/10"
			/>
		));
	else if (isError) body = <QueryErrorAlert onRetry={() => void refetch()} />;
	else if (data.length === 0)
		body = <QueryEmpty titleKey="shell.menu.projects.empty.title" />;
	else
		body = data.map((project) => (
			<Button
				key={project.id}
				variant="ghost"
				nativeButton={false}
				render={<Link to={workPath(project.id)} viewTransition />}
				onClick={onSelect}
				onMouseEnter={() => onHover(project.id)}
				onFocus={() => onHover(project.id)}
				className="h-11 w-full justify-between gap-4 rounded-none border-0 border-b border-current/25 px-0 text-[19px] font-bold tracking-[-0.02em] transition-[padding] duration-500 hover:bg-transparent hover:pl-3 focus-visible:pl-3 focus-visible:ring-0 dark:hover:bg-transparent"
			>
				<span>{project.name}</span>
				<span className="text-xs font-semibold tabular-nums opacity-45">
					{project.num}
				</span>
			</Button>
		));

	return (
		<div className="menu-in" style={{ animationDelay: "0.32s" }}>
			<div className="mb-1.5 flex justify-between text-xs font-semibold tracking-[0.14em] uppercase opacity-55">
				<span>{t("shell.menu.projects.heading")}</span>
				<span>{String(data?.length ?? 0).padStart(2, "0")}</span>
			</div>
			{body}
		</div>
	);
};

export default MenuProjects;
