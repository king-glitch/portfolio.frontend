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

const LINE_BREAK = "\n";

/** One entry per line; blank lines dropped. For text that may itself contain commas (sentences). */
export const splitLines = (text: string): string[] =>
	text
		.split(LINE_BREAK)
		.map((line) => line.trim())
		.filter(Boolean);

export const joinLines = (items: string[]): string => items.join(LINE_BREAK);

/** Rows of a list editor ready to save: trimmed, blanks dropped. */
export const cleanList = (items: string[]): string[] =>
	items.map((item) => item.trim()).filter(Boolean);

/** `project_id` -> `projectId`; dotted paths are converted per segment (`contact.github_url` -> `contact.githubUrl`). */
export const toCamelPath = (path: string): string =>
	path.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());

const BLOCK_PATH = /^blocks\.(\d+)(?:\.|$)/;

/**
 * Puts the backend's per-field `violations` of a rejected request on the matching form fields
 * (`known` = the form's field names). Backend keys are snake_case (`project_id`) and the form's
 * are camelCase, so both spellings match. A `blocks.<n>.…` key goes to `onBlock(n, message)` so the
 * block editor can show it on card `n`. Returns true when at least one field or block took a message.
 */
export function applyViolations<T extends FieldValues>(
	error: unknown,
	setError: UseFormSetError<T>,
	known: Path<T>[],
	onBlock?: (index: number, message: string) => void,
): boolean {
	if (!isApiError(error)) return false;
	let applied = false;
	for (const [field, violation] of Object.entries(error.violations)) {
		const block = BLOCK_PATH.exec(field);
		if (block?.[1] !== undefined && onBlock) {
			onBlock(Number(block[1]), violation.message);
			applied = true;
			continue;
		}
		const camel = toCamelPath(field);
		const match = known.find((name) => name === field || name === camel);
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
