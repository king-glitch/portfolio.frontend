import { expect, test } from "bun:test";
import { config } from "@/config";
import {
	cellRect,
	panBounds,
	stepPan,
	tileFx,
	wallGeometry,
	wallUnit,
} from "@/lib/motion/wall";

const base = { tx: 0, ty: 0, vx: 0, vy: 0, cx: 0, cy: 0 };

test("unit and geometry by viewport", () => {
	expect(wallUnit(1440)).toBe(200);
	expect(wallUnit(900)).toBe(176);
	expect(wallUnit(390)).toBe(148);
	const g = wallGeometry(1440);
	expect(g.gap).toBe(16);
	expect(g.width).toBe(10 * 200 + 9 * 16);
	expect(g.height).toBe(7 * 200 + 6 * 16);
});

test("cellRect spans gaps", () => {
	const g = wallGeometry(1440);
	const r = cellRect({ col: 3, row: 2, cols: 3, rows: 2 }, g);
	expect(r.x).toBe(3 * 216);
	expect(r.w).toBe(3 * 200 + 2 * 16);
	expect(r.cx).toBe(r.x + r.w / 2);
});

test("tile at the centre is full, a far tile fades and shrinks", () => {
	const common = { camX: 0, camY: 0, vw: 1440, vh: 900, introS: Infinity };
	const mid = tileFx({ ...common, tileX: 720, tileY: 450 });
	expect(mid.opacity).toBe(1);
	expect(mid.scale).toBe(1);
	const R = 1440 * config.about.wall.falloff.radiusRatio;
	const far = tileFx({ ...common, tileX: 720 + 0.9 * R, tileY: 450 });
	expect(far.opacity).toBeCloseTo(0.555, 2);
	expect(far.scale).toBeCloseTo(0.88, 2);
	expect(far.x).toBeLessThan(0);
});

test("ripple starts hidden", () => {
	const fx = tileFx({
		tileX: 720,
		tileY: 450,
		camX: 0,
		camY: 0,
		vw: 1440,
		vh: 900,
		introS: 0,
	});
	expect(fx.opacity).toBe(0);
});

test("inertia decays x0.93 and stops under 0.1px", () => {
	const b = panBounds(1440, 900, wallGeometry(1440));
	const o = { dragging: false, reduced: false };
	let s = stepPan({ ...base, vx: -10, tx: -1000, cx: -1000 }, b, o);
	expect(s.vx).toBeCloseTo(-9.3, 5);
	for (let i = 0; i < 200; i++) s = stepPan(s, b, o);
	expect(s.vx).toBe(0);
});

test("rubber band springs toward the 30% limit", () => {
	const b = panBounds(1440, 900, wallGeometry(1440));
	expect(b.maxX).toBe(432);
	let s = { ...base, tx: 800, cx: 800 };
	for (let i = 0; i < 80; i++)
		s = stepPan(s, b, { dragging: false, reduced: false });
	expect(s.tx).toBeCloseTo(432, 0);
	const held = stepPan({ ...base, tx: 800 }, b, {
		dragging: true,
		reduced: false,
	});
	expect(held.tx).toBe(800);
});

test("reduced motion: no inertia, instant camera", () => {
	const b = panBounds(1440, 900, wallGeometry(1440));
	const s = stepPan({ ...base, vx: -10, tx: -300 }, b, {
		dragging: false,
		reduced: true,
	});
	expect(s.tx).toBe(-300);
	expect(s.vx).toBe(0);
	expect(s.cx).toBe(-300);
});
