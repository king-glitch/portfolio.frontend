import type { config } from "@/config";
import type { ScrollerState } from "@/types/work";

export type ScrollerConfig = typeof config.work.scroller;

export const initialScroller = (): ScrollerState => ({
	target: 0,
	current: 0,
	pull: 0,
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

/**
 * Feed one input delta (wheel or key) into the scroller (Main feed(), 874).
 * Past the end positive deltas build `pull` with falling resistance; `navigate` is true once it reaches the threshold.
 */
export function feedScroll(
	s: ScrollerState,
	d: number,
	max: number,
	now: number,
	cfg: ScrollerConfig,
): { state: ScrollerState; navigate: boolean } {
	const th = cfg.resistancePx;
	const atEnd =
		s.target >= max - cfg.endEpsilonPx &&
		s.current >= max - cfg.endCurrentPx;
	if (d > 0 && atEnd) {
		const gain = Math.max(
			cfg.resistanceMinFactor,
			cfg.resistanceBase * (1 - (cfg.resistanceSlope * s.pull) / th),
		);
		const pull = Math.min(th, s.pull + d * gain);
		return {
			state: { ...s, pull, lastInput: now },
			navigate: pull >= th,
		};
	}
	if (d < 0 && s.pull > 0) {
		return {
			state: { ...s, pull: Math.max(0, s.pull + d), lastInput: now },
			navigate: false,
		};
	}
	const target = Math.min(max, Math.max(0, s.target + d));
	return { state: { ...s, target, lastInput: now }, navigate: false };
}

/** One frame: pull decays after idle, `current` eases to `target` (or jumps when `instant`). */
export function stepScroller(
	s: ScrollerState,
	now: number,
	cfg: ScrollerConfig,
	instant: boolean,
): ScrollerState {
	let pull = s.pull;
	if (pull > 0 && now - s.lastInput > cfg.pullIdleMs) {
		pull *= cfg.pullDecay;
		if (pull < cfg.pullZeroBelowPx) pull = 0;
	}
	let current = instant
		? s.target
		: s.current + (s.target - s.current) * cfg.lerp;
	if (Math.abs(s.target - current) < cfg.settleEpsilonPx) current = s.target;
	return { ...s, pull, current };
}

/** Track offset: eased position plus a share of the pull. */
export const scrollX = (s: ScrollerState, cfg: ScrollerConfig): number =>
	s.current + s.pull * cfg.pullLerp;

/** Parallax shift of a `data-speed` layer: faster than 1 drifts ahead, slower lags. */
export const parallaxOffset = (
	panelLeft: number,
	x: number,
	speed: number,
	cfg: ScrollerConfig,
): number => (panelLeft - x) * (1 - speed) * cfg.parallaxFactor;

/** 0..1 resistance progress (meter and next-title fill). */
export const pullRatio = (pull: number, cfg: ScrollerConfig): number =>
	Math.min(1, pull / cfg.resistancePx);

export const progressRatio = (x: number, max: number): number =>
	max > 0 ? Math.min(1, Math.max(0, x / max)) : 0;
