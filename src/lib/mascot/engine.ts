import { ZONE_CENTERS } from "@/lib/mascot/designs";
import {
	MascotZone,
	type MascotFace,
	type MascotOptions,
	type MascotPart,
} from "@/types/ui";

/**
 * Living mascot engine (port of the prototype `living-mascot.html`). Each face part is a point
 * on a unit sphere with "up" and "right" tangents; the sphere yaws/pitches toward the gaze, and
 * every part is projected back to 2D so shapes narrow and tilt near the edge. Gaze and head drift
 * are damped springs; blinks, idle glances and the gaze zone run on their own timers.
 * DOM: builds `skull` + `face` children inside `head`, then writes only `transform`/`opacity`.
 */

type Vec = [number, number, number];

interface Spring {
	x: number;
	y: number;
	vx: number;
	vy: number;
}

interface Built {
	el: HTMLDivElement;
	p: Vec;
	t: Vec;
	s: Vec;
	lift: number;
	rot: number;
	blink: boolean;
	squash: boolean;
	flash?: [number, number];
}

export interface MascotEngine {
	/** One frame at `now` (ms, rAF time). */
	step: (now: number) => void;
	/** Pointer moved: aim at it. */
	pointer: (clientX: number, clientY: number, now: number) => void;
	/** Pointer left the window: idle glances start sooner. */
	release: (now: number) => void;
	/** Squash the head and blink (click, or a page event worth reacting to). */
	poke: (strength?: number) => void;
	setZone: (zone: MascotZone, range?: number) => void;
}

const norm = (v: Vec): Vec => {
	const l = Math.hypot(v[0], v[1], v[2]);
	return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: Vec, b: Vec): Vec => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0],
];

/** Sphere anchor of a part: its point and its up/right tangents. */
function anchor(x: number, y: number): Pick<Built, "p" | "t" | "s"> {
	const z = Math.sqrt(Math.max(0.02, 1 - x * x - y * y));
	const p: Vec = [x, y, z];
	const t = norm([-p[1] * p[0], 1 - p[1] * p[1], -p[1] * p[2]]);
	return { p, t, s: cross(t, p) };
}

/** Absolutely positioned layer; styles inline because the engine owns these nodes. */
function layer(style: Partial<CSSStyleDeclaration>): HTMLDivElement {
	const el = document.createElement("div");
	Object.assign(el.style, { position: "absolute", ...style });
	return el;
}

function buildPart(part: MascotPart, ink: string): HTMLDivElement {
	const el = layer({
		left: "50%",
		top: "50%",
		borderRadius: "999px",
		willChange: "transform",
	});
	el.style.width = `${part.w}%`;
	el.style.height = `${part.h}%`;
	el.style.margin = `${-part.h / 2}% 0 0 ${-part.w / 2}%`;
	el.style.background = ink;
	return el;
}

function integrate(
	s: Spring,
	tx: number,
	ty: number,
	k: number,
	c: number,
	dt: number,
): void {
	s.vx += (k * (tx - s.x) - c * s.vx) * dt;
	s.vy += (k * (ty - s.y) - c * s.vy) * dt;
	s.x += s.vx * dt;
	s.y += s.vy * dt;
}

export function createMascotEngine(
	root: HTMLElement,
	head: HTMLElement,
	face: MascotFace,
	options: MascotOptions,
	calm: boolean,
): MascotEngine {
	const cfg = { ...options };
	if (calm) {
		cfg.idle = false;
		cfg.damping = 30;
	}
	let [zoneX, zoneY] = ZONE_CENTERS[cfg.zone];

	head.replaceChildren();
	const skull = layer({ inset: "0", borderRadius: "50%" });
	skull.style.background = face.skull;
	if (face.ring) skull.style.boxShadow = `inset 0 0 0 3px ${face.ring}`;
	const surface = layer({
		inset: "0",
		borderRadius: "50%",
		overflow: "hidden",
		isolation: "isolate",
	});
	head.append(skull, surface);
	const parts: Built[] = face.parts.map((part) => {
		const el = buildPart(part, face.ink);
		surface.appendChild(el);
		return {
			el,
			...anchor(part.x, part.y),
			lift: part.lift ?? 1,
			rot: part.rot ?? 0,
			blink: part.blink !== false,
			squash: part.squash === true,
			flash: part.flash,
		};
	});

	const look: Spring = { x: 0, y: 0, vx: 0, vy: 0 };
	const body: Spring = { x: 0, y: 0, vx: 0, vy: 0 };
	const pop = { p: 0, v: 0 };
	const aim = { x: 0, y: 0 };
	let lastPointer = Number.NEGATIVE_INFINITY;
	let nextGlance = 0;
	let zoneUntil = 0;
	let blinkAt = 1200;
	let blinkStart = Number.NEGATIVE_INFINITY;
	let last = 0;

	const idleGlance = (now: number) => {
		if (now < nextGlance) return;
		const a = Math.random() * Math.PI * 2;
		const d = Math.sqrt(Math.random()) * 0.7;
		aim.x = Math.cos(a) * d;
		aim.y = Math.sin(a) * d * 0.7;
		nextGlance = now + 700 + Math.random() * 2200;
		if (Math.random() < 0.3) blinkAt = now;
	};

	// Auto zone: a corner-ish area kept for a few seconds, never the same corner twice.
	const pickZone = (now: number) => {
		if (cfg.zone !== MascotZone.Auto || now < zoneUntil) return;
		let sx = Math.random() < 0.5 ? -1 : 1;
		let sy = Math.random() < 0.5 ? -1 : 1;
		if (sx === Math.sign(zoneX) && sy === Math.sign(zoneY)) {
			if (Math.random() < 0.5) sx = -sx;
			else sy = -sy;
		}
		zoneX = sx * (0.3 + Math.random() * 0.2);
		zoneY = sy * (0.25 + Math.random() * 0.2);
		zoneUntil = now + 3500 + Math.random() * 5000;
		if (Math.random() < 0.5) blinkAt = now;
	};

	// 0 open .. 1 closed: close 70ms, hold 40ms, open 120ms; sometimes a double blink.
	const lid = (now: number): number => {
		if (cfg.blink && now >= blinkAt) {
			blinkStart = now;
			blinkAt = now + 2000 + Math.random() * 3500;
			if (Math.random() < 0.18) blinkAt = now + 260;
		}
		const u = (now - blinkStart) / 1000;
		let c = 0;
		if (u >= 0 && u < 0.07) c = u / 0.07;
		else if (u >= 0.07 && u < 0.11) c = 1;
		else if (u >= 0.11 && u < 0.23) c = 1 - (u - 0.11) / 0.12;
		return 1 - 0.92 * c * c * (3 - 2 * c);
	};

	const render = (now: number) => {
		const sec = now / 1000;
		const radius = head.offsetWidth / 2;
		const yaw = look.x * 0.85;
		const pitch = look.y * 0.6;
		const cy = Math.cos(yaw);
		const sy = Math.sin(yaw);
		const cp = Math.cos(pitch);
		const sp = Math.sin(pitch);
		const rot = ([x, y, z]: Vec): Vec => {
			const x1 = x * cy + z * sy;
			const z1 = -x * sy + z * cy;
			return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
		};
		const R = radius * 0.9;
		const lidScale = lid(now);
		const midY = -rot([0, 0, 1])[1] * R;
		for (const f of parts) {
			const P = rot(f.p);
			const T = rot(f.t);
			const S = rot(f.s);
			const k = R * f.lift;
			const sy2 = f.blink && !f.squash ? lidScale : 1;
			let rotDeg = f.rot;
			let lenX = 1;
			let ty = -P[1] * k;
			if (f.squash && f.blink) {
				// Flatten toward a horizontal line, keeping the stroke thickness.
				const th = (f.rot * Math.PI) / 180;
				const c = Math.cos(th);
				const s = Math.sin(th) * lidScale;
				rotDeg = (Math.atan2(s, c) * 180) / Math.PI;
				lenX = Math.hypot(c, s);
				ty = midY + (ty - midY) * lidScale;
			}
			// CSS y points down: local "down" maps to the sphere's down tangent (-T.x, +T.y).
			const m = [S[0], -S[1], -T[0], T[1]]
				.map((n) => n.toFixed(4))
				.join(",");
			f.el.style.transform = `translate(${(P[0] * k).toFixed(2)}px,${ty.toFixed(2)}px) matrix(${m},0,0) rotate(${rotDeg.toFixed(2)}deg) scale(${lenX.toFixed(3)},${sy2.toFixed(3)})`;
			const lit =
				f.flash && Math.sin(sec * f.flash[0] + f.flash[1]) < 0 ? 0 : 1;
			f.el.style.opacity = String(
				lit * Math.max(0, Math.min(P[2] / 0.3, 1)),
			);
		}
		const breath = Math.sin(sec * 1.6) * 0.006;
		head.style.transform = `translate(${(body.x * radius * 0.08).toFixed(2)}px,${(body.y * radius * 0.06).toFixed(2)}px) scale(${(1 + pop.p + breath).toFixed(4)},${(1 - pop.p + breath).toFixed(4)})`;
	};

	return {
		step(now) {
			const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0;
			last = now;
			pickZone(now);
			if (cfg.idle && now - lastPointer > 2500) idleGlance(now);
			const t = now / 1000;
			const tx = zoneX + aim.x * cfg.range + Math.sin(t * 1.1) * 0.02;
			const ty = zoneY + aim.y * cfg.range + Math.cos(t * 0.9) * 0.02;
			integrate(look, tx, ty, cfg.stiffness, cfg.damping, dt);
			integrate(body, look.x, look.y, 45, 9, dt);
			pop.v += (-320 * pop.p - 11 * pop.v) * dt;
			pop.p += pop.v * dt;
			render(now);
		},
		pointer(clientX, clientY, now) {
			// Square-rooted distance: the face reacts even when the cursor is close.
			const r = root.getBoundingClientRect();
			const dx = clientX - (r.left + r.width / 2);
			const dy = clientY - (r.top + r.height / 2);
			const reach = Math.sqrt(
				Math.min(Math.hypot(dx, dy) / (r.width * 0.9), 1),
			);
			const angle = Math.atan2(dy, dx);
			aim.x = Math.cos(angle) * reach;
			aim.y = Math.sin(angle) * reach;
			lastPointer = now;
		},
		release(now) {
			lastPointer = now - 1500;
		},
		poke(strength = 5) {
			pop.v += strength;
			blinkAt = performance.now();
		},
		setZone(zone, range) {
			cfg.zone = zone;
			[zoneX, zoneY] = ZONE_CENTERS[zone];
			if (range !== undefined) cfg.range = range;
			zoneUntil = 0;
		},
	};
}
