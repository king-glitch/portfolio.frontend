import { useEffect, useRef } from "react";

/**
 * One rAF loop, paused while the tab is hidden and cancelled on unmount.
 * `callback(dt, t)` gets ms since the previous frame (0 on the first) and the frame time.
 * Pass `active = false` to stop the loop (off-screen, reduced motion, settled).
 */
export function useRaf(
	callback: (dt: number, t: number) => void,
	active = true,
): void {
	const latest = useRef(callback);
	useEffect(() => {
		latest.current = callback;
	});

	useEffect(() => {
		if (!active) return;
		let id = 0;
		let last = 0;
		const loop = (t: number) => {
			latest.current(last ? t - last : 0, t);
			last = t;
			id = requestAnimationFrame(loop);
		};
		const sync = () => {
			cancelAnimationFrame(id);
			last = 0;
			if (document.visibilityState === "visible")
				id = requestAnimationFrame(loop);
		};
		document.addEventListener("visibilitychange", sync);
		sync();
		return () => {
			document.removeEventListener("visibilitychange", sync);
			cancelAnimationFrame(id);
		};
	}, [active]);
}
