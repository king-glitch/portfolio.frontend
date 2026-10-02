import { config } from "@/config";

const { truncateAt, truncateKeep } = config.work.jsonSheet;

/** Strings longer than 64 chars are cut to 62 plus an ellipsis, at any depth (Main jsonOf, 867). */
export function truncateStrings(value: unknown): unknown {
	if (typeof value === "string")
		return value.length > truncateAt
			? `${value.slice(0, truncateKeep)}…`
			: value;
	if (Array.isArray(value)) return value.map(truncateStrings);
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, truncateStrings(v)]),
		);
	return value;
}

export const blocksJson = (blocks: unknown[]): string =>
	JSON.stringify(blocks.map(truncateStrings), null, 2);
