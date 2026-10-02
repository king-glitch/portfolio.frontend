import { useEffect, useRef, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useCoarsePointer } from "@/hooks/physics/use-coarse-pointer";
import { useInView } from "@/hooks/physics/use-in-view";
import { useMeasure } from "@/hooks/physics/use-measure";
import { config } from "@/config";
import { letterWeight } from "@/lib/motion/spotlight";

const LETTER = "[data-vw]";

/**
 * Variable-font weight per `[data-vw]` letter: 900 at the cursor falling to 200 at 360px away.
 * Letter centres are cached on mount and resize; per frame only the weight is written, and only
 * after the pointer or scroll moved. Desktop only; stays at the fixed weight otherwise.
 */
export function useLetterWeight(ref: RefObject<HTMLElement | null>): void {
	const reduced = useReducedMotion();
	const coarse = useCoarsePointer();
	const inView = useInView(ref);
	const active = inView && !reduced && !coarse;
	const letters = useRef<
		{ el: HTMLElement; cx: number; cy: number; w: number }[]
	>([]);
	const pointer = useRef({ x: 0, y: 0 });
	const dirty = useRef(false);

	useMeasure(() => {
		const el = ref.current;
		if (!el) return;
		letters.current = Array.from(
			el.querySelectorAll<HTMLElement>(LETTER),
		).map((letter, i) => {
			const r = letter.getBoundingClientRect();
			return {
				el: letter,
				cx: r.left + r.width / 2 + window.scrollX,
				cy: r.top + r.height / 2 + window.scrollY,
				w: letters.current[i]?.w ?? 0,
			};
		});
	});

	useEffect(() => {
		if (!active) return;
		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
			dirty.current = true;
		};
		const onScroll = () => {
			dirty.current = true;
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("scroll", onScroll);
		};
	}, [active]);

	useRaf(() => {
		if (!dirty.current) return;
		dirty.current = false;
		const { letterWeightMax, letterWeightMin, letterRangePx } =
			config.home.contact;
		const { x, y } = pointer.current;
		const sx = window.scrollX;
		const sy = window.scrollY;
		for (const l of letters.current) {
			const d = Math.hypot(x - (l.cx - sx), y - (l.cy - sy));
			const w = letterWeight(
				d,
				letterWeightMax,
				letterWeightMin,
				letterRangePx,
			);
			if (l.w === w) continue;
			l.w = w;
			l.el.style.fontWeight = String(w);
		}
	}, active);
}
