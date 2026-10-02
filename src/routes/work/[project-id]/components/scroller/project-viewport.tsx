import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";
import { useHorizontalScroller } from "@/hooks/scroll/use-horizontal-scroller";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "@/routes/work/[project-id]/components/blocks/block-renderer";
import { EndCap } from "@/routes/work/[project-id]/components/scroller/end-cap";

interface ProjectViewportProps {
	project: Project;
	next?: ProjectSummary;
	onNext: () => void;
	onClose: () => void;
	barRef: React.RefObject<HTMLDivElement | null>;
}

/** Horizontal panel scroller: desktop engine (wheel/keys, resistance) or native scroll-snap on touch. */
export const ProjectViewport: React.FC<ProjectViewportProps> = ({
	project,
	next,
	onNext,
	onClose,
	barRef,
}) => {
	const { t } = useTranslation();
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const meterRef = useRef<HTMLDivElement>(null);
	const fillRef = useRef<HTMLDivElement>(null);
	const { touch } = useHorizontalScroller({
		viewportRef,
		trackRef,
		barRef,
		meterRef,
		fillRef,
		onThreshold: onNext,
		onEscape: onClose,
	});
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
				aria-label={t("work.viewport.label", { name: project.name })}
				className={cn(
					"absolute inset-0 outline-none",
					touch
						? "snap-x snap-mandatory overflow-x-auto overflow-y-hidden **:data-panel:snap-start"
						: "overflow-hidden",
				)}
			>
				<div
					ref={trackRef}
					className="relative flex h-full w-max will-change-transform"
				>
					{numbered.map(({ block, index }, i) => (
						<BlockRenderer
							key={`${block.type}-${i}`}
							block={block}
							index={index}
							projectKind={project.kind}
						/>
					))}
					<EndCap
						next={next}
						touch={touch}
						onNext={onNext}
						meterRef={meterRef}
						fillRef={fillRef}
					/>
				</div>
			</div>
		</>
	);
};

export default ProjectViewport;
