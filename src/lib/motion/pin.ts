import { clamp01 } from "@/lib/motion/reveal";

/** Pinned horizontal track maths (design/Main.dc.html measure() line 1005 and tick() line 1190). */

/** Horizontal distance the track must travel: its overflow beyond the viewport. */
export function pinExtra(trackScrollWidth: number, viewportWidth: number): number {
	return Math.max(0, trackScrollWidth - viewportWidth);
}

/** Outer section height: one viewport (the sticky stage) plus the sideways travel. */
export function pinHeight(viewportHeight: number, extra: number): number {
	return viewportHeight + extra;
}

/** 0..1 progress of the sticky stage; `top` is the outer section's viewport-relative top. */
export function pinProgress(top: number, height: number, viewportHeight: number): number {
	return clamp01(-top / Math.max(1, height - viewportHeight));
}

export function pinTranslate(progress: number, extra: number): number {
	return -progress * extra;
}
