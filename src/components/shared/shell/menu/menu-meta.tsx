import React from "react";
import { useTranslation } from "react-i18next";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Skeleton } from "@/components/ui/skeleton";
import { PillSize, PillVariant } from "@/types/ui";

const pad = (n: number) => String(n).padStart(2, "0");

interface MenuMetaProps {}

/** "06 projects · 05 notes · 2026" in the menu header. On error it offers a retry. */
export const MenuMeta: React.FC<MenuMetaProps> = () => {
	const { t } = useTranslation();
	const projects = useProjects();
	const posts = usePosts();
	if (projects.isError || posts.isError)
		return (
			<PillButton
				variant={PillVariant.Ghost}
				size={PillSize.Sm}
				onClick={() => {
					void projects.refetch();
					void posts.refetch();
				}}
				className="max-desk:hidden"
			>
				{t("common.errors.retry")}
			</PillButton>
		);
	if (projects.isPending || posts.isPending)
		return (
			<Skeleton className="h-3.5 w-48 bg-current/10 max-desk:hidden" />
		);
	return (
		<span className="text-[13px] tabular-nums opacity-55 max-desk:hidden">
			{t("shell.menu.meta", {
				projects: pad(projects.data.length),
				notes: pad(posts.data.length),
				year: new Date().getFullYear(),
			})}
		</span>
	);
};

export default MenuMeta;
