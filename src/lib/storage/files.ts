import { z } from "zod";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { config } from "@/config";
import type { FileValueKey } from "@/types/ui";

const BYTES_PER_UNIT = 1024;
const UNITS = ["B", "KB", "MB", "GB"];

/** 1536 -> "1.5 KB". */
export function formatBytes(bytes: number): string {
	let value = bytes;
	let unit = 0;
	while (value >= BYTES_PER_UNIT && unit < UNITS.length - 1) {
		value /= BYTES_PER_UNIT;
		unit += 1;
	}
	return `${Number.isInteger(value) ? value : value.toFixed(1)} ${UNITS[unit]}`;
}

const kinds = Object.values(FileKind);

/** Kind whose allowlist contains `mime`; undefined for a type the backend would refuse. */
export const kindOfMime = (mime: string): FileKind | undefined =>
	kinds.find((kind) =>
		config.dashboard.fileAccept[kind].split(",").includes(mime),
	);

/** `<input accept>` value for the given kinds (all kinds when empty). */
export const acceptOf = (accept: FileKind[]): string =>
	(accept.length ? accept : kinds)
		.map((kind) => config.dashboard.fileAccept[kind])
		.join(",");

export enum FileProblem {
	Type = "type",
	Size = "size",
}

/** Client-side pre-check of an upload: wrong type for the field, or over the kind's size limit. */
export function checkFile(file: File, accept: FileKind[]): FileProblem | null {
	const kind = kindOfMime(file.type);
	if (!kind || (accept.length > 0 && !accept.includes(kind)))
		return FileProblem.Type;
	return file.size > config.dashboard.fileMaxBytes[kind]
		? FileProblem.Size
		: null;
}

/** Stand-in for a stored value the library does not know (a URL saved before the library existed). */
export const externalFile = (url: string, kind: FileKind): AdminFile => ({
	id: "",
	kind,
	mime: "",
	size: 0,
	width: 0,
	height: 0,
	name: url,
	alt: "",
	url,
	createdAt: "",
});

export const isExternal = (file: AdminFile): boolean => file.id === "";

export const sameFile = (a: AdminFile, b: AdminFile): boolean =>
	a.id === b.id && a.url === b.url;

/** The file a field's `value` (id or URL, per `by`) points to: a known one, else an external stand-in; null for no value. */
export function resolveFile(
	value: string,
	by: FileValueKey,
	known: (AdminFile | undefined)[],
	fallbackKind: FileKind,
): AdminFile | null {
	if (!value) return null;
	return (
		known.find((file) => file?.[by] === value) ??
		externalFile(value, fallbackKind)
	);
}

const fileParamsSchema = z.object({
	kind: z.enum(FileKind).or(z.undefined()).catch(undefined),
	q: z.string().catch(""),
});

/** Kind filter and search text of the files page from its URL; anything unreadable means "all" / empty. */
export function parseFileParams(search: URLSearchParams): {
	kind: FileKind | undefined;
	q: string;
} {
	const names = config.dashboard.fileSearchParams;
	return fileParamsSchema.parse({
		kind: search.get(names.kind) ?? undefined,
		q: search.get(names.q) ?? "",
	});
}
