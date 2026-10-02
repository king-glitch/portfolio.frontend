import { describe, expect, test } from "bun:test";
import { config } from "@/config";
import {
	magneticOffset,
	previewStep,
	rectCenter,
	ringStretch,
	ringTarget,
	stepRing,
	toCursorLabel,
} from "@/lib/motion/cursor";
import { easeInOutCubic } from "@/lib/motion/lerp";
import { CursorLabel, CursorMode } from "@/types/cursor";

const c = config.shell.cursor;
const button = { left: 100, top: 50, width: 200, height: 40 };

describe("ringTarget", () => {
	test("idle ring follows the pointer as a 36px circle", () => {
		expect(ringTarget({ x: 10, y: 20 }, null, CursorMode.Idle, c)).toEqual({
			x: 10,
			y: 20,
			w: 36,
			h: 36,
			r: 18,
		});
	});

	test("hover and label are circles, never the element box", () => {
		const hover = ringTarget({ x: 0, y: 0 }, null, CursorMode.Hover, c);
		const label = ringTarget({ x: 0, y: 0 }, null, CursorMode.Label, c);
		expect([hover.w, hover.h, hover.r]).toEqual([64, 64, 32]);
		expect([label.w, label.h, label.r]).toEqual([88, 88, 44]);
	});

	test("text mode is a thin I-beam", () => {
		const t = ringTarget({ x: 0, y: 0 }, null, CursorMode.Text, c);
		expect([t.w, t.h]).toEqual([2, 30]);
	});

	test("a magnet pulls the ring 35% toward its centre", () => {
		const t = ringTarget(
			{ x: 100, y: 100 },
			rectCenter(button),
			CursorMode.Hover,
			c,
		);
		expect(t.x).toBeCloseTo(100 + (200 - 100) * 0.35);
		expect(t.y).toBeCloseTo(100 + (70 - 100) * 0.35);
	});
});

describe("ringStretch", () => {
	test("still ring is round", () => {
		expect(ringStretch(0, 0, c)).toEqual({ angleDeg: 0, sx: 1, sy: 1 });
	});
	test("stretches along the motion and caps", () => {
		const s = ringStretch(0, 10, c);
		expect(s.angleDeg).toBeCloseTo(90);
		expect(s.sx).toBeCloseTo(1.12);
		expect(s.sy).toBeCloseTo(0.94);
		expect(ringStretch(1000, 0, c).sx).toBeCloseTo(1.45);
	});
});

describe("stepRing", () => {
	test("eases position and size at their own rates", () => {
		const next = stepRing(
			{ x: 0, y: 0, w: 36, h: 36, r: 18 },
			{ x: 100, y: 50, w: 88, h: 88, r: 44 },
			0.2,
			0.5,
		);
		expect(next.x).toBeCloseTo(20);
		expect(next.y).toBeCloseTo(10);
		expect(next.w).toBeCloseTo(62);
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
