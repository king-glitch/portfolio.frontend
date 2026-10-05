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

/**
 * Parallax shift of a `data-speed` layer: zero when its frame is centred in the viewport, faster
 * than 1 drifts ahead, slower lags, never more than `limit` px either way (it stays inside its frame).
 */
export const parallaxOffset = (
	center: number,
	viewCenter: number,
	speed: number,
	limit: number,
	cfg: ScrollerConfig,
): number =>
	Math.max(
		-limit,
		Math.min(
			limit,
			(center - viewCenter) * (1 - speed) * cfg.parallaxFactor,
		),
	);

export const progressRatio = (x: number, max: number): number =>
	max > 0 ? Math.min(1, Math.max(0, x / max)) : 0;

/** Cubic ease-in-out, 0..1 -> 0..1 (the next-project push). */
export function easeInOut(t: number): number {
	const c = Math.min(1, Math.max(0, t));
	return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** Add positive input to the pull past the end, with resistance that grows as the pull grows. */
export function feedPull(pull: number, d: number, cfg: ScrollerConfig): number {
	const th = cfg.pullThresholdPx;
	const gain = Math.max(
		cfg.pullMinGain,
		cfg.pullBaseGain * (1 - (cfg.pullSlope * pull) / th),
	);
	return Math.min(th, Math.max(0, pull + (d > 0 ? d * gain : d)));
}

/** Pull after one idle frame: drains once input stops, snaps to 0 near the bottom. */
export function decayPull(
	pull: number,
	idleMs: number,
	cfg: ScrollerConfig,
): number {
	if (pull === 0 || idleMs < cfg.pullIdleMs) return pull;
	const next = pull * cfg.pullDecay;
	return next < cfg.pullZeroBelowPx ? 0 : next;
}
