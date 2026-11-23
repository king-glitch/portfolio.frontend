import { expect, test } from "bun:test";
import { stepAt } from "@/hooks/scroll/use-pinned-steps";

test("progress maps to clamped equal bands", () => {
	expect(stepAt(-0.2, 5)).toBe(0);
	expect(stepAt(0, 5)).toBe(0);
	expect(stepAt(0.21, 5)).toBe(1);
	expect(stepAt(0.99, 5)).toBe(4);
	expect(stepAt(1, 5)).toBe(4);
	expect(stepAt(1.5, 5)).toBe(4);
});
