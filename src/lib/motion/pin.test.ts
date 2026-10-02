import { describe, expect, test } from "bun:test";
import { pinExtra, pinHeight, pinProgress, pinTranslate } from "@/lib/motion/pin";

describe("pin", () => {
	test("scroll distance is the track overflow beyond the viewport", () => {
		const extra = pinExtra(3200, 1440);
		expect(extra).toBe(1760);
		expect(pinHeight(900, extra)).toBe(900 + 1760);
		expect(pinExtra(1000, 1440)).toBe(0);
	});

	test("progress is 0 before, 1 at the end of the pin", () => {
		const h = 2660;
		expect(pinProgress(300, h, 900)).toBe(0);
		expect(pinProgress(0, h, 900)).toBe(0);
		expect(pinProgress(-(h - 900), h, 900)).toBe(1);
		expect(pinProgress(-5000, h, 900)).toBe(1);
		expect(pinProgress(-880, h, 900)).toBeCloseTo(0.5, 5);
		expect(pinTranslate(0.5, 1760)).toBe(-880);
	});
});
