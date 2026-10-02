/** Bubble physics (design/Main.dc.html dropBalls/stepBalls, lines 1073-1103). No DOM; `rng` is injected. */

export interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
	/** Held by the pointer: ignores gravity and is not pushed by collisions. */
	drag: boolean;
}

export interface PhysicsConfig {
	gravity: number;
	drag: number;
	floorRestitution: number;
	wallRestitution: number;
	floorFriction: number;
	collisionPasses: number;
	impulse: number;
	/** Below this bounce speed a ball rests on the floor. */
	restSpeed: number;
	dropSpacingPx: number;
	dropJitterPx: number;
	dropVx: number;
}

export interface DiameterConfig {
	diameterBasePx: number;
	diameterPerCharPx: number;
	diameterMinPx: number;
	diameterMaxPx: number;
	fontMinPx: number;
	fontMaxPx: number;
	fontDivisor: number;
}

export function bubbleDiameter(label: string, cfg: DiameterConfig): number {
	const raw = cfg.diameterBasePx + label.length * cfg.diameterPerCharPx;
	return Math.max(cfg.diameterMinPx, Math.min(cfg.diameterMaxPx, raw));
}

export function bubbleFontSize(diameter: number, cfg: DiameterConfig): number {
	return Math.max(
		cfg.fontMinPx,
		Math.min(cfg.fontMaxPx, Math.round(diameter / cfg.fontDivisor)),
	);
}

export function createBall(radius: number): Ball {
	return { x: 0, y: -200, vx: 0, vy: 0, r: radius, drag: false };
}

/** Re-drops every ball from above the box at random x, staggered in y. */
export function dropBalls(
	balls: Ball[],
	width: number,
	rng: () => number,
	cfg: Pick<PhysicsConfig, "dropSpacingPx" | "dropJitterPx" | "dropVx">,
): void {
	balls.forEach((b, i) => {
		b.x = b.r + rng() * Math.max(1, width - 2 * b.r);
		b.y = -b.r - i * cfg.dropSpacingPx - rng() * cfg.dropJitterPx;
		b.vx = (rng() - 0.5) * cfg.dropVx;
		b.vy = 0;
		b.drag = false;
	});
}

function collide(a: Ball, c: Ball, impulse: number): void {
	const dx = c.x - a.x;
	const dy = c.y - a.y;
	const min = a.r + c.r;
	const d2 = dx * dx + dy * dy;
	if (d2 >= min * min || d2 === 0) return;
	const d = Math.sqrt(d2);
	const nx = dx / d;
	const ny = dy / d;
	const overlap = min - d;
	const wa = a.drag ? 0 : c.drag ? 1 : 0.5;
	const wc = c.drag ? 0 : a.drag ? 1 : 0.5;
	a.x -= nx * overlap * wa;
	a.y -= ny * overlap * wa;
	c.x += nx * overlap * wc;
	c.y += ny * overlap * wc;
	const vn = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
	if (vn >= 0) return;
	const j = (-impulse * vn) / 2;
	if (!a.drag) {
		a.vx -= j * nx;
		a.vy -= j * ny;
	}
	if (!c.drag) {
		c.vx += j * nx;
		c.vy += j * ny;
	}
}

/** One physics frame inside a `width` x `height` box. */
export function stepBalls(
	balls: Ball[],
	width: number,
	height: number,
	cfg: PhysicsConfig,
): void {
	for (const b of balls) {
		if (b.drag) continue;
		b.vy += cfg.gravity;
		b.vx *= cfg.drag;
		b.x += b.vx;
		b.y += b.vy;
		if (b.x - b.r < 0) {
			b.x = b.r;
			b.vx = Math.abs(b.vx) * cfg.wallRestitution;
		}
		if (b.x + b.r > width) {
			b.x = width - b.r;
			b.vx = -Math.abs(b.vx) * cfg.wallRestitution;
		}
		if (b.y + b.r > height) {
			b.y = height - b.r;
			b.vy = -Math.abs(b.vy) * cfg.floorRestitution;
			b.vx *= cfg.floorFriction;
			if (Math.abs(b.vy) < cfg.restSpeed) b.vy = 0;
		}
	}
	for (let pass = 0; pass < cfg.collisionPasses; pass++) {
		for (let i = 0; i < balls.length; i++) {
			for (let j = i + 1; j < balls.length; j++) {
				const a = balls[i];
				const c = balls[j];
				if (a && c) collide(a, c, cfg.impulse);
			}
		}
	}
}
