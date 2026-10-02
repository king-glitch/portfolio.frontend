import { useEffect, useRef, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useInView } from "@/hooks/physics/use-in-view";
import { MASCOT_DEFAULTS, MASCOT_FACES } from "@/lib/mascot/designs";
import { createMascotEngine, type MascotEngine } from "@/lib/mascot/engine";
import type { MascotDesign, MascotOptions } from "@/types/ui";

/**
 * Drives one mascot: builds the engine on `headRef`, feeds it the pointer (window-wide, like the
 * prototype; any click pokes it) and steps it in rAF only while on screen.
 * Returns the engine ref so callers can poke it or move its gaze zone.
 */
export function useMascot(
	rootRef: RefObject<HTMLElement | null>,
	headRef: RefObject<HTMLElement | null>,
	design: MascotDesign,
	options: Partial<MascotOptions> = {},
): RefObject<MascotEngine | null> {
	const engine = useRef<MascotEngine | null>(null);
	const reduced = useReducedMotion();
	const inView = useInView(rootRef, "100px");
	const latest = useRef(options);
	useEffect(() => {
		latest.current = options;
	});

	useEffect(() => {
		const root = rootRef.current;
		const head = headRef.current;
		if (!root || !head) return;
		const e = createMascotEngine(
			root,
			head,
			MASCOT_FACES[design],
			{ ...MASCOT_DEFAULTS, ...latest.current },
			reduced,
		);
		engine.current = e;
		e.step(performance.now());
		const onMove = (ev: PointerEvent) =>
			e.pointer(ev.clientX, ev.clientY, performance.now());
		const onDown = () => e.poke();
		const onLeave = () => e.release(performance.now());
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("pointerdown", onDown, { passive: true });
		document.documentElement.addEventListener("mouseleave", onLeave);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerdown", onDown);
			document.documentElement.removeEventListener("mouseleave", onLeave);
			engine.current = null;
		};
	}, [rootRef, headRef, design, reduced]);

	useRaf((_dt, now) => engine.current?.step(now), inView);
	return engine;
}
