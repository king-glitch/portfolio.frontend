import { clamp01, lerp } from "@/lib/motion/reveal";

/** Pointer-follow maths: spotlight circle, fan tilt, contact letter weight. No DOM. */

export interface SpotlightConfig {
	maxRadiusPx: number;
	widthRatio: number;
	radiusLerp: number;
	centerLerp: number;
}

/** Target radius: full cover when toggled, `min(max, 22% width)` while the pointer is inside, else 0. */
export function spotlightGoal(
	width: number,
	height: number,
	toggled: boolean,
	pointerInside: boolean,
	cfg: Pick<SpotlightConfig, "maxRadiusPx" | "widthRatio">,
): number {
	if (toggled) return Math.hypot(width, height);
	return pointerInside
		? Math.min(cfg.maxRadiusPx, width * cfg.widthRatio)
		: 0;
}

export interface SpotlightState {
	radius: number;
	x: number;
	y: number;
}

export function stepSpotlight(
	state: SpotlightState,
	goalRadius: number,
	pointerX: number,
	pointerY: number,
	cfg: Pick<SpotlightConfig, "radiusLerp" | "centerLerp">,
): SpotlightState {
	return {
		radius: lerp(state.radius, goalRadius, cfg.radiusLerp),
		x: lerp(state.x, pointerX, cfg.centerLerp),
		y: lerp(state.y, pointerY, cfg.centerLerp),
	};
}

/** Pointer position as -0.5..0.5 of the viewport. */
export function pointerOffset(pointer: number, viewport: number): number {
	return pointer / viewport - 0.5;
}

/** Contact letter weight: `max` at the pointer, `min` at `rangePx` or further. */
export function letterWeight(
	distance: number,
	max: number,
	min: number,
	rangePx: number,
): number {
	return Math.round(max - clamp01(distance / rangePx) * (max - min));
}

/** Rotation (deg) of a trailing element: proportional to how far it lags the pointer, capped. */
export function followRotation(
	pointerX: number,
	x: number,
	factor: number,
	maxDeg: number,
): number {
	return Math.max(-maxDeg, Math.min(maxDeg, (pointerX - x) * factor));
}
