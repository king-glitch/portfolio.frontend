import { useEffect, useRef, type RefObject } from "react";

const CHAPTER = "[data-chapter]";
// A line through the middle of the viewport: the panel crossing it is the current chapter.
const CENTRE_LINE = {
	horizontal: "0px -50% 0px -50%",
	vertical: "-50% 0px -50% 0px",
} as const;

/** Calls `onChapter` with the section under the viewport's centre line (`data-chapter` on each block's wrapper). */
export function useChapter(
	viewportRef: RefObject<HTMLElement | null>,
	vertical: boolean,
	onChapter: (chapter: string) => void,
): void {
	const latest = useRef(onChapter);
	latest.current = onChapter;
	useEffect(() => {
		const root = viewportRef.current;
		if (!root) return;
		const labels = new Map<Element, string>();
		for (const wrapper of root.querySelectorAll<HTMLElement>(CHAPTER)) {
			const panel = wrapper.firstElementChild;
			const label = wrapper.dataset.chapter;
			if (panel && label) labels.set(panel, label);
		}
		const observer = new IntersectionObserver(
			(entries) => {
				const hit = entries.find((entry) => entry.isIntersecting);
				const label = hit && labels.get(hit.target);
				if (label) latest.current(label);
			},
			{
				root,
				rootMargin: vertical
					? CENTRE_LINE.vertical
					: CENTRE_LINE.horizontal,
			},
		);
		for (const panel of labels.keys()) observer.observe(panel);
		return () => observer.disconnect();
	}, [viewportRef, vertical]);
}
