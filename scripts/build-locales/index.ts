import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const partsDir = resolve(root, "src/locales/parts");
const outPath = resolve(root, "src/locales/en.json");

export type Json = string | { [key: string]: Json };

function isObject(value: Json | undefined): value is { [key: string]: Json } {
	return typeof value === "object";
}

/** Deep-merges part files; the same leaf key in two parts is an error (one owner per key). */
export function mergeParts(
	parts: { [key: string]: Json }[],
	path = "",
): { [key: string]: Json } {
	const out: { [key: string]: Json } = {};
	for (const part of parts) {
		for (const [key, value] of Object.entries(part)) {
			const at = path ? `${path}.${key}` : key;
			const existing = out[key];
			if (existing === undefined) out[key] = value;
			else if (isObject(existing) && isObject(value))
				out[key] = mergeParts([existing, value], at);
			else throw new Error(`Locale key defined twice: ${at}`);
		}
	}
	return out;
}

/** Recursively sorts keys so the output never depends on merge order. */
export function sortKeys(value: Json): Json {
	if (!isObject(value)) return value;
	return Object.fromEntries(
		Object.keys(value)
			.sort()
			.map((key) => [key, sortKeys(value[key] ?? "")]),
	);
}

export function buildLocale(parts: { [key: string]: Json }[]): string {
	return `${JSON.stringify(sortKeys(mergeParts(parts)), null, 2)}\n`;
}

if (import.meta.main) {
	const names = (await readdir(partsDir))
		.filter((n) => n.endsWith(".json"))
		.sort();
	const parts = await Promise.all(
		names.map(async (n) =>
			JSON.parse(await readFile(resolve(partsDir, n), "utf8")),
		),
	);
	const options = await resolveConfig(outPath);
	await writeFile(
		outPath,
		await format(buildLocale(parts), { ...options, filepath: outPath }),
		"utf8",
	);
	console.log(`Merged ${names.length} parts -> ${outPath}`);
}
