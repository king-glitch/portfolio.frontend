import { useEffect, type RefObject } from "react";

/**
 * Drives a progress bar from page scroll: `scaleX(scrollY / (docHeight - vh))`
 * and `aria-valuenow`. Passive listener, one rAF per frame; no smoothing.
 */
export function useReadProgress(barRef: RefObject<HTMLElement | null>) {
	useEffect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			const bar = barRef.current;
			if (!bar) return;
			const max =
				document.documentElement.scrollHeight - window.innerHeight;
			const ratio =
				max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
			bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
			bar.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return () => {
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			cancelAnimationFrame(frame);
		};
	}, [barRef]);
}
