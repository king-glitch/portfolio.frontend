import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import { scrambleFrame } from "@/lib/motion/scramble";

/**
 * Scrambles the element's text once when it scrolls into view and on every
 * pointer enter, then restores the exact original. No-op with reduced motion.
 * Keep the accessible name outside the element (see SectionLabel: aria-hidden + sr-only copy).
 */
export function useScramble(ref: RefObject<HTMLElement | null>): void {
	const reduced = useReducedMotion();

	useEffect(() => {
		const el = ref.current;
		if (!el || reduced) return;
		const { chars, frames, intervalMs, cooldownMs } = config.shell.scramble;
		let running = false;
		let interval = 0;
		let cooldown = 0;
		let original = "";

		const run = () => {
			if (running) return;
			running = true;
			original = el.textContent ?? "";
			let frame = 0;
			interval = window.setInterval(() => {
				frame++;
				el.textContent = scrambleFrame(
					original,
					frame,
					frames,
					chars,
					Math.random,
				);
				if (frame < frames) return;
				window.clearInterval(interval);
				el.textContent = original;
				cooldown = window.setTimeout(() => {
					running = false;
				}, cooldownMs);
			}, intervalMs);
		};

		const observer = new IntersectionObserver(([entry]) => {
			if (!entry?.isIntersecting) return;
			observer.disconnect();
			run();
		});
		observer.observe(el);
		el.addEventListener("pointerenter", run);
		return () => {
			observer.disconnect();
			el.removeEventListener("pointerenter", run);
			window.clearInterval(interval);
			window.clearTimeout(cooldown);
			if (running) el.textContent = original;
		};
	}, [ref, reduced]);
}
