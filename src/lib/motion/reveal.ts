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

export function padCount(value: number, pad: number): string {
	return String(value).padStart(pad, "0");
}
