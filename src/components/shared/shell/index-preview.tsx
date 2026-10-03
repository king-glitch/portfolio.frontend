import React, { useRef, useState } from "react";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ProjectPreviewMock } from "@/components/shared/projects/project-preview-mock";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useHoverCapable } from "@/hooks/pointer/use-sticky-cursor";
import { config } from "@/config";
import { previewStep } from "@/lib/motion/cursor";
import { cn } from "@/lib/utils";

interface IndexPreviewProps {
	/** Project under the pointer; null fades the card out. */
	project: ProjectSummary | null;
}

/**
 * Follow-the-cursor project card for index rows (prototype INDEX HOVER PREVIEW).
 * Mount once per list; not rendered on touch. Reduced motion: no easing or tilt.
 */
export const IndexPreview: React.FC<IndexPreviewProps> = ({ project }) => {
	const hoverCapable = useHoverCapable();
	const reduced = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const pointer = useRef({ x: 0, y: 0 });
	const pos = useRef<{ x: number; y: number } | null>(null);
	const [shown, setShown] = useState(project);
	if (project && project !== shown) setShown(project);
	const { offsetXPx, offsetYPx } = config.shell.indexPreview;

	React.useEffect(() => {
		if (!hoverCapable) return;
		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
		};
		document.addEventListener("pointermove", onMove, { passive: true });
		return () => document.removeEventListener("pointermove", onMove);
	}, [hoverCapable]);

	useRaf(
		() => {
			const el = ref.current;
			if (!el) return;
			const { x: mx, y: my } = pointer.current;
			const from = pos.current ?? { x: mx, y: my };
			const next = reduced
				? { x: mx, y: my, rotateDeg: 0 }
				: previewStep(from, mx, my, config.shell.indexPreview);
			pos.current = next;
			el.style.transform = `translate3d(${(next.x + offsetXPx).toFixed(1)}px,${(next.y + offsetYPx).toFixed(1)}px,0) rotate(${next.rotateDeg.toFixed(2)}deg)`;
		},
		hoverCapable && project !== null,
	);

	if (!hoverCapable) return null;
	return (
		<div
			ref={ref}
			aria-hidden="true"
			className={cn(
				"pointer-events-none fixed top-0 left-0 z-55 h-60 w-85 overflow-hidden rounded-[20px] bg-card opacity-0 shadow-[0_0_0_1px_var(--border),0_30px_60px_-20px_rgba(0,0,0,.7)] transition-opacity duration-300",
				project && "opacity-100",
			)}
			style={{ transform: "translate3d(-999px,-999px,0)" }}
		>
			{shown ? (
				<ProjectPreviewMock kind={shown.kind} imageUrl={shown.artUrl} />
			) : null}
		</div>
	);
};

export default IndexPreview;
