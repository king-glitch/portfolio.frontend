import {
	MascotDesign,
	MascotZone,
	type MascotFace,
	type MascotOptions,
	type MascotPart,
} from "@/types/ui";

const INK = "var(--background)";
const PAPER = "var(--foreground)";

// </> as one glyph: pills 17 wide, 4.8 thick; arms at +-0.0835 meet in one round joint.
const arm = (x: number, y: number, rot: number): MascotPart => ({
	x,
	y,
	w: 17,
	h: 4.8,
	rot,
	squash: true,
});

export const MASCOT_FACES: Record<MascotDesign, MascotFace> = {
	[MascotDesign.Brackets]: {
		skull: PAPER,
		ink: INK,
		parts: [
			arm(-0.249, 0.0835, -38),
			arm(-0.249, -0.0835, 38),
			arm(0.249, 0.0835, 38),
			arm(0.249, -0.0835, -38),
			{ x: 0, y: 0, w: 4.8, h: 34, rot: 10, blink: false },
		],
	},
	// ">" from two strokes and a blinking cursor.
	[MascotDesign.Terminal]: {
		skull: INK,
		ring: PAPER,
		ink: PAPER,
		parts: [
			{ x: -0.336, y: 0.0916, w: 18, h: 4.6, rot: 38, squash: true },
			{ x: -0.336, y: -0.0916, w: 18, h: 4.6, rot: -38, squash: true },
			{ x: 0.31, y: -0.24, w: 16, h: 4.6, blink: false, flash: [5, 0] },
		],
	},
};

/** Prototype defaults. */
export const MASCOT_DEFAULTS: MascotOptions = {
	stiffness: 160,
	damping: 15,
	range: 0.1,
	zone: MascotZone.Auto,
	idle: true,
	blink: true,
};

/** Centre of each fixed gaze zone (x right, y down, -1..1). */
export const ZONE_CENTERS: Record<MascotZone, [number, number]> = {
	[MascotZone.Auto]: [0.4, -0.35],
	[MascotZone.Center]: [0, 0],
	[MascotZone.TopRight]: [0.45, -0.45],
	[MascotZone.TopLeft]: [-0.45, -0.45],
	[MascotZone.BottomRight]: [0.45, 0.45],
	[MascotZone.BottomLeft]: [-0.45, 0.45],
};
