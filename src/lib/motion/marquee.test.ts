import { describe, expect, test } from "bun:test";
import { stepMarquee, type MarqueeConfig } from "@/lib/motion/marquee";

const cfg: MarqueeConfig = {
	baseSpeedPx: 1.1,
	velocitySmoothing: 0.2,
	velocityCap: 40,
	velocityFactor: 0.6,
	skewFactor: 0.35,
	skewMaxDeg: 12,
};

describe("marquee", () => {
	test("idle drift is the base speed", () => {
		const s = stepMarquee({ velocity: 0, offset: 0 }, 0, 1000, cfg);
		expect(s.offset).toBeCloseTo(-1.1, 5);
	});

	test("skew never exceeds 12deg", () => {
		let s = { velocity: 0, offset: 0 };
		for (let i = 0; i < 200; i++) {
			const next = stepMarquee(s, 500, 1000, cfg);
			expect(Math.abs(next.skewDeg)).toBeLessThanOrEqual(12);
			s = next;
		}
		for (let i = 0; i < 200; i++) {
			const next = stepMarquee(s, -500, 1000, cfg);
			expect(Math.abs(next.skewDeg)).toBeLessThanOrEqual(12);
			s = next;
		}
	});

	test("wraps seamlessly at half width and reverses on scroll-up", () => {
		let s = { velocity: 0, offset: -999.5 };
		s = stepMarquee(s, 0, 1000, cfg);
		expect(s.offset).toBeGreaterThan(-1000);
		expect(s.offset).toBeLessThanOrEqual(0);
		const up = stepMarquee({ velocity: -10, offset: -100 }, -10, 1000, cfg);
		expect(up.offset).toBeGreaterThan(-100);
	});
});
