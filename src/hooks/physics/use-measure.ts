import { useEffect, useRef, type RefObject } from "react";

/**
 * Runs `measure` on mount, on window resize and whenever `<body>` or a target changes size
 * (content above a section changed height). Engines cache rects here and never read layout in rAF.
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
		const run = () => latest.current();
		run();
		const observer = new ResizeObserver(run);
		observer.observe(document.body);
		for (const target of targets)
			if (target.current) observer.observe(target.current);
		window.addEventListener("resize", run);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", run);
		};
	}, [enabled]);
}
