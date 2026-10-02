export const lerp = (from: number, to: number, k: number): number =>
	from + (to - from) * k;

export const clamp = (value: number, min: number, max: number): number =>
	Math.min(max, Math.max(min, value));

/** In-out cubic (preloader count). */
export const easeInOutCubic = (t: number): number =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
