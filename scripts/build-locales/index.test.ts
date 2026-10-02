import { expect, test } from "bun:test";
import { buildLocale, mergeParts, sortKeys } from "./index";

test("merges parts that share a namespace group", () => {
	expect(mergeParts([{ a: { x: "1" } }, { a: { y: "2" }, b: "3" }])).toEqual({
		a: { x: "1", y: "2" },
		b: "3",
	});
});

test("duplicate leaf key throws with its path", () => {
	expect(() => mergeParts([{ a: { x: "1" } }, { a: { x: "2" } }])).toThrow(
		"a.x",
	);
});

test("string vs object collision throws", () => {
	expect(() => mergeParts([{ a: "1" }, { a: { x: "2" } }])).toThrow("a");
});

test("output is sorted and independent of part order", () => {
	const one = { b: { z: "1", a: "2" } };
	const two = { a: "3" };
	expect(buildLocale([one, two])).toBe(buildLocale([two, one]));
	expect(Object.keys(sortKeys({ b: "1", a: "2" }) as object)).toEqual([
		"a",
		"b",
	]);
});
