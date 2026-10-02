import { expect, test } from "bun:test";
import { createRng } from "@/lib/art/rng";

test("same seed gives the same sequence in [0, 1)", () => {
	const a = createRng(11);
	const b = createRng(11);
	const run = Array.from({ length: 50 }, () => a());
	expect(run).toEqual(Array.from({ length: 50 }, () => b()));
	expect(run.every((v) => v >= 0 && v < 1)).toBe(true);
});

test("seed 11 first value matches the prototype", () => {
	// (11 * 16807 % 2147483647 - 1) / 2147483646
	expect(createRng(11)()).toBeCloseTo((184877 - 1) / 2147483646, 12);
});
