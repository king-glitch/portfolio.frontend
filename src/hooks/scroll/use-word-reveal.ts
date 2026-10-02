import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useMeasure } from "@/hooks/physics/use-measure";
import { config } from "@/config";
import { wordOpacity, wordRevealProgress } from "@/lib/motion/reveal";

const WORD = "[data-rw]";

/**
 * Fades `[data-rw]` words inside the container from 0.16 to 1 as it scrolls up the viewport.
 * Cached top, scroll listener, opacity writes only. All words fully visible with reduced motion.
 * `ready` flips true once the words are in the DOM.
 */
export function useWordReveal(
	containerRef: RefObject<HTMLElement | null>,
	ready: boolean,
): void {
	const reduced = useReducedMotion();
	const docTop = useRef(0);
	const words = useRef<HTMLElement[]>([]);
	const last = useRef<number[]>([]);

	const apply = () => {
		const list = words.current;
		const vh = window.innerHeight;
		const progress = wordRevealProgress(
			docTop.current - window.scrollY,
			vh,
			config.home.hello.wordReveal,
		);
		for (let i = 0; i < list.length; i++) {
			const o = wordOpacity(
				progress,
				i,
				list.length,
				config.home.hello.wordReveal,
			);
			const prev = last.current[i];
			if (prev !== undefined && Math.abs(prev - o) <= 0.01) continue;
			last.current[i] = o;
			const el = list[i];
			if (el) el.style.opacity = o.toFixed(3);
		}
	};

	useEffect(() => {
		const el = containerRef.current;
		if (!el || !ready) return;
		words.current = Array.from(el.querySelectorAll<HTMLElement>(WORD));
		last.current = [];
		if (reduced) {
			for (const w of words.current) w.style.opacity = "1";
			return;
		}
		window.addEventListener("scroll", apply, { passive: true });
		return () => window.removeEventListener("scroll", apply);
	}, [containerRef, ready, reduced]);

	useMeasure(() => {
		const el = containerRef.current;
		if (!el) return;
		docTop.current = el.getBoundingClientRect().top + window.scrollY;
		apply();
	}, ready && !reduced);
}
