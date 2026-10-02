import { useEffect, useRef, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useCoarsePointer } from "@/hooks/physics/use-coarse-pointer";
import { useInView } from "@/hooks/physics/use-in-view";
import { useMeasure } from "@/hooks/physics/use-measure";
import { config } from "@/config";
import { spotlightGoal, stepSpotlight } from "@/lib/motion/spotlight";

function circle(radius: number, x: number, y: number): string {
	return `circle(${radius.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
}

/**
 * Reveals the layer through a circle that follows the cursor inside the section
 * (radius <= min(240, 22% width), lerp 0.12 / 0.2). `revealed` (tap / Enter) opens it fully.
 * Touch: no pointer circle, toggle only. Reduced motion: no loop, toggle only. Writes `clip-path` only.
 */
export function useSpotlight(
	sectionRef: RefObject<HTMLElement | null>,
	layerRef: RefObject<HTMLElement | null>,
	revealed: boolean,
): void {
	const reduced = useReducedMotion();
	const coarse = useCoarsePointer();
	const inView = useInView(sectionRef);
	const box = useRef({ left: 0, docTop: 0, width: 0, height: 0 });
	const pointer = useRef({ x: -1, y: -1 });
	const state = useRef({ radius: 0, x: 0, y: 0 });
	const tracking = !coarse && !reduced;

	useMeasure(() => {
		const el = sectionRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		box.current = { left: r.left, docTop: r.top + window.scrollY, width: r.width, height: r.height };
	});

	useEffect(() => {
		if (!tracking) return;
		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		return () => window.removeEventListener("pointermove", onMove);
	}, [tracking]);

	// Reduced motion: jump straight to the toggled state.
	useEffect(() => {
		const layer = layerRef.current;
		if (!layer || !reduced) return;
		const { width, height } = box.current;
		layer.style.clipPath = revealed
			? circle(Math.hypot(width, height), width / 2, height / 2)
			: circle(0, width / 2, height / 2);
	}, [layerRef, reduced, revealed]);

	useRaf(() => {
		const layer = layerRef.current;
		if (!layer) return;
		const { left, docTop, width, height } = box.current;
		const top = docTop - window.scrollY;
		const px = pointer.current.x - left;
		const py = pointer.current.y - top;
		const inside = tracking && px >= 0 && px <= width && py >= 0 && py <= height;
		const goal = spotlightGoal(width, height, revealed, inside, config.home.spotlight);
		const targetX = revealed ? width / 2 : px;
		const targetY = revealed ? height / 2 : py;
		const s = state.current;
		const next = stepSpotlight(s, goal, targetX, targetY, config.home.spotlight);
		const settled =
			Math.abs(next.radius - s.radius) < 0.05 &&
			Math.abs(next.x - s.x) < 0.05 &&
			Math.abs(next.y - s.y) < 0.05;
		if (settled && Math.abs(goal - s.radius) < 0.05) return;
		state.current = next;
		layer.style.clipPath = circle(next.radius, next.x, next.y);
	}, inView && !reduced);
}
