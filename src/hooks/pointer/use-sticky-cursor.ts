import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import {
	isSnapTarget,
	magneticOffset,
	ringTarget,
	stepRing,
	toCursorLabel,
	type RingBox,
} from "@/lib/motion/cursor";
import type { CursorLabel } from "@/types/cursor";

const HOVER_NONE = "(hover: none)";
/** Parked off-screen until the first pointer move. */
const PARKED = -200;

function subscribe(onChange: () => void) {
	const media = window.matchMedia(HOVER_NONE);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

/** False on touch devices (`(hover: none)`), where no custom cursor is mounted. */
export function useHoverCapable(): boolean {
	return !useSyncExternalStore(
		subscribe,
		() => window.matchMedia(HOVER_NONE).matches,
		() => true,
	);
}

/**
 * Sticky cursor engine: ring (36px, grows to 88px for `[data-cursor]`, wraps small
 * links/buttons) plus dot, and the magnetic pull on `[data-magnetic]`.
 * Pointer events only record state; one rAF loop writes width/height/radius/transform
 * (ponytail: size is written as layout props like the prototype; switch to scale if profiling shows cost).
 * Reduced motion: no easing, the ring is positioned directly on the pointer target.
 */
export function useStickyCursor() {
	const enabled = useHoverCapable();
	const reduced = useReducedMotion();
	const ringRef = useRef<HTMLDivElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);
	const [label, setLabel] = useState<CursorLabel | null>(null);

	const pointer = useRef({ x: PARKED, y: PARKED });
	const snapEl = useRef<Element | null>(null);
	const snapRadius = useRef(0);
	const magnetic = useRef<HTMLElement | null>(null);
	const labelled = useRef(false);
	const ring = useRef<RingBox>({
		x: PARKED,
		y: PARKED,
		w: config.shell.cursor.ringPx,
		h: config.shell.cursor.ringPx,
		r: config.shell.cursor.ringPx / 2,
	});

	useEffect(() => {
		if (!enabled) return;
		const c = config.shell.cursor;
		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
			const target = e.target instanceof Element ? e.target : null;

			const mag = target?.closest<HTMLElement>(
				`[${c.magneticAttribute}]`,
			);
			if (magnetic.current && magnetic.current !== mag)
				magnetic.current.style.transform = "";
			if (mag) {
				const o = magneticOffset(
					mag.getBoundingClientRect(),
					e.clientX,
					e.clientY,
					c.magnetic,
				);
				mag.style.transform = `translate3d(${o.x.toFixed(1)}px,${o.y.toFixed(1)}px,0)`;
			}
			magnetic.current = mag ?? null;

			const labelEl = target?.closest(`[${c.labelAttribute}]`);
			const next = toCursorLabel(
				labelEl?.getAttribute(c.labelAttribute) ?? null,
			);
			labelled.current = labelEl !== null && labelEl !== undefined;
			setLabel(next);

			let snap: Element | null = null;
			if (!labelEl) {
				const cand = target?.closest(c.snapSelector);
				if (cand && isSnapTarget(cand.getBoundingClientRect(), c))
					snap = cand;
			}
			if (snap !== snapEl.current) {
				snapEl.current = snap;
				snapRadius.current = snap
					? parseFloat(getComputedStyle(snap).borderTopLeftRadius) ||
						10
					: 0;
			}
		};
		const onLeave = () => {
			if (magnetic.current) magnetic.current.style.transform = "";
			magnetic.current = null;
		};
		document.addEventListener("pointermove", onMove, { passive: true });
		document.documentElement.addEventListener("pointerleave", onLeave);
		return () => {
			document.removeEventListener("pointermove", onMove);
			document.documentElement.removeEventListener(
				"pointerleave",
				onLeave,
			);
			onLeave();
		};
	}, [enabled]);

	useRaf((_dt, _t) => {
		const ringEl = ringRef.current;
		const dotEl = dotRef.current;
		if (!ringEl || !dotEl) return;
		const { x: mx, y: my } = pointer.current;
		const el = snapEl.current;
		if (el && !el.isConnected) snapEl.current = null;
		const target = ringTarget(
			{
				mx,
				my,
				rect: snapEl.current
					? snapEl.current.getBoundingClientRect()
					: null,
				rectRadius: snapRadius.current,
				labelled: labelled.current,
			},
			config.shell.cursor,
		);
		// Released by distance: forget the element so it is not measured every frame.
		if (!target.snapping) snapEl.current = null;
		ring.current = stepRing(
			ring.current,
			target,
			reduced ? 1 : config.shell.cursor.lerp,
		);
		const r = ring.current;
		ringEl.style.width = `${r.w.toFixed(1)}px`;
		ringEl.style.height = `${r.h.toFixed(1)}px`;
		ringEl.style.borderRadius = `${r.r.toFixed(1)}px`;
		ringEl.style.transform = `translate3d(${r.x.toFixed(1)}px,${r.y.toFixed(1)}px,0) translate(-50%,-50%)`;
		dotEl.style.opacity = target.snapping ? "0" : "1";
		dotEl.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
	}, enabled);

	return { enabled, ringRef, dotRef, label };
}
