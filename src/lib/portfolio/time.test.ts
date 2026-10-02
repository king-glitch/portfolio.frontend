import { expect, test } from "bun:test";
import { toFractionalYear, yearsSince } from "@/lib/portfolio/time";

test("yearsSince uses the injected clock", () => {
	expect(yearsSince("2023-01", new Date(2026, 5, 1))).toBe(3);
	expect(yearsSince("2030-01", new Date(2026, 5, 1))).toBe(0);
});

test("toFractionalYear puts months inside the year", () => {
	expect(toFractionalYear("2022-06")).toBeCloseTo(2022.4167, 3);
	expect(toFractionalYear("2023-01")).toBe(2023);
});
