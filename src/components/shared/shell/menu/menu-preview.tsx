import React from "react";
import { useTranslation } from "react-i18next";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { ProjectPreviewMock } from "@/components/shared/projects/project-preview-mock";
import { MENU_PAGES } from "@/lib/menu-pages";
import { cn } from "@/lib/utils";
import type { MenuHover } from "@/types/ui";

interface MenuPreviewProps {
	active: MenuHover;
}

/** Live preview card: page motifs cross-fade; a hovered project's screen fades and scales in on top. */
export const MenuPreview: React.FC<MenuPreviewProps> = ({ active }) => {
	const { t } = useTranslation();
	const page = MENU_PAGES.find((p) => p.id === active.id);
	const label = active.project?.name ?? (page ? t(page.titleKey) : "");

	return (
		<div
			aria-hidden="true"
			className="relative aspect-16/10 overflow-hidden rounded-3xl opacity-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)] invert-scope motion-safe:animate-menu-in motion-reduce:opacity-100 max-desk:hidden"
			style={{ animationDelay: "0.25s" }}
		>
			{/* The menu is an inverted surface; flip back so the mocks and chip use the page's own theme. */}
			<div className="absolute inset-0 bg-background text-foreground invert-surface">
				{MENU_PAGES.map((item) => (
					<div
						key={item.id}
						className={cn(
							"absolute inset-0 scale-[1.06] opacity-0 transition-[opacity,scale] duration-900 ease-(--ease-out-expo)",
							item.id === active.id && "scale-100 opacity-100",
						)}
					>
						<ProjectMotif kind={item.kind} />
					</div>
				))}
				{active.project ? (
					<div
						key={active.project.id}
						className="absolute inset-0 bg-background transition-[opacity,scale] duration-900 ease-(--ease-out-expo) starting:scale-[1.06] starting:opacity-0"
					>
						<ProjectPreviewMock
							kind={active.project.kind}
							imageUrl={active.project.artUrl}
						/>
					</div>
				) : null}
				<span className="absolute bottom-3.5 left-4 rounded-pill bg-foreground px-3 py-1.5 text-xs font-bold text-background">
					{label}
				</span>
			</div>
		</div>
	);
};

export default MenuPreview;
