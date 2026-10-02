import { describe, expect, test } from "bun:test";
import { config } from "@/config";
import {
	isSnapTarget,
	magneticOffset,
	previewStep,
	ringTarget,
	stepRing,
	toCursorLabel,
} from "@/lib/motion/cursor";
import { easeInOutCubic } from "@/lib/motion/lerp";
import { CursorLabel } from "@/types/cursor";

const c = config.shell.cursor;
const button = { left: 100, top: 50, width: 200, height: 40 };

describe("ringTarget", () => {
	test("default ring follows the pointer", () => {
		const t = ringTarget(
			{ mx: 10, my: 20, rect: null, rectRadius: 0, labelled: false },
			c,
		);
		expect(t).toEqual({
			x: 10,
			y: 20,
			w: 36,
			h: 36,
			r: 18,
			snapping: false,
		});
	});

	test("label grows the ring to 88px", () => {
		const t = ringTarget(
			{ mx: 0, my: 0, rect: null, rectRadius: 0, labelled: true },
			c,
		);
		expect([t.w, t.h, t.r]).toEqual([88, 88, 44]);
	});

	test("snap wraps the element with +14px size and +7px radius", () => {
		const t = ringTarget(
			{ mx: 150, my: 70, rect: button, rectRadius: 10, labelled: false },
			c,
		);
		expect(t).toEqual({
			x: 200,
			y: 70,
			w: 214,
			h: 54,
			r: 17,
			snapping: true,
		});
	});

	test("snap radius is capped at half the height", () => {
		const t = ringTarget(
			{ mx: 150, my: 70, rect: button, rectRadius: 999, labelled: false },
			c,
		);
		expect(t.r).toBe(27);
	});

	test("snap releases when the pointer is farther than 12px away", () => {
		const t = ringTarget(
			{ mx: 400, my: 70, rect: button, rectRadius: 10, labelled: false },
			c,
		);
		expect(t.snapping).toBe(false);
	});
});

describe("isSnapTarget", () => {
	test("accepts <= 900x240, rejects larger or empty", () => {
		expect(isSnapTarget(button, c)).toBe(true);
		expect(isSnapTarget({ ...button, width: 901 }, c)).toBe(false);
		expect(isSnapTarget({ ...button, height: 241 }, c)).toBe(false);
		expect(isSnapTarget({ ...button, width: 0 }, c)).toBe(false);
	});
});

describe("stepRing", () => {
	test("moves 20% of the way", () => {
		const next = stepRing(
			{ x: 0, y: 0, w: 36, h: 36, r: 18 },
			{ x: 100, y: 50, w: 88, h: 88, r: 44 },
			0.2,
		);
		expect(next.x).toBeCloseTo(20);
		expect(next.y).toBeCloseTo(10);
		expect(next.w).toBeCloseTo(46.4);
	});
});

describe("magneticOffset", () => {
	test("pulls 0.28 / 0.38 of the offset from the centre", () => {
		const o = magneticOffset(button, 250, 90, config.shell.cursor.magnetic);
		expect(o.x).toBeCloseTo(50 * 0.28);
		expect(o.y).toBeCloseTo(20 * 0.38);
	});
});

describe("previewStep", () => {
	const p = config.shell.indexPreview;
	test("eases at 0.14 and tilts with lag", () => {
		const s = previewStep({ x: 0, y: 0 }, 100, 0, p);
		expect(s.x).toBeCloseTo(14);
		expect(s.rotateDeg).toBeCloseTo(6.88);
	});
	test("tilt is clamped to +-8deg", () => {
		expect(previewStep({ x: 0, y: 0 }, 5000, 0, p).rotateDeg).toBe(8);
		expect(previewStep({ x: 0, y: 0 }, -5000, 0, p).rotateDeg).toBe(-8);
	});
});

describe("toCursorLabel", () => {
	test("accepts known labels only", () => {
		expect(toCursorLabel("look-closer")).toBe(CursorLabel.LookCloser);
		expect(toCursorLabel("nope")).toBeNull();
		expect(toCursorLabel(null)).toBeNull();
		expect(toCursorLabel("")).toBeNull();
	});
});

describe("easeInOutCubic", () => {
	test("is 0, .5 and 1 at the ends and middle", () => {
		expect(easeInOutCubic(0)).toBe(0);
		expect(easeInOutCubic(0.5)).toBe(0.5);
		expect(easeInOutCubic(1)).toBe(1);
	});
});
