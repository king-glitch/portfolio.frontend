import { createRng } from "@/lib/art/rng";

export interface MotifSprout {
	x: number;
	top: number;
	leaf: string;
}
export interface MotifPixel {
	x: number;
	y: number;
	op: string;
	blink: boolean;
}
export interface MotifHex {
	pts: string;
	filled: boolean;
	op: number;
	blink: boolean;
}
export interface MotifPin {
	x: string;
	y: string;
	r: string;
	op: string;
}

/**
 * Every motif render in the prototype starts with seed 11 and draws the 9
 * sprout values first, so each kind continues the sequence after them.
 */
function seeded() {
	const rnd = createRng(11);
	const sprouts: MotifSprout[] = [];
	for (let i = 0; i < 9; i++) {
		const x = 40 + i * 40;
		const top = 236 - (10 + Math.round(rnd() * 14));
		sprouts.push({
			x,
			top,
			leaf: `M${x} ${top + 4} C ${x + 6} ${top - 2}, ${x + 12} ${top}, ${x + 12} ${top + 6}`,
		});
	}
	return { rnd, sprouts };
}

export const motifSprouts: MotifSprout[] = seeded().sprouts;

function buildPixels(): MotifPixel[] {
	const { rnd } = seeded();
	const pixels: MotifPixel[] = [];
	const cols = 9;
	const rows = 19;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const v = rnd();
			const dens = Math.pow(r / rows, 1.6) * 0.95;
			const sun = Math.hypot(c - 6, r - 3) < 1.8;
			if (v < dens || sun) {
				pixels.push({
					x: 152 + c * 11 - 2,
					y: 46 + r * 11,
					op: sun ? "1" : (0.25 + v * 0.75).toFixed(2),
					blink: v > 0.92,
				});
			}
		}
	}
	return pixels;
}

function hexOpacity(v: number): number {
	if (v < 0.1) return 0.85;
	return v < 0.55 ? 0.4 : 0.16;
}

function buildHexes(): MotifHex[] {
	const { rnd } = seeded();
	const hexes: MotifHex[] = [];
	const R = 22;
	const w = Math.sqrt(3) * R;
	for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 12; col++) {
			const cx = col * w + (row % 2 ? w / 2 : 0) - 10;
			const cy = row * R * 1.5 - 6;
			const pts: string[] = [];
			for (let k = 0; k < 6; k++) {
				const a = (Math.PI / 180) * (60 * k - 30);
				pts.push(
					`${(cx + R * 0.9 * Math.cos(a)).toFixed(1)},${(cy + R * 0.9 * Math.sin(a)).toFixed(1)}`,
				);
			}
			const v = rnd();
			hexes.push({
				pts: pts.join(" "),
				filled: v < 0.1,
				op: hexOpacity(v),
				blink: v > 0.93,
			});
		}
	}
	return hexes;
}

function buildPins(): MotifPin[] {
	const { rnd } = seeded();
	const pins: MotifPin[] = [];
	const centers = [
		[258, 138],
		[126, 176],
		[320, 220],
		[80, 70],
	];
	for (let i = 0; i < 340; i++) {
		const c = centers[i % centers.length] ?? [0, 0];
		const spread = i % 5 === 0 ? 200 : 70;
		const x =
			(c[0] ?? 0) + ((rnd() + rnd() + rnd()) / 3 - 0.5) * spread * 2;
		const y =
			(c[1] ?? 0) + ((rnd() + rnd() + rnd()) / 3 - 0.5) * spread * 1.4;
		pins.push({
			x: x.toFixed(1),
			y: y.toFixed(1),
			r: (0.8 + rnd() * 1.2).toFixed(2),
			op: (0.25 + rnd() * 0.6).toFixed(2),
		});
	}
	return pins;
}

export const motifPixels: MotifPixel[] = buildPixels();
export const motifHexes: MotifHex[] = buildHexes();
export const motifPins: MotifPin[] = buildPins();
