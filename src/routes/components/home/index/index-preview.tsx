import React, { useRef } from "react";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ProjectPreviewMock } from "@/components/shared/projects/project-preview-mock";
import { useCoarsePointer } from "@/hooks/physics/use-coarse-pointer";
import { usePointerFollow } from "@/hooks/physics/use-pointer-follow";
import { cn } from "@/lib/utils";

const OFFSCREEN = { transform: "translate3d(-999px,-999px,0)" };

interface IndexPreviewProps {
	projects: ProjectSummary[];
	/** Project under the pointer, or null (preview fades out). */
	hoveredId: string | null;
}

/** Floating 340x240 screen preview that trails the cursor over the index rows (desktop only, decorative). */
export const IndexPreview: React.FC<IndexPreviewProps> = ({
	projects,
	hoveredId,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const coarse = useCoarsePointer();
	usePointerFollow(ref, hoveredId !== null && !coarse);
	if (coarse) return null;
	return (
		<div
			ref={ref}
			aria-hidden="true"
			style={OFFSCREEN}
			className={cn(
				"pointer-events-none fixed top-0 left-0 z-55 h-60 w-85 overflow-hidden rounded-[20px] bg-card shadow-2xl ring-1 ring-border transition-opacity duration-350",
				hoveredId === null ? "opacity-0" : "opacity-100",
			)}
		>
			{projects.map((project) => (
				<ProjectPreviewMock
					key={project.id}
					kind={project.kind}
					className={cn(
						"transition-opacity duration-300",
						hoveredId === project.id ? "opacity-100" : "opacity-0",
					)}
				/>
			))}
		</div>
	);
};

export default IndexPreview;
