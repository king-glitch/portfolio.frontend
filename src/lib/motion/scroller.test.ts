import { expect, test } from "bun:test";
import { config } from "@/config";
import {
	decayPull,
	easeInOut,
	feedPull,
	feedTrack,
	initialScroller,
	isAtEnd,
	parallaxOffset,
	snapTarget,
	stepScroller,
	wheelDelta,
} from "@/lib/motion/scroller";

const cfg = config.work.scroller;

test("wheel delta picks the larger axis and scales line/page modes", () => {
	expect(wheelDelta({ deltaX: 3, deltaY: 10, deltaMode: 0 }, 800, 32)).toBe(
		10,
	);
	expect(wheelDelta({ deltaX: 0, deltaY: 2, deltaMode: 1 }, 800, 32)).toBe(
		64,
	);
	expect(wheelDelta({ deltaX: 0, deltaY: 1, deltaMode: 2 }, 800, 32)).toBe(
		800,
	);
});

test("feed clamps the target to the track", () => {
	const s = initialScroller();
	expect(feedTrack(s, -50, 1000, 1).target).toBe(0);
	expect(feedTrack(s, 5000, 1000, 1).target).toBe(1000);
	expect(feedTrack(s, 200, 1000, 7).lastInput).toBe(7);
});

test("end is reached only once the track has settled there", () => {
	const s = { ...initialScroller(), target: 1000, current: 600 };
	expect(isAtEnd(s, 1000, cfg)).toBe(false);
	expect(isAtEnd({ ...s, current: 1000 }, 1000, cfg)).toBe(true);
});

test("a mostly visible last panel snaps in after input stops", () => {
	const s = { ...initialScroller(), target: 800, lastInput: 0 };
	expect(snapTarget(s, 1000, 1000, cfg.snapIdleMs + 1, cfg)).toBe(1000);
	expect(snapTarget(s, 1000, 1000, 1, cfg)).toBe(800);
	expect(snapTarget({ ...s, target: 100 }, 1000, 1000, 9999, cfg)).toBe(100);
});

test("step eases toward the target and settles", () => {
	const s = { ...initialScroller(), target: 100 };
	expect(stepScroller(s, cfg, false).current).toBeCloseTo(100 * cfg.lerp, 5);
	expect(stepScroller(s, cfg, true).current).toBe(100);
});

test("parallax is zero for the panel at the viewport edge", () => {
	expect(parallaxOffset(500, 500, 1.2, cfg)).toBeCloseTo(0, 5);
	expect(parallaxOffset(1000, 0, 1, cfg)).toBe(0);
});

test("push easing starts slow, ends at 1", () => {
	expect(easeInOut(0)).toBe(0);
	expect(easeInOut(0.5)).toBeCloseTo(0.5, 5);
	expect(easeInOut(1)).toBe(1);
	expect(easeInOut(0.1)).toBeLessThan(0.1);
});

test("pull resists harder as it grows and caps at the threshold", () => {
	const first = feedPull(0, 100, cfg);
	const later =
		feedPull(cfg.pullThresholdPx * 0.8, 100, cfg) -
		cfg.pullThresholdPx * 0.8;
	expect(first).toBeCloseTo(100 * cfg.pullBaseGain, 5);
	expect(later).toBeLessThan(first);
	expect(feedPull(cfg.pullThresholdPx, 9999, cfg)).toBe(cfg.pullThresholdPx);
	expect(feedPull(50, -100, cfg)).toBe(0);
});

test("pull drains only after idle", () => {
	expect(decayPull(100, 0, cfg)).toBe(100);
	expect(decayPull(100, cfg.pullIdleMs, cfg)).toBeCloseTo(
		100 * cfg.pullDecay,
		5,
	);
	expect(decayPull(0.5, cfg.pullIdleMs, cfg)).toBe(0);
});
