import { clamp, lerp } from "@/lib/motion/lerp";
import { CursorLabel, CursorMode } from "@/types/cursor";

/** Ring geometry: centre point, size and corner radius, all px. */
export interface RingBox {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
}

export interface PointerRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface RingConfig {
	ringPx: number;
	hoverRingPx: number;
	labelRingPx: number;
	textWidthPx: number;
	textHeightPx: number;
	magnetPull: number;
}

export interface StretchConfig {
	stretchPerPx: number;
	stretchMax: number;
}

/** `data-cursor` attribute value -> label, or null when absent / unknown. */
export function toCursorLabel(value: string | null): CursorLabel | null {
	return Object.values(CursorLabel).find((label) => label === value) ?? null;
}

/** Ring size per mode. Always a circle (or the I-beam), never the hovered element's box. */
export function ringSize(
	mode: CursorMode,
	c: RingConfig,
): Pick<RingBox, "w" | "h" | "r"> {
	const circle = (d: number) => ({ w: d, h: d, r: d / 2 });
	const sizes: Record<CursorMode, Pick<RingBox, "w" | "h" | "r">> = {
		[CursorMode.Idle]: circle(c.ringPx),
		[CursorMode.Hover]: circle(c.hoverRingPx),
		[CursorMode.Label]: circle(c.labelRingPx),
		[CursorMode.Text]: {
			w: c.textWidthPx,
			h: c.textHeightPx,
			r: c.textWidthPx / 2,
		},
	};
	return sizes[mode];
}

/** Where the ring wants to be: on the pointer, pulled part of the way toward a magnetic element's centre. */
export function ringTarget(
	pointer: Point,
	magnet: Point | null,
	mode: CursorMode,
	c: RingConfig,
): RingBox {
	const at = magnet
		? {
				x: lerp(pointer.x, magnet.x, c.magnetPull),
				y: lerp(pointer.y, magnet.y, c.magnetPull),
			}
		: pointer;
	return { ...at, ...ringSize(mode, c) };
}

/** Eases position at `k` and size at `kSize` (size settles a little slower, which reads as a morph). */
export function stepRing(
	cur: RingBox,
	to: RingBox,
	k: number,
	kSize = k,
): RingBox {
	return {
		x: lerp(cur.x, to.x, k),
		y: lerp(cur.y, to.y, k),
		w: lerp(cur.w, to.w, kSize),
		h: lerp(cur.h, to.h, kSize),
		r: lerp(cur.r, to.r, kSize),
	};
}

/** Squash and stretch from the ring's own per-frame velocity: longer along the motion, thinner across it. */
export function ringStretch(
	vx: number,
	vy: number,
	c: StretchConfig,
): { angleDeg: number; sx: number; sy: number } {
	const speed = Math.hypot(vx, vy);
	const s = clamp(speed * c.stretchPerPx, 0, c.stretchMax);
	return {
		angleDeg: (Math.atan2(vy, vx) * 180) / Math.PI,
		sx: 1 + s,
		sy: 1 - s * 0.5,
	};
}

/** Centre of a rect. */
export const rectCenter = (rect: PointerRect): Point => ({
	x: rect.left + rect.width / 2,
	y: rect.top + rect.height / 2,
});

/** Magnetic pull: a fraction of the pointer's offset from the element centre. */
export function magneticOffset(
	rect: PointerRect,
	mx: number,
	my: number,
	factor: { x: number; y: number },
): { x: number; y: number } {
	return {
		x: (mx - (rect.left + rect.width / 2)) * factor.x,
		y: (my - (rect.top + rect.height / 2)) * factor.y,
	};
}

export interface PreviewPoint {
	x: number;
	y: number;
}

export interface PreviewConfig {
	lerp: number;
	rotateFactor: number;
	rotateMaxDeg: number;
}

/** Index hover preview: eased follow plus a tilt from the remaining lag. */
export function previewStep(
	cur: PreviewPoint,
	mx: number,
	my: number,
	c: PreviewConfig,
): PreviewPoint & { rotateDeg: number } {
	const x = lerp(cur.x, mx, c.lerp);
	const y = lerp(cur.y, my, c.lerp);
	return {
		x,
		y,
		rotateDeg: clamp(
			(mx - x) * c.rotateFactor,
			-c.rotateMaxDeg,
			c.rotateMaxDeg,
		),
	};
}
