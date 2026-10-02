import { describe, expect, test } from "bun:test";
import {
	bubbleDiameter,
	createBall,
	dropBalls,
	stepBalls,
	type PhysicsConfig,
} from "@/lib/motion/physics";

const cfg: PhysicsConfig = {
	gravity: 0.55,
	drag: 0.996,
	floorRestitution: 0.42,
	wallRestitution: 0.6,
	floorFriction: 0.94,
	collisionPasses: 2,
	impulse: 1.35,
	restSpeed: 0.9,
	dropSpacingPx: 46,
	dropJitterPx: 60,
	dropVx: 4,
};
const dia = {
	diameterBasePx: 56,
	diameterPerCharPx: 7,
	diameterMinPx: 84,
	diameterMaxPx: 168,
	fontMinPx: 13,
	fontMaxPx: 20,
	fontDivisor: 6.5,
};

describe("physics", () => {
	test("gravity accelerates a free ball", () => {
		const b = createBall(40);
		b.y = 0;
		stepBalls([b], 600, 600, cfg);
		expect(b.vy).toBeCloseTo(0.55, 5);
		expect(b.y).toBeCloseTo(0.55, 5);
	});

	test("floor bounce loses energy and stays inside", () => {
		const b = createBall(40);
		b.y = 559;
		b.vy = 20;
		stepBalls([b], 600, 600, cfg);
		expect(b.y + b.r).toBeLessThanOrEqual(600);
		expect(b.vy).toBeLessThan(0);
		expect(Math.abs(b.vy)).toBeLessThan(20 * 0.5);
	});

	test("walls keep balls inside", () => {
		const b = createBall(40);
		b.x = 10;
		b.y = 100;
		b.vx = -30;
		stepBalls([b], 600, 600, cfg);
		expect(b.x - b.r).toBeGreaterThanOrEqual(0);
		expect(b.vx).toBeGreaterThan(0);
	});

	test("no overlap after 2s of settling", () => {
		let seed = 7;
		const rng = () => {
			seed = (seed * 16807) % 2147483647;
			return seed / 2147483647;
		};
		const balls = Array.from({ length: 12 }, () => createBall(40));
		dropBalls(balls, 700, rng, cfg);
		for (let i = 0; i < 120; i++) stepBalls(balls, 700, 520, cfg);
		for (let i = 0; i < balls.length; i++)
			for (let j = i + 1; j < balls.length; j++) {
				const a = balls[i]!;
				const c = balls[j]!;
				const d = Math.hypot(a.x - c.x, a.y - c.y);
				expect(d).toBeGreaterThan((a.r + c.r) * 0.9);
			}
	});

	test("a held ball does not move under gravity", () => {
		const b = createBall(40);
		b.drag = true;
		b.y = 10;
		stepBalls([b], 600, 600, cfg);
		expect(b.y).toBe(10);
	});

	test("diameter is clamped", () => {
		expect(bubbleDiameter("C#", dia)).toBe(84);
		expect(bubbleDiameter("x".repeat(40), dia)).toBe(168);
	});
});
