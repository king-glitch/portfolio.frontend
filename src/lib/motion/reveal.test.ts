import { describe, expect, test } from "bun:test";
import { easeOut } from "@/lib/motion/reveal";

describe("reveal", () => {
	test("easeOut follows quart curve", () => {
		expect(easeOut(0.5, 4)).toBeCloseTo(0.9375, 5);
	});
});
