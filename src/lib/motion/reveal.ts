/** Pure scroll-reveal and count-up maths (design/Main.dc.html tick(), lines 1139-1160). No DOM. */

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number): number {
	return clamp(value, 0, 1);
}

export function lerp(current: number, target: number, k: number): number {
	return current + (target - current) * k;
}

/** `1 - (1 - t)^power`, ease-out. Prototype uses power 4 (quart) for the count-up. */
export function easeOut(t: number, power: number): number {
	return 1 - Math.pow(1 - clamp01(t), power);
}

export interface WordRevealConfig {
	startViewport: number;
	spanViewport: number;
	minOpacity: number;
	overshoot: number;
}

/** Section progress 0..1 given its viewport-relative `top`. */
export function wordRevealProgress(
	top: number,
	viewportHeight: number,
	cfg: Pick<WordRevealConfig, "startViewport" | "spanViewport">,
): number {
	return clamp01(
		(viewportHeight * cfg.startViewport - top) /
			(viewportHeight * cfg.spanViewport),
	);
}

/** Opacity of word `index` of `count`: ramps `minOpacity` -> 1 progressively, word by word. */
export function wordOpacity(
	progress: number,
	index: number,
	count: number,
	cfg: Pick<WordRevealConfig, "minOpacity" | "overshoot">,
): number {
	const own = clamp01(progress * count * cfg.overshoot - index);
	return cfg.minOpacity + (1 - cfg.minOpacity) * own;
}

/** Counter value after `elapsedMs`, rounded; reaches `target` exactly at `durationMs`. */
export function countUpValue(
	elapsedMs: number,
	durationMs: number,
	target: number,
	power: number,
): number {
	return Math.round(target * easeOut(elapsedMs / durationMs, power));
}

export function padCount(value: number, pad: number): string {
	return String(value).padStart(pad, "0");
}
