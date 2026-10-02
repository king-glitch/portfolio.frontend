import { useEffect, useRef, useState, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import { countUpValue, padCount } from "@/lib/motion/reveal";

/**
 * Counts the element's text from 0 to `target` once, 1600ms ease-out quart, starting when it
 * reaches 90% of the viewport. The element must render no children (the hook owns its text).
 * Shows the final value immediately with reduced motion.
 */
export function useCountUp(
	ref: RefObject<HTMLElement | null>,
	target: number,
	pad: number,
): void {
	const reduced = useReducedMotion();
	const [running, setRunning] = useState(false);
	const start = useRef(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		start.current = 0;
		if (reduced) {
			el.textContent = padCount(target, pad);
			return;
		}
		el.textContent = padCount(0, pad);
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				if (!entry.isIntersecting && entry.boundingClientRect.top >= 0)
					return;
				observer.disconnect();
				setRunning(true);
			},
			{
				rootMargin: `0px 0px -${(1 - config.home.hello.countStartViewport) * 100}% 0px`,
			},
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			setRunning(false);
		};
	}, [ref, target, pad, reduced]);

	useRaf((_dt, t) => {
		const el = ref.current;
		if (!el) return;
		if (!start.current) start.current = t;
		const { countUpMs, countUpEasePower } = config.home.hello;
		const elapsed = t - start.current;
		el.textContent = padCount(
			countUpValue(elapsed, countUpMs, target, countUpEasePower),
			pad,
		);
		if (elapsed >= countUpMs) setRunning(false);
	}, running);
}
