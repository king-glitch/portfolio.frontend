import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import {
	magneticOffset,
	rectCenter,
	ringStretch,
	ringTarget,
	stepRing,
	toCursorLabel,
	type RingBox,
} from "@/lib/motion/cursor";
import { CursorMode, type CursorLabel } from "@/types/cursor";

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

interface CursorState {
	mode: CursorMode;
	label: CursorLabel | null;
	visible: boolean;
}

const IDLE: CursorState = {
	mode: CursorMode.Idle,
	label: null,
	visible: false,
};

const same = (a: CursorState, b: CursorState) =>
	a.mode === b.mode && a.label === b.label && a.visible === b.visible;

/** Mode from what is under the pointer: text field, labelled element, link/button, or nothing. */
function classify(target: Element | null): Omit<CursorState, "visible"> {
	const c = config.shell.cursor;
	if (target?.closest(c.textSelector))
		return { mode: CursorMode.Text, label: null };
	const label = toCursorLabel(
		target
			?.closest(`[${c.labelAttribute}]`)
			?.getAttribute(c.labelAttribute) ?? null,
	);
	if (label) return { mode: CursorMode.Label, label };
	if (target?.closest(`${c.hoverSelector}, [${c.magneticAttribute}]`))
		return { mode: CursorMode.Hover, label: null };
	return { mode: CursorMode.Idle, label: null };
}

/**
 * Cursor engine. The ring is always a circle (or an I-beam over text fields): it fills and grows
 * over links/buttons instead of outlining their box, is pulled toward `[data-magnetic]` centres
 * (which also lean toward the pointer), stretches along its own velocity and shrinks on press.
 * Pointer events only record state; one rAF loop writes size and transform.
 * Reduced motion: no easing, no stretch.
 */
export function useStickyCursor() {
	const enabled = useHoverCapable();
	const reduced = useReducedMotion();
	const ringRef = useRef<HTMLDivElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);
	const [state, setState] = useState<CursorState>(IDLE);

	const pointer = useRef({ x: PARKED, y: PARKED });
	const magnetic = useRef<HTMLElement | null>(null);
	const mode = useRef(CursorMode.Idle);
	const pressed = useRef(false);
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
		const update = (next: CursorState) =>
			setState((prev) => (same(prev, next) ? prev : next));
		const release = () => {
			if (magnetic.current) magnetic.current.style.transform = "";
			magnetic.current = null;
		};
		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
			const target = e.target instanceof Element ? e.target : null;

			const mag =
				target?.closest<HTMLElement>(`[${c.magneticAttribute}]`) ??
				null;
			if (magnetic.current !== mag) release();
			if (mag) {
				const o = magneticOffset(
					mag.getBoundingClientRect(),
					e.clientX,
					e.clientY,
					c.magnetic,
				);
				mag.style.transform = `translate3d(${o.x.toFixed(1)}px,${o.y.toFixed(1)}px,0)`;
			}
			magnetic.current = mag;

			const next = classify(target);
			mode.current = next.mode;
			update({ ...next, visible: true });
		};
		const onLeave = () => {
			release();
			update({ ...IDLE, visible: false });
		};
		const onDown = () => {
			pressed.current = true;
		};
		const onUp = () => {
			pressed.current = false;
		};
		document.addEventListener("pointermove", onMove, { passive: true });
		document.addEventListener("pointerdown", onDown, { passive: true });
		document.addEventListener("pointerup", onUp, { passive: true });
		document.documentElement.addEventListener("pointerleave", onLeave);
		return () => {
			document.removeEventListener("pointermove", onMove);
			document.removeEventListener("pointerdown", onDown);
			document.removeEventListener("pointerup", onUp);
			document.documentElement.removeEventListener(
				"pointerleave",
				onLeave,
			);
			release();
		};
	}, [enabled]);

	useRaf(() => {
		const ringEl = ringRef.current;
		const dotEl = dotRef.current;
		if (!ringEl || !dotEl) return;
		const c = config.shell.cursor;
		const mag = magnetic.current;
		const magnet = mag?.isConnected
			? rectCenter(mag.getBoundingClientRect())
			: null;
		const target = ringTarget(pointer.current, magnet, mode.current, c);
		const prev = ring.current;
		const k = reduced ? 1 : c.lerp;
		ring.current = stepRing(prev, target, k, reduced ? 1 : c.sizeLerp);
		const r = ring.current;
		const idle = mode.current === CursorMode.Idle;
		const stretch =
			idle && !reduced
				? ringStretch(r.x - prev.x, r.y - prev.y, c)
				: { angleDeg: 0, sx: 1, sy: 1 };
		const press = pressed.current ? c.pressScale : 1;
		ringEl.style.width = `${r.w.toFixed(1)}px`;
		ringEl.style.height = `${r.h.toFixed(1)}px`;
		ringEl.style.borderRadius = `${r.r.toFixed(1)}px`;
		ringEl.style.transform = `translate3d(${r.x.toFixed(1)}px,${r.y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${stretch.angleDeg.toFixed(1)}deg) scale(${(stretch.sx * press).toFixed(3)},${(stretch.sy * press).toFixed(3)})`;
		dotEl.style.transform = `translate3d(${pointer.current.x}px,${pointer.current.y}px,0) translate(-50%,-50%)`;
	}, enabled);

	return { enabled, ringRef, dotRef, ...state };
}
