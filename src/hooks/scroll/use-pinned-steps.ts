import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";

const QUERY = config.media.horizontal;

function subscribe(onChange: () => void) {
	const media = window.matchMedia(QUERY);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

/** Step index for a scroll progress in [0, 1] split into `steps` equal bands. */
export const stepAt = (progress: number, steps: number) =>
	Math.min(steps - 1, Math.max(0, Math.floor(progress * steps)));

/**
 * Scroll-driven stepper over a tall `trackRef` whose child is `position: sticky`.
 * Only active on laptop/desktop (`config.media.horizontal`) without reduced motion and with steps;
 * otherwise `pinned` is false, nothing listens and the caller lays the steps out normally.
 * `goTo(i)` scrolls the window to the middle of step `i`'s band.
 */
export function usePinnedSteps(
	trackRef: RefObject<HTMLElement | null>,
	steps: number,
	onStep: (index: number) => void,
): { pinned: boolean; goTo: (index: number) => void } {
	const reduced = useReducedMotion();
	const wide = useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false,
	);
	const pinned = wide && !reduced && steps > 0;
	const latest = useRef(onStep);
	latest.current = onStep;

	useEffect(() => {
		if (!pinned) return;
		let frame = 0;
		const read = () => {
			frame = 0;
			const track = trackRef.current;
			if (!track) return;
			const box = track.getBoundingClientRect();
			const travel = box.height - window.innerHeight;
			latest.current(stepAt(travel > 0 ? -box.top / travel : 0, steps));
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(read);
		};
		read();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, [pinned, steps, trackRef]);

	const goTo = (index: number) => {
		const track = trackRef.current;
		if (!track) return;
		const top = track.getBoundingClientRect().top + window.scrollY;
		const travel = track.offsetHeight - window.innerHeight;
		window.scrollTo({
			top: top + (travel * (index + 0.5)) / steps,
			behavior: "smooth",
		});
	};

	return { pinned, goTo };
}
