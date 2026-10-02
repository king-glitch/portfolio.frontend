import { config } from "@/config";

type WallConfig = typeof config.about.wall;

export interface WallGeometry {
	unit: number;
	gap: number;
	width: number;
	height: number;
	radius: number;
}

export interface CellRect {
	x: number;
	y: number;
	w: number;
	h: number;
	cx: number;
	cy: number;
}

export interface TileFx {
	opacity: number;
	scale: number;
	x: number;
	y: number;
}

export interface PanState {
	/** Target position. */
	tx: number;
	ty: number;
	/** Velocity, px per frame. */
	vx: number;
	vy: number;
	/** Camera (eased toward the target). */
	cx: number;
	cy: number;
}

export interface PanBounds {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Cell size by viewport width: 200 / 176 / 148. */
export function wallUnit(vw: number, cfg: WallConfig = config.about.wall) {
	if (vw >= cfg.desktopMinPx) return cfg.unitPx.desktop;
	return vw >= cfg.tabletMinPx ? cfg.unitPx.tablet : cfg.unitPx.mobile;
}

export function wallGeometry(
	vw: number,
	cfg: WallConfig = config.about.wall,
): WallGeometry {
	const unit = wallUnit(vw, cfg);
	const gap = Math.round(unit * cfg.gapRatio);
	return {
		unit,
		gap,
		width: cfg.cols * unit + (cfg.cols - 1) * gap,
		height: cfg.rows * unit + (cfg.rows - 1) * gap,
		radius: Math.round(unit * 0.14),
	};
}

export function cellRect(
	cell: { col: number; row: number; cols: number; rows: number },
	g: Pick<WallGeometry, "unit" | "gap">,
): CellRect {
	const x = cell.col * (g.unit + g.gap);
	const y = cell.row * (g.unit + g.gap);
	const w = cell.cols * g.unit + (cell.cols - 1) * g.gap;
	const h = cell.rows * g.unit + (cell.rows - 1) * g.gap;
	return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

/**
 * Per-tile effect. `d` is the tile centre's distance from the viewport centre over
 * `0.62 * max(vw, vh)`. `introS` is seconds since the ripple started (Infinity = done).
 */
export function tileFx(
	input: {
		tileX: number;
		tileY: number;
		camX: number;
		camY: number;
		vw: number;
		vh: number;
		introS: number;
	},
	cfg: WallConfig = config.about.wall,
): TileFx {
	const f = cfg.falloff;
	const sx = input.camX + input.tileX - input.vw / 2;
	const sy = input.camY + input.tileY - input.vh / 2;
	const d = Math.hypot(sx, sy) / (Math.max(input.vw, input.vh) * f.radiusRatio);
	const reveal = clamp01(
		(input.introS - d * cfg.ripple.staggerS) / cfg.ripple.durationS,
	);
	const eased = 1 - (1 - reveal) ** 3;
	const pull = f.pull * Math.min(cfg.pullMax, d);
	return {
		opacity: clamp01(f.opacityBase - d * f.opacitySlope) * eased,
		scale:
			(1 - f.scaleDrop * clamp01(d - f.scaleStart)) *
			(cfg.ripple.startScale + (1 - cfg.ripple.startScale) * eased),
		x: -sx * pull,
		y: -sy * pull,
	};
}

/** Resting limits of the wall position: wall edge may sit 30% of the viewport inside. */
export function panBounds(
	vw: number,
	vh: number,
	g: Pick<WallGeometry, "width" | "height">,
	cfg: WallConfig = config.about.wall,
): PanBounds {
	const padX = vw * cfg.rubberBandRatio;
	const padY = vh * cfg.rubberBandRatio;
	return {
		minX: vw - g.width - padX,
		maxX: padX,
		minY: vh - g.height - padY,
		maxY: padY,
	};
}

/** Position that puts wall point (x, y) at the viewport centre. */
export function centerOn(
	vw: number,
	vh: number,
	x: number,
	y: number,
	offsetY = 0,
) {
	return { x: vw / 2 - x, y: vh / 2 - y + offsetY };
}

function springBack(pos: number, min: number, max: number, k: number) {
	if (pos > max) return pos + (max - pos) * k;
	return pos < min ? pos + (min - pos) * k : pos;
}

function decay(v: number, cfg: WallConfig) {
	const next = v * cfg.inertia;
	return Math.abs(next) < cfg.stopBelowPx ? 0 : next;
}

/**
 * One frame: inertia (x0.93, stops under 0.1px), rubber band spring toward the
 * 30% limit once released, camera ease. Reduced motion: no inertia, snap to limits,
 * camera follows instantly.
 */
export function stepPan(
	s: PanState,
	b: PanBounds,
	o: { dragging: boolean; reduced: boolean },
	cfg: WallConfig = config.about.wall,
): PanState {
	let { tx, ty, vx, vy } = s;
	if (!o.dragging) {
		if (o.reduced) {
			vx = 0;
			vy = 0;
		} else {
			tx += vx;
			ty += vy;
			vx = decay(vx, cfg);
			vy = decay(vy, cfg);
		}
		if (o.reduced) {
			tx = Math.min(b.maxX, Math.max(b.minX, tx));
			ty = Math.min(b.maxY, Math.max(b.minY, ty));
		} else {
			tx = springBack(tx, b.minX, b.maxX, cfg.springBack);
			ty = springBack(ty, b.minY, b.maxY, cfg.springBack);
		}
	}
	const k = o.reduced ? 1 : cfg.follow;
	return {
		tx,
		ty,
		vx,
		vy,
		cx: s.cx + (tx - s.cx) * k,
		cy: s.cy + (ty - s.cy) * k,
	};
}

/** Minimap scale and box for a wall, `maxW` wide. */
export function minimapBox(
	g: Pick<WallGeometry, "width" | "height">,
	maxW: number,
) {
	const scale = maxW / g.width;
	return { scale, width: maxW, height: Math.round(g.height * scale) };
}
