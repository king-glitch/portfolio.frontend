import { expect, test } from "bun:test";
import {
	blocksJson,
	truncateStrings,
} from "@/routes/work/[project-id]/components/json/block-json";

test("long strings are cut to 62 chars plus an ellipsis, at any depth", () => {
	const long = "x".repeat(70);
	const out = truncateStrings({
		a: [long],
		b: { c: long },
		d: "short",
		e: 3,
	});
	expect(out).toEqual({
		a: [`${"x".repeat(62)}…`],
		b: { c: `${"x".repeat(62)}…` },
		d: "short",
		e: 3,
	});
	expect(truncateStrings("x".repeat(64))).toBe("x".repeat(64));
});

test("blocksJson is pretty printed", () => {
	expect(blocksJson([{ type: "quote" }])).toBe(
		'[\n  {\n    "type": "quote"\n  }\n]',
	);
});
