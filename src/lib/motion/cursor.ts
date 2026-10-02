import { clamp, lerp } from "@/lib/motion/lerp";
import { CursorLabel } from "@/types/cursor";

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

export interface RingTargetInput {
	mx: number;
	my: number;
	/** Rect of the element being snapped to, if any. */
	rect: PointerRect | null;
	/** Computed corner radius of that element. */
	rectRadius: number;
	/** True while the pointer is over a `[data-cursor]` element. */
	labelled: boolean;
}

export interface RingConfig {
	ringPx: number;
	labelRingPx: number;
	snapMaxWidthPx: number;
	snapMaxHeightPx: number;
	snapPadPx: number;
	snapRadiusPadPx: number;
}

/** Pointer slack (px) before a snapped element is released. */
const SNAP_SLACK_PX = 12;

/** `data-cursor` attribute value -> label, or null when absent / unknown. */
export function toCursorLabel(value: string | null): CursorLabel | null {
	return Object.values(CursorLabel).find((label) => label === value) ?? null;
}

/** Only small links/buttons are wrapped (prototype: <= 900x240). */
export function isSnapTarget(rect: PointerRect, c: RingConfig): boolean {
	return (
		rect.width > 0 &&
		rect.width <= c.snapMaxWidthPx &&
		rect.height <= c.snapMaxHeightPx
	);
}

export function isPointerNear(
	rect: PointerRect,
	mx: number,
	my: number,
): boolean {
	return (
		mx >= rect.left - SNAP_SLACK_PX &&
		mx <= rect.left + rect.width + SNAP_SLACK_PX &&
		my >= rect.top - SNAP_SLACK_PX &&
		my <= rect.top + rect.height + SNAP_SLACK_PX
	);
}

/** Where the ring wants to be: on the snapped element, grown for a label, or the default ring on the pointer. */
export function ringTarget(
	input: RingTargetInput,
	c: RingConfig,
): RingBox & { snapping: boolean } {
	const { mx, my, rect, rectRadius, labelled } = input;
	if (rect && isPointerNear(rect, mx, my) && rect.width > 0) {
		const w = rect.width + c.snapPadPx;
		const h = rect.height + c.snapPadPx;
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
			w,
			h,
			r: Math.min(rectRadius + c.snapRadiusPadPx, h / 2),
			snapping: true,
		};
	}
	const size = labelled ? c.labelRingPx : c.ringPx;
	return { x: mx, y: my, w: size, h: size, r: size / 2, snapping: false };
}

export function stepRing(cur: RingBox, to: RingBox, k: number): RingBox {
	return {
		x: lerp(cur.x, to.x, k),
		y: lerp(cur.y, to.y, k),
		w: lerp(cur.w, to.w, k),
		h: lerp(cur.h, to.h, k),
		r: lerp(cur.r, to.r, k),
	};
}

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
