import { useEffect, useRef, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useCoarsePointer } from "@/hooks/physics/use-coarse-pointer";
import { useInView } from "@/hooks/physics/use-in-view";
import { config } from "@/config";
import { lerp } from "@/lib/motion/reveal";
import { pointerOffset } from "@/lib/motion/spotlight";

const EPSILON = 0.0005;

/**
 * Tilts the hero card deck toward the cursor: `rotateY(tiltX*10) rotateX(-tiltY*6)`, lerp 0.06.
 * Desktop only (viewport >= 760px, not touch, no reduced motion). Writes `transform` only.
 */
export function useFanTilt(ref: RefObject<HTMLElement | null>): void {
	const reduced = useReducedMotion();
	const coarse = useCoarsePointer();
	const inView = useInView(ref);
	const pointer = useRef({ x: 0, y: 0 });
	const tilt = useRef({ x: 0, y: 0 });
	const active = inView && !reduced && !coarse;

	useEffect(() => {
		if (!active) return;
		const onMove = (e: PointerEvent) => {
			pointer.current = {
				x: pointerOffset(e.clientX, window.innerWidth),
				y: pointerOffset(e.clientY, window.innerHeight),
			};
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		return () => window.removeEventListener("pointermove", onMove);
	}, [active]);

	useEffect(() => {
		const el = ref.current;
		if (el && !active) el.style.transform = "";
	}, [ref, active]);

	useRaf(() => {
		const el = ref.current;
		if (!el || window.innerWidth < config.home.hero.fanMinViewportPx)
			return;
		const { fanTiltLerp, fanTiltYMultiplier, fanTiltXMultiplier } =
			config.home.hero;
		const t = tilt.current;
		const nx = lerp(t.x, pointer.current.x, fanTiltLerp);
		const ny = lerp(t.y, pointer.current.y, fanTiltLerp);
		if (Math.abs(nx - t.x) < EPSILON && Math.abs(ny - t.y) < EPSILON)
			return;
		tilt.current = { x: nx, y: ny };
		el.style.transform = `rotateY(${(nx * fanTiltYMultiplier).toFixed(2)}deg) rotateX(${(-ny * fanTiltXMultiplier).toFixed(2)}deg)`;
	}, active);
}
