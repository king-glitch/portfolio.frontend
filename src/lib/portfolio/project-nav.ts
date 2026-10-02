/** Next id in the looping list; undefined for an unknown id. */
export function nextId(ids: string[], id: string): string | undefined {
	const i = ids.indexOf(id);
	return i < 0 ? undefined : ids[(i + 1) % ids.length];
}

/** Previous id in the looping list; undefined for an unknown id. */
export function prevId(ids: string[], id: string): string | undefined {
	const i = ids.indexOf(id);
	return i < 0 ? undefined : ids[(i - 1 + ids.length) % ids.length];
}

/** Counter reels for a 1-based position: 6 -> { tens: 0, units: 6 }. */
export function counterDigits(position: number): {
	tens: number;
	units: number;
} {
	return { tens: Math.floor(position / 10) % 10, units: position % 10 };
}

/** Total shown as two digits: 6 -> "06". */
export const padCount = (n: number): string => String(n).padStart(2, "0");
