import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";
import { useChapter } from "@/hooks/scroll/use-chapter";
import { useHorizontalScroller } from "@/hooks/scroll/use-horizontal-scroller";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "@/routes/projects/[project-id]/components/blocks/block-renderer";
import { NextProject } from "@/routes/projects/[project-id]/components/scroller/next-project";

interface ProjectViewportProps {
	project: Project;
	next?: ProjectSummary;
	/** `animated`: use the page transition (vertical layout); false after the in-place hand-off. */
	onNext: (animated: boolean) => void;
	onClose: () => void;
	/** The push to the next project started. */
	onPushStart: () => void;
	/** The section under the viewport's centre changed. */
	onChapter: (chapter: string) => void;
	barRef: React.RefObject<HTMLDivElement | null>;
}

/** Panel scroller: horizontal engine on desktop (wheel/keys, resistance), a plain vertical page on phones and tablets. */
export const ProjectViewport: React.FC<ProjectViewportProps> = ({
	project,
	next,
	onNext,
	onClose,
	onPushStart,
	onChapter,
	barRef,
}) => {
	const { t } = useTranslation();
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);
	const coverRef = useRef<HTMLElement>(null);
	const percentRef = useRef<HTMLSpanElement>(null);
	const { vertical, commit } = useHorizontalScroller({
		viewportRef,
		trackRef,
		barRef,
		nextRef,
		coverRef,
		percentRef,
		onPushStart,
		onThreshold: () => onNext(vertical),
		onEscape: onClose,
	});
	useChapter(viewportRef, vertical, onChapter);
	const numbered = project.blocks.map((block, i) => ({
		block,
		index:
			project.blocks
				.slice(0, i)
				.filter((b) => b.type !== BlockType.ProjectHeader).length + 1,
	}));

	return (
		<>
			<div
				ref={viewportRef}
				role="region"
				tabIndex={0}
				aria-label={t("projects.viewport.label", {
					name: project.name,
				})}
				data-flow={vertical ? "vertical" : "horizontal"}
				className={cn(
					"absolute inset-0 outline-none",
					vertical
						? "overflow-x-hidden overflow-y-auto overscroll-contain"
						: "overflow-hidden",
				)}
			>
				<div
					ref={trackRef}
					className={cn(
						"relative flex",
						vertical
							? "w-full flex-col"
							: "h-full w-max will-change-transform",
					)}
				>
					{numbered.map(({ block, index }, i) => (
						<BlockRenderer
							key={`${block.type}-${i}`}
							block={block}
							index={index}
							project={project}
						/>
					))}
					<NextProject
						next={next}
						vertical={vertical}
						onNext={commit}
						nextRef={nextRef}
						coverRef={coverRef}
						percentRef={percentRef}
					/>
				</div>
			</div>
		</>
	);
};

export default ProjectViewport;
