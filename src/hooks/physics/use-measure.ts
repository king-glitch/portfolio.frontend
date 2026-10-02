import { useEffect, useRef, type RefObject } from "react";

/**
 * Runs `measure` on mount, on window resize, whenever `<body>` or a target changes size
 * (content above a section changed height), after web fonts load and after any CSS animation
 * ends (the first-load page rise moves every rect without resizing anything).
 * Engines cache rects here and never read layout in rAF.
 */
export function useMeasure(
	measure: () => void,
	enabled = true,
	targets: RefObject<Element | null>[] = [],
): void {
	const latest = useRef(measure);
	useEffect(() => {
		latest.current = measure;
	});
	useEffect(() => {
		if (!enabled) return;
		let frame = 0;
		const run = () => latest.current();
		// Coalesce bursts (several animations ending together) into one measure per frame.
		const soon = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(run);
		};
		run();
		const observer = new ResizeObserver(soon);
		observer.observe(document.body);
		for (const target of targets)
			if (target.current) observer.observe(target.current);
		window.addEventListener("resize", soon);
		document.addEventListener("animationend", soon);
		void document.fonts.ready.then(soon);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener("resize", soon);
			document.removeEventListener("animationend", soon);
		};
	}, [enabled]);
}
