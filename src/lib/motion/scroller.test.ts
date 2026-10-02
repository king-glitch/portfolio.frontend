import { expect, test } from "bun:test";
import { config } from "@/config";
import {
	activePanelIndex,
	feedScroll,
	initialScroller,
	parallaxOffset,
	pullRatio,
	stepScroller,
	wheelDelta,
} from "@/lib/motion/scroller";

const cfg = config.work.scroller;
const atEnd = { ...initialScroller(), target: 1000, current: 1000 };

test("wheel: larger axis wins, line and page modes scale", () => {
	expect(wheelDelta({ deltaX: 3, deltaY: 10, deltaMode: 0 }, 900, 32)).toBe(
		10,
	);
	expect(wheelDelta({ deltaX: -20, deltaY: 4, deltaMode: 0 }, 900, 32)).toBe(
		-20,
	);
	expect(wheelDelta({ deltaX: 0, deltaY: 2, deltaMode: 1 }, 900, 32)).toBe(
		64,
	);
	expect(wheelDelta({ deltaX: 0, deltaY: 1, deltaMode: 2 }, 900, 32)).toBe(
		900,
	);
});

test("feed clamps target to 0..max", () => {
	const s = initialScroller();
	expect(feedScroll(s, -50, 1000, 0, cfg).state.target).toBe(0);
	expect(feedScroll(s, 5000, 1000, 0, cfg).state.target).toBe(1000);
});

test("past the end, pull grows with resistance and unwinds on reverse", () => {
	const a = feedScroll(atEnd, 100, 1000, 1, cfg);
	expect(a.state.pull).toBeCloseTo(50);
	expect(a.state.target).toBe(1000);
	const b = feedScroll(a.state, 100, 1000, 2, cfg);
	expect(b.state.pull - a.state.pull).toBeLessThan(50);
	expect(feedScroll(b.state, -30, 1000, 3, cfg).state.pull).toBeCloseTo(
		b.state.pull - 30,
	);
	expect(feedScroll(b.state, -9999, 1000, 3, cfg).state.pull).toBe(0);
});

test("crossing the threshold navigates and caps pull", () => {
	const r = feedScroll(
		{ ...atEnd, pull: cfg.resistancePx - 1 },
		500,
		1000,
		1,
		cfg,
	);
	expect(r.navigate).toBe(true);
	expect(r.state.pull).toBe(cfg.resistancePx);
});

test("pull decays only after the idle window and snaps to zero", () => {
	const s = { ...atEnd, pull: 100, lastInput: 0 };
	expect(stepScroller(s, cfg.pullIdleMs, cfg, false).pull).toBe(100);
	expect(stepScroller(s, cfg.pullIdleMs + 1, cfg, false).pull).toBeCloseTo(
		90,
	);
	const tiny = { ...atEnd, pull: 0.4, lastInput: 0 };
	expect(stepScroller(tiny, 1000, cfg, false).pull).toBe(0);
});

test("current eases by lerp per frame, or jumps when instant", () => {
	const s = { ...initialScroller(), target: 100 };
	expect(stepScroller(s, 0, cfg, false).current).toBeCloseTo(100 * cfg.lerp);
	expect(stepScroller(s, 0, cfg, true).current).toBe(100);
});

test("parallax: speed above 1 drifts ahead, below 1 lags, 1 is static", () => {
	expect(parallaxOffset(1000, 0, 1, cfg)).toBe(0);
	expect(parallaxOffset(1000, 0, 1.22, cfg)).toBeLessThan(0);
	expect(parallaxOffset(1000, 0, 0.88, cfg)).toBeGreaterThan(0);
	expect(parallaxOffset(1000, 0, 0.88, cfg)).toBeCloseTo(1000 * 0.12 * 0.35);
});

test("pull ratio and active panel", () => {
	expect(pullRatio(cfg.resistancePx / 2, cfg)).toBe(0.5);
	expect(pullRatio(9999, cfg)).toBe(1);
	const lefts = [0, 1000, 2000];
	expect(activePanelIndex(lefts, 0, 1000, 2000, cfg)).toBe(0);
	expect(activePanelIndex(lefts, 600, 1000, 2000, cfg)).toBe(1);
	expect(activePanelIndex(lefts, 1999, 1000, 2000, cfg)).toBe(2);
});
