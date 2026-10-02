import { clamp } from "@/lib/motion/reveal";

export interface MarqueeConfig {
	baseSpeedPx: number;
	velocitySmoothing: number;
	velocityCap: number;
	velocityFactor: number;
	skewFactor: number;
	skewMaxDeg: number;
}

export interface MarqueeState {
	/** Smoothed scroll velocity (px/frame). */
	velocity: number;
	/** Current translateX, always in (-half, 0]. */
	offset: number;
}

/**
 * One frame of the velocity marquee: base drift plus scroll velocity, direction follows scroll
 * direction (reverses on scroll-up), wraps at `half` (the list is doubled).
 */
export function stepMarquee(
	state: MarqueeState,
	scrollDelta: number,
	half: number,
	cfg: MarqueeConfig,
): MarqueeState & { skewDeg: number } {
	const velocity =
		state.velocity + (scrollDelta - state.velocity) * cfg.velocitySmoothing;
	const dir = velocity < -0.5 ? -1 : 1;
	const speed =
		cfg.baseSpeedPx +
		Math.min(cfg.velocityCap, Math.abs(velocity)) * cfg.velocityFactor;
	let offset = state.offset - speed * dir;
	const span = half || 1;
	if (offset <= -span) offset += span;
	if (offset > 0) offset -= span;
	return {
		velocity,
		offset,
		skewDeg: clamp(
			-velocity * cfg.skewFactor,
			-cfg.skewMaxDeg,
			cfg.skewMaxDeg,
		),
	};
}
