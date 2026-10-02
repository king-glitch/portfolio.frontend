import type { config } from "@/config";
import type { ScrollerState } from "@/types/work";

export type ScrollerConfig = typeof config.work.scroller;

export const initialScroller = (): ScrollerState => ({
	target: 0,
	current: 0,
	lastInput: 0,
});

/** Wheel input in px: the larger axis wins, line/page delta modes are scaled (Main 738). */
export function wheelDelta(
	e: { deltaX: number; deltaY: number; deltaMode: number },
	innerHeight: number,
	linePx: number,
): number {
	const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
	if (e.deltaMode === 1) return d * linePx;
	if (e.deltaMode === 2) return d * innerHeight;
	return d;
}

/** The last panel is fully in view and the track has settled there. */
export const isAtEnd = (
	s: ScrollerState,
	max: number,
	cfg: ScrollerConfig,
): boolean =>
	s.target >= max - cfg.endEpsilonPx && s.current >= max - cfg.endCurrentPx;

/** Move the target by one input delta (wheel or key), clamped to `0..max`. */
export function feedTrack(
	s: ScrollerState,
	d: number,
	max: number,
	now: number,
): ScrollerState {
	return {
		...s,
		target: Math.min(max, Math.max(0, s.target + d)),
		lastInput: now,
	};
}

/**
 * After input stops, a last panel that is at least `snapShare` in view snaps fully in,
 * so the next-project push only starts from a clean, fully visible panel.
 */
export function snapTarget(
	s: ScrollerState,
	max: number,
	lastWidth: number,
	now: number,
	cfg: ScrollerConfig,
): number {
	const idle = now - s.lastInput > cfg.snapIdleMs;
	const near = max - s.target < lastWidth * cfg.snapShare;
	return idle && near ? max : s.target;
}

/** One frame: `current` eases to `target` (or jumps when `instant`). */
export function stepScroller(
	s: ScrollerState,
	cfg: ScrollerConfig,
	instant: boolean,
): ScrollerState {
	let current = instant
		? s.target
		: s.current + (s.target - s.current) * cfg.lerp;
	if (Math.abs(s.target - current) < cfg.settleEpsilonPx) current = s.target;
	return { ...s, current };
}

/** Parallax shift of a `data-speed` layer: faster than 1 drifts ahead, slower lags. */
export const parallaxOffset = (
	panelLeft: number,
	x: number,
	speed: number,
	cfg: ScrollerConfig,
): number => (panelLeft - x) * (1 - speed) * cfg.parallaxFactor;

export const progressRatio = (x: number, max: number): number =>
	max > 0 ? Math.min(1, Math.max(0, x / max)) : 0;

/** Cubic ease-in-out, 0..1 -> 0..1 (the next-project push). */
export function easeInOut(t: number): number {
	const c = Math.min(1, Math.max(0, t));
	return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}
