import { expect, test } from "bun:test";
import {
	counterDigits,
	nextId,
	padCount,
	prevId,
} from "@/lib/portfolio/project-nav";

const ids = ["a", "b", "c"];

test("next and prev loop", () => {
	expect(nextId(ids, "a")).toBe("b");
	expect(nextId(ids, "c")).toBe("a");
	expect(prevId(ids, "a")).toBe("c");
	expect(prevId(ids, "b")).toBe("a");
	expect(nextId(ids, "zzz")).toBeUndefined();
});

test("counter digits and padding", () => {
	expect(counterDigits(6)).toEqual({ tens: 0, units: 6 });
	expect(counterDigits(12)).toEqual({ tens: 1, units: 2 });
	expect(padCount(6)).toBe("06");
});
