import { useEffect, useRef, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { config } from "@/config";
import { lerp } from "@/lib/motion/reveal";
import { followRotation } from "@/lib/motion/spotlight";

/**
 * Makes a fixed-position element trail the cursor (lerp 0.14) with a lag-based tilt (<= 8deg).
 * Runs only while `active`; restarts from the cursor so it never sweeps in from a stale spot.
 * Writes `transform` only.
 */
export function usePointerFollow(
	ref: RefObject<HTMLElement | null>,
	active: boolean,
): void {
	const pointer = useRef({ x: 0, y: 0 });
	const pos = useRef({ x: 0, y: 0 });

	useEffect(() => {
		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		return () => window.removeEventListener("pointermove", onMove);
	}, []);

	useEffect(() => {
		if (active) pos.current = { ...pointer.current };
	}, [active]);

	useRaf(() => {
		const el = ref.current;
		if (!el) return;
		const { lerp: k, offsetXPx, offsetYPx, rotateFactor, rotateMaxDeg } = config.shell.indexPreview;
		const p = pointer.current;
		const x = lerp(pos.current.x, p.x, k);
		const y = lerp(pos.current.y, p.y, k);
		pos.current = { x, y };
		const rot = followRotation(p.x, x, rotateFactor, rotateMaxDeg);
		el.style.transform = `translate3d(${(x + offsetXPx).toFixed(1)}px,${(y + offsetYPx).toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg)`;
	}, active);
}
