import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { isApiError } from "@/api/errors";
import { config } from "@/config";

/** "a, b ,,c" -> ["a", "b", "c"] */
export const splitList = (text: string): string[] =>
	text
		.split(config.dashboard.listSeparator)
		.map((item) => item.trim())
		.filter(Boolean);

export const joinList = (items: string[]): string =>
	items.join(`${config.dashboard.listSeparator} `);

/**
 * Puts the backend's per-field `violations` of a rejected request on the matching form fields
 * (`known` = the form's field names). Returns true when at least one field took a message.
 */
export function applyViolations<T extends FieldValues>(
	error: unknown,
	setError: UseFormSetError<T>,
	known: Path<T>[],
): boolean {
	if (!isApiError(error)) return false;
	let applied = false;
	for (const [field, violation] of Object.entries(error.violations)) {
		const match = known.find((name) => name === field);
		if (!match) continue;
		setError(match, { message: violation.message });
		applied = true;
	}
	return applied;
}

/** `<input type="datetime-local">` value (local time, no zone) of an ISO instant; "" for none. */
export function toLocalInput(iso: string | null): string {
	const date = iso ? new Date(iso) : null;
	if (!date || Number.isNaN(date.getTime())) return "";
	const offsetMs = date.getTimezoneOffset() * 60_000;
	return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

/** ISO instant of a `datetime-local` value; null for empty or unreadable. */
export function fromLocalInput(value: string): string | null {
	const date = value ? new Date(value) : null;
	return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
}
