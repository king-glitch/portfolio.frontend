/** "YYYY-MM" -> numeric year and 1-based month. */
export function parseYearMonth(value: string): { year: number; month: number } {
	const [year = "0", month = "1"] = value.split("-");
	return { year: Number(year), month: Number(month) };
}

/** Fractional year of a "YYYY-MM" (Jan = .0), as the prototype timeline ruler does. */
export function toFractionalYear(value: string): number {
	const { year, month } = parseYearMonth(value);
	return year + (month - 1) / 12;
}

/** Whole calendar years from `start` to `now`, never negative (prototype "years in production"). */
export function yearsSince(start: string, now: Date = new Date()): number {
	return Math.max(0, now.getFullYear() - parseYearMonth(start).year);
}
