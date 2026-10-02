import { describe, expect, test } from "bun:test";
import {
	countUpValue,
	easeOut,
	wordOpacity,
	wordRevealProgress,
} from "@/lib/motion/reveal";

const cfg = {
	startViewport: 0.85,
	endViewport: 0.55,
	minOpacity: 0.16,
	overshoot: 1.1,
};

describe("reveal", () => {
	test("word opacity ramps 0.16 -> 1", () => {
		expect(wordOpacity(0, 0, 40, cfg)).toBeCloseTo(0.16, 5);
		expect(wordOpacity(1, 39, 40, cfg)).toBeCloseTo(1, 5);
		expect(wordOpacity(0.5, 0, 40, cfg)).toBe(1);
	});

	test("progress runs from top at 85% to bottom at 55% of the viewport", () => {
		expect(wordRevealProgress(900, 300, 900, cfg)).toBe(0);
		// bottom (top + 300) at 55% of 900 = 495 -> top 195: done.
		expect(wordRevealProgress(195, 300, 900, cfg)).toBeCloseTo(1, 5);
		expect(wordRevealProgress(-1000, 300, 900, cfg)).toBe(1);
		expect(wordRevealProgress((765 + 195) / 2, 300, 900, cfg)).toBeCloseTo(
			0.5,
			5,
		);
	});

	test("count-up finishes at the target in 1600ms", () => {
		expect(countUpValue(0, 1600, 11, 4)).toBe(0);
		expect(countUpValue(1600, 1600, 11, 4)).toBe(11);
		expect(countUpValue(9999, 1600, 11, 4)).toBe(11);
		expect(easeOut(0.5, 4)).toBeCloseTo(0.9375, 5);
	});
});
