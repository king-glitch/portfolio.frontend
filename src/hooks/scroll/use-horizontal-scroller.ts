import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { config } from "@/config";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import {
	feedScroll,
	initialScroller,
	parallaxOffset,
	progressRatio,
	pullRatio,
	scrollX,
	stepScroller,
} from "@/lib/motion/scroller";
import type { PanelMeta, ScrollerOptions } from "@/types/work";

const COARSE = "(pointer: coarse)";
const cfg = config.work.scroller;

function subscribeCoarse(onChange: () => void) {
	const media = window.matchMedia(COARSE);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

const KEY_DIRECTION: Record<string, number> = {
	ArrowRight: 1,
	ArrowDown: 1,
	PageDown: 1,
	" ": 1,
	ArrowLeft: -1,
	ArrowUp: -1,
	PageUp: -1,
};

interface Engine {
	state: ReturnType<typeof initialScroller>;
	max: number;
	panels: PanelMeta[];
	lefts: number[];
	lastX: number;
	lastQ: number;
	fired: boolean;
}

const newEngine = (): Engine => ({
	state: initialScroller(),
	max: 0,
	panels: [],
	lefts: [],
	lastX: Number.NaN,
	lastQ: Number.NaN,
	fired: false,
});

/**
 * Horizontal project scroller (Main tick() 1104, feed() 874, wheel/key 738).
 * Desktop: wheel/keys drive an eased track with parallax and end resistance, writing only
 * `transform` / `translate` / `clip-path`. Touch (`pointer: coarse`): engine off, native scroll-snap.
 * Reduced motion: no easing, no parallax, no clip-path animation.
 */
export function useHorizontalScroller(options: ScrollerOptions) {
	const touch = useSyncExternalStore(
		subscribeCoarse,
		() => window.matchMedia(COARSE).matches,
		() => false,
	);
	const reduced = useReducedMotion();
	const latest = useRef(options);
	const engine = useRef<Engine>(newEngine());
	useEffect(() => {
		latest.current = options;
	});

	// Rects are cached here and refreshed on ResizeObserver; never read per frame.
	useEffect(() => {
		const { viewportRef, trackRef } = latest.current;
		const vp = viewportRef.current;
		const track = trackRef.current;
		if (!vp || !track) return;
		const eng = (engine.current = newEngine());

		const measure = () => {
			eng.max = Math.max(0, track.scrollWidth - vp.clientWidth);
			eng.panels = Array.from(
				track.querySelectorAll<HTMLElement>("[data-panel]"),
			).map((el) => ({
				left: el.offsetLeft,
				width: el.offsetWidth,
				layers: Array.from(
					el.querySelectorAll<HTMLElement>("[data-speed]"),
				).map((layer) => ({
					el: layer,
					speed: Number(layer.dataset.speed) || 1,
				})),
			}));
			eng.lefts = eng.panels.map((p) => p.left);
			eng.state.target = Math.min(eng.state.target, eng.max);
			eng.lastX = Number.NaN;
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(track);
		observer.observe(vp);

		const feed = (d: number) => {
			if (eng.fired) return;
			const r = feedScroll(eng.state, d, eng.max, performance.now(), cfg);
			eng.state = r.state;
			if (r.navigate) {
				eng.fired = true;
				latest.current.onThreshold();
			}
		};
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			const d =
				Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			const scale =
				(e.deltaMode === 1 && cfg.wheelLinePx) ||
				(e.deltaMode === 2 && window.innerHeight) ||
				1;
			feed(d * scale);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				latest.current.onEscape();
				return;
			}
			const dir = KEY_DIRECTION[e.key];
			if (!dir) return;
			e.preventDefault();
			const d = dir * window.innerWidth * cfg.keyStepViewport;
			if (touch) vp.scrollBy({ left: d, behavior: "smooth" });
			else feed(d);
		};
		const syncNative = () => {
			const x = vp.scrollLeft;
			const max = vp.scrollWidth - vp.clientWidth;
			const bar = latest.current.barRef.current;
			if (bar)
				bar.style.transform = `scaleX(${progressRatio(x, max).toFixed(4)})`;
		};

		// The page root, so wheeling over the top bar scrolls too.
		const wheelHost = vp.parentElement ?? vp;
		vp.addEventListener("keydown", onKey);
		if (touch) vp.addEventListener("scroll", syncNative, { passive: true });
		else wheelHost.addEventListener("wheel", onWheel, { passive: false });
		vp.focus({ preventScroll: true });
		if (touch) syncNative();

		return () => {
			observer.disconnect();
			vp.removeEventListener("keydown", onKey);
			vp.removeEventListener("scroll", syncNative);
			wheelHost.removeEventListener("wheel", onWheel);
			for (const p of eng.panels)
				for (const l of p.layers) l.el.style.translate = "";
		};
	}, [touch]);

	// ponytail: loop runs while mounted and bails out when settled; gate on IntersectionObserver if a page ever hosts several scrollers.
	useRaf((_dt, now) => {
		const eng = engine.current;
		const { trackRef, barRef, meterRef, fillRef } = latest.current;
		const track = trackRef.current;
		if (!track || eng.panels.length === 0) return;
		eng.state = stepScroller(eng.state, now, cfg, reduced);
		if (eng.state.pull === 0) eng.fired = false;
		const x = reduced ? eng.state.current : scrollX(eng.state, cfg);
		const q = pullRatio(eng.state.pull, cfg);
		if (x === eng.lastX && q === eng.lastQ) return;
		eng.lastX = x;
		eng.lastQ = q;

		track.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
		const bar = barRef.current;
		if (bar)
			bar.style.transform = `scaleX(${progressRatio(eng.state.current, eng.max).toFixed(4)})`;
		if (!reduced) {
			const reach = window.innerWidth * cfg.visiblePanelViewports;
			for (const p of eng.panels) {
				if (p.left - x > reach || p.left + p.width - x < -reach)
					continue;
				for (const l of p.layers)
					l.el.style.translate = `${parallaxOffset(p.left, x, l.speed, cfg).toFixed(2)}px 0`;
			}
			const meter = meterRef.current;
			if (meter) meter.style.transform = `scaleX(${q.toFixed(4)})`;
			const fill = fillRef.current;
			if (fill)
				fill.style.clipPath = `inset(0 ${(100 - q * 100).toFixed(2)}% 0 0)`;
		}
	}, !touch);

	return { touch };
}
