import {
	useEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import {
	centerOn,
	panBounds,
	stepPan,
	tileFx,
	wallGeometry,
	type PanState,
	type WallGeometry,
} from "@/lib/motion/wall";

const wall = config.about.wall;

function subscribe(onChange: () => void) {
	window.addEventListener("resize", onChange);
	return () => window.removeEventListener("resize", onChange);
}

/** Wall geometry for the current window width (unit 200 / 176 / 148). */
export function useWallGeometry(): WallGeometry {
	const width = useSyncExternalStore(
		subscribe,
		() => window.innerWidth,
		() => wall.desktopMinPx,
	);
	return useMemo(() => wallGeometry(width), [width]);
}

interface TileItem {
	el: HTMLElement;
	cx: number;
	cy: number;
	fx: string;
}

interface PanInput {
	geometry: WallGeometry;
	/** Hero tile centre in wall coordinates. */
	hero: { x: number; y: number };
	/** Minimap scale (0 = no minimap). */
	miniScale: number;
}

/**
 * Drag / wheel / touch / arrow-key pan of the Explore wall. One rAF loop (paused by
 * `useRaf` while the tab is hidden, gone on unmount) writes the wall, tile and
 * minimap transforms straight to the DOM; React state only holds the "dragged" hint flag.
 */
export function usePanWall({ geometry, hero, miniScale }: PanInput) {
	const reduced = useReducedMotion();
	const viewportRef = useRef<HTMLDivElement>(null);
	const wallRef = useRef<HTMLDivElement>(null);
	const miniRef = useRef<HTMLSpanElement>(null);
	const [dragged, setDragged] = useState(false);

	const pan = useRef<PanState>({ tx: 0, ty: 0, vx: 0, vy: 0, cx: 0, cy: 0 });
	const drag = useRef<{
		x: number;
		y: number;
		tx: number;
		ty: number;
		lx: number;
		ly: number;
		lt: number;
	} | null>(null);
	const moved = useRef(0);
	const items = useRef<TileItem[]>([]);
	const introStart = useRef<number | null>(null);
	const live = useRef({ geometry, hero, miniScale, reduced });
	useEffect(() => {
		live.current = { geometry, hero, miniScale, reduced };
	});

	const touched = () => setDragged(true);

	const size = () => {
		const el = viewportRef.current;
		return {
			vw: el?.clientWidth ?? window.innerWidth,
			vh: el?.clientHeight ?? window.innerHeight,
		};
	};

	const recenter = (jump = false) => {
		const { vw, vh } = size();
		const p = centerOn(
			vw,
			vh,
			live.current.hero.x,
			live.current.hero.y,
			wall.recenterOffsetYPx,
		);
		pan.current = {
			...pan.current,
			tx: p.x,
			ty: p.y,
			vx: 0,
			vy: 0,
			cx: jump || live.current.reduced ? p.x : pan.current.cx,
			cy: jump || live.current.reduced ? p.y : pan.current.cy,
		};
	};

	/** Cache tile centres (after mount and on resize), jump to the hero. */
	useEffect(() => {
		const root = wallRef.current;
		if (!root) return;
		items.current = Array.from(
			root.querySelectorAll<HTMLElement>("[data-tile]"),
		).map((el) => ({
			el,
			cx: Number(el.dataset.cx),
			cy: Number(el.dataset.cy),
			fx: "",
		}));
		recenter(true);
		introStart.current ??= performance.now();
	}, [geometry]);

	useEffect(() => {
		const el = viewportRef.current;
		if (!el) return;
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			let dx = e.deltaX;
			let dy = e.deltaY;
			if (e.deltaMode === 1) {
				dx *= wall.wheelLinePx;
				dy *= wall.wheelLinePx;
			}
			if (e.shiftKey && !dx) {
				dx = dy;
				dy = 0;
			}
			pan.current = {
				...pan.current,
				tx: pan.current.tx - dx,
				ty: pan.current.ty - dy,
				vx: 0,
				vy: 0,
			};
			touched();
		};
		const onMove = (e: PointerEvent) => {
			const d = drag.current;
			if (!d) return;
			const now = performance.now();
			const dt = Math.max(1, now - d.lt);
			pan.current = {
				...pan.current,
				tx: d.tx + (e.clientX - d.x),
				ty: d.ty + (e.clientY - d.y),
				vx: ((e.clientX - d.lx) / dt) * wall.dragFrameMs,
				vy: ((e.clientY - d.ly) / dt) * wall.dragFrameMs,
			};
			d.lx = e.clientX;
			d.ly = e.clientY;
			d.lt = now;
			moved.current = Math.max(
				moved.current,
				Math.hypot(e.clientX - d.x, e.clientY - d.y),
			);
			if (moved.current > wall.dragThresholdPx) touched();
		};
		const onUp = () => {
			if (!drag.current) return;
			drag.current = null;
			el.removeAttribute("data-dragging");
			// the click that ends a drag fires before this timeout
			setTimeout(() => {
				moved.current = 0;
			}, 0);
		};
		// Browsers scroll an overflow:hidden box to a focused child; keep it at 0.
		const onScroll = () => el.scrollTo(0, 0);
		el.addEventListener("wheel", onWheel, { passive: false });
		el.addEventListener("scroll", onScroll);
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		return () => {
			el.removeEventListener("wheel", onWheel);
			el.removeEventListener("scroll", onScroll);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
		};
	}, []);

	useRaf(() => {
		const el = viewportRef.current;
		const root = wallRef.current;
		if (!el || !root) return;
		const { vw, vh } = size();
		const g = live.current.geometry;
		pan.current = stepPan(pan.current, panBounds(vw, vh, g), {
			dragging: drag.current !== null,
			reduced: live.current.reduced,
		});
		const { cx, cy } = pan.current;
		root.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
		const introS = live.current.reduced
			? Number.POSITIVE_INFINITY
			: (performance.now() - (introStart.current ?? performance.now())) /
				1000;
		for (const it of items.current) {
			const fx = tileFx({
				tileX: it.cx,
				tileY: it.cy,
				camX: cx,
				camY: cy,
				vw,
				vh,
				introS,
			});
			// Reduced motion: static, full opacity and scale, no distance falloff.
			const next = live.current.reduced
				? "1|1|0|0"
				: `${fx.opacity.toFixed(3)}|${fx.scale.toFixed(4)}|${fx.x.toFixed(1)}|${fx.y.toFixed(1)}`;
			if (next === it.fx) continue;
			it.fx = next;
			const [o, s, x, y] = next.split("|");
			it.el.style.opacity = o ?? "1";
			it.el.style.transform = `translate3d(${x}px,${y}px,0) scale(${s})`;
		}
		const mini = miniRef.current;
		const ms = live.current.miniScale;
		if (mini && ms) {
			mini.style.transform = `translate3d(${(-cx * ms).toFixed(1)}px,${(-cy * ms).toFixed(1)}px,0)`;
			mini.style.width = `${(vw * ms).toFixed(1)}px`;
			mini.style.height = `${(vh * ms).toFixed(1)}px`;
		}
	});

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0) return;
		drag.current = {
			x: e.clientX,
			y: e.clientY,
			tx: pan.current.tx,
			ty: pan.current.ty,
			lx: e.clientX,
			ly: e.clientY,
			lt: performance.now(),
		};
		moved.current = 0;
		pan.current = { ...pan.current, vx: 0, vy: 0 };
		e.currentTarget.setAttribute("data-dragging", "");
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		const step = live.current.geometry.unit * wall.arrowStepUnits;
		const dir: Record<string, [number, number]> = {
			ArrowLeft: [step, 0],
			ArrowRight: [-step, 0],
			ArrowUp: [0, step],
			ArrowDown: [0, -step],
		};
		const delta = dir[e.key];
		if (e.key === "Home") {
			e.preventDefault();
			recenter();
		} else if (delta) {
			e.preventDefault();
			pan.current = {
				...pan.current,
				tx: pan.current.tx + delta[0],
				ty: pan.current.ty + delta[1],
				vx: 0,
				vy: 0,
			};
			touched();
		}
	};

	/** Keyboard focus on a tile pulls it to the centre (mouse focus does not). */
	const onFocusCapture = (e: React.FocusEvent<HTMLDivElement>) => {
		if (!e.target.matches(":focus-visible")) return;
		const tile = e.target.closest<HTMLElement>("[data-tile]");
		if (!tile) return;
		const { vw, vh } = size();
		const p = centerOn(
			vw,
			vh,
			Number(tile.dataset.cx),
			Number(tile.dataset.cy),
		);
		pan.current = { ...pan.current, tx: p.x, ty: p.y, vx: 0, vy: 0 };
		touched();
	};

	return {
		viewportRef,
		wallRef,
		miniRef,
		dragged,
		recenter: () => recenter(),
		/** True while the pointer has dragged past the click guard (6px). */
		wasDragged: () => moved.current > wall.dragThresholdPx,
		viewportProps: { onPointerDown, onKeyDown, onFocusCapture },
	};
}
