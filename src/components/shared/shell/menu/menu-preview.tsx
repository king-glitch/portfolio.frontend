// style-lint-ignore-file query-states -- the card falls back to the page motifs while projects load or fail; MenuProjects renders the list's skeleton, error alert and retry
import React from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { MENU_PAGES } from "@/components/shared/shell/menu/pages";
import { ProjectPreviewMock } from "@/components/shared/projects/project-preview-mock";
import { cn } from "@/lib/utils";

interface MenuPreviewProps {
	/** Page id or project id currently hovered. */
	activeId: string;
}

interface Layer {
	id: string;
	label: string;
	art: React.ReactNode;
}

/** Live preview card: every page and project is a stacked layer, the hovered one fades and scales in. */
export const MenuPreview: React.FC<MenuPreviewProps> = ({ activeId }) => {
	const { t } = useTranslation();
	const { data: projects = [] } = useProjects();
	const layers: Layer[] = [
		...MENU_PAGES.map((page) => ({
			id: page.id,
			label: t(page.titleKey),
			art: <ProjectMotif kind={page.kind} />,
		})),
		...projects.map((project) => ({
			id: project.id,
			label: project.name,
			art: <ProjectPreviewMock kind={project.kind} />,
		})),
	];
	const active = layers.find((layer) => layer.id === activeId);

	return (
		<div
			aria-hidden="true"
			className="relative aspect-16/10 overflow-hidden rounded-3xl opacity-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)] invert-scope motion-safe:animate-menu-in motion-reduce:opacity-100 max-desk:hidden"
			style={{ animationDelay: "0.25s" }}
		>
			{/* The menu is an inverted surface; flip back so the mocks and chip use the page's own theme. */}
			<div className="absolute inset-0 bg-background text-foreground invert-surface">
				{layers.map((layer) => (
					<div
						key={layer.id}
						className={cn(
							"absolute inset-0 scale-[1.06] opacity-0 transition-[opacity,scale] duration-900 ease-[cubic-bezier(.16,1,.3,1)]",
							layer.id === activeId && "scale-100 opacity-100",
						)}
					>
						{layer.art}
					</div>
				))}
				{active ? (
					<span className="absolute bottom-3.5 left-4 rounded-pill bg-foreground px-3 py-1.5 text-xs font-bold text-background">
						{active.label}
					</span>
				) : null}
			</div>
		</div>
	);
};

export default MenuPreview;
