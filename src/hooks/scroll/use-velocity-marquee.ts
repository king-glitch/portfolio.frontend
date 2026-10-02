import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useRaf } from "@/hooks/motion/use-raf";
import { useInView } from "@/hooks/physics/use-in-view";
import { useMeasure } from "@/hooks/physics/use-measure";
import { config } from "@/config";
import { stepMarquee } from "@/lib/motion/marquee";

/**
 * Drives a doubled marquee strip: drifts at a base speed, speeds up with scroll velocity,
 * reverses on scroll-up and skews with velocity. Writes `transform` only. Static with reduced motion.
 */
export function useVelocityMarquee(ref: RefObject<HTMLElement | null>): void {
	const reduced = useReducedMotion();
	const inView = useInView(ref);
	const active = inView && !reduced;
	const state = useRef({ velocity: 0, offset: 0 });
	const lastY = useRef(0);
	const half = useRef(1);

	useMeasure(() => {
		half.current = (ref.current?.scrollWidth ?? 2) / 2;
	}, true, [ref]);

	useEffect(() => {
		if (active) lastY.current = window.scrollY;
	}, [active]);

	useEffect(() => {
		const el = ref.current;
		if (reduced && el) el.style.transform = "";
	}, [ref, reduced]);

	useRaf(() => {
		const el = ref.current;
		if (!el) return;
		const y = window.scrollY;
		const next = stepMarquee(state.current, y - lastY.current, half.current, config.home.marquee);
		lastY.current = y;
		state.current = { velocity: next.velocity, offset: next.offset };
		el.style.transform = `translate3d(${next.offset.toFixed(1)}px,0,0) skewX(${next.skewDeg.toFixed(2)}deg)`;
	}, active);
}
