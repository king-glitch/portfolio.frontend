import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { config } from "@/config";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import {
	easeInOut,
	feedTrack,
	initialScroller,
	isAtEnd,
	parallaxOffset,
	progressRatio,
	snapTarget,
	stepScroller,
	wheelDelta,
} from "@/lib/motion/scroller";
import type { PanelMeta, ScrollerOptions } from "@/types/work";

const cfg = config.work.scroller;

function subscribeVertical(onChange: () => void) {
	const media = window.matchMedia(config.media.horizontal);
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

interface Push {
	from: number;
	to: number;
	start: number;
}

interface Engine {
	state: ReturnType<typeof initialScroller>;
	/** Scrollable end: the last own panel (the next-project cover) fully in view. */
	max: number;
	/** Width of the next project's first panel waiting past `max`. */
	nextWidth: number;
	lastWidth: number;
	panels: PanelMeta[];
	lastX: number;
	lastWheel: number;
	/** The current wheel gesture began with the cover already fully in view. */
	gestureAtEnd: boolean;
	push: Push | null;
	done: boolean;
}

const newEngine = (): Engine => ({
	state: initialScroller(),
	max: 0,
	nextWidth: 0,
	lastWidth: 0,
	panels: [],
	lastX: Number.NaN,
	lastWheel: 0,
	gestureAtEnd: false,
	push: null,
	done: false,
});

/** Left edge inside the track, through nested positioned wrappers. */
function leftWithin(el: HTMLElement, track: HTMLElement): number {
	let x = 0;
	let node: HTMLElement | null = el;
	while (node && node !== track) {
		x += node.offsetLeft;
		node =
			node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
	}
	return x;
}

/**
 * Project scroller (Main tick() 1104, feed() 874, wheel/key 738).
 * Desktop: wheel/keys drive an eased track with parallax, writing only `transform` / `translate`.
 * The last own panel (next-project cover) snaps fully into view; only a new scroll gesture that
 * starts there pushes the next project's first panel in from the right (trackpad momentum that
 * merely arrives at the end never does). When the push lands, `onThreshold` swaps in the next
 * page, whose first panel is the one already on screen.
 * Phones and tablets (not `config.media.horizontal`): engine off, the page scrolls vertically.
 * Reduced motion: no easing, no parallax, the push navigates at once.
 */
export function useHorizontalScroller(options: ScrollerOptions) {
	const vertical = useSyncExternalStore(
		subscribeVertical,
		() => !window.matchMedia(config.media.horizontal).matches,
		() => false,
	);
	const reduced = useReducedMotion();
	const latest = useRef(options);
	const engine = useRef<Engine>(newEngine());
	useEffect(() => {
		latest.current = options;
	});

	const startPush = useCallback(() => {
		const eng = engine.current;
		if (eng.push || eng.done) return;
		if (reduced || eng.nextWidth === 0) {
			eng.done = true;
			latest.current.onThreshold();
			return;
		}
		eng.push = {
			from: eng.state.current,
			to: eng.max + eng.nextWidth,
			start: performance.now(),
		};
	}, [reduced]);

	// Rects are cached here and refreshed on ResizeObserver; never read per frame.
	useEffect(() => {
		const { viewportRef, trackRef } = latest.current;
		const vp = viewportRef.current;
		const track = trackRef.current;
		if (!vp || !track) return;
		const eng = (engine.current = newEngine());
		track.style.transform = "";

		const measure = () => {
			const next = latest.current.nextRef.current;
			eng.nextWidth = next?.offsetWidth ?? 0;
			eng.max = Math.max(
				0,
				track.scrollWidth - vp.clientWidth - eng.nextWidth,
			);
			eng.panels = Array.from(
				track.querySelectorAll<HTMLElement>("[data-panel]"),
			).map((el) => ({
				left: leftWithin(el, track),
				width: el.offsetWidth,
				layers: Array.from(
					el.querySelectorAll<HTMLElement>("[data-speed]"),
				).map((layer) => ({
					el: layer,
					speed: Number(layer.dataset.speed) || 1,
				})),
			}));
			const own = eng.panels.filter((p) => p.left < eng.max + 1);
			eng.lastWidth = own[own.length - 1]?.width ?? vp.clientWidth;
			eng.state.target = Math.min(eng.state.target, eng.max);
			eng.lastX = Number.NaN;
		};

		const feed = (d: number, fresh: boolean) => {
			if (eng.push || eng.done) return;
			if (d > 0 && isAtEnd(eng.state, eng.max, cfg)) {
				if (fresh) startPush();
				return;
			}
			eng.state = feedTrack(eng.state, d, eng.max, performance.now());
		};
		const onWheel = (e: WheelEvent) => {
			// Window-level so wheeling keeps working while a page transition overlay is up;
			// other layers (the terminal dialog) keep their own scrolling.
			const t = e.target;
			const mine =
				t === document.documentElement ||
				t === document.body ||
				(t instanceof Node && (vp.parentElement ?? vp).contains(t));
			if (!mine) return;
			e.preventDefault();
			const now = performance.now();
			if (now - eng.lastWheel > cfg.gestureGapMs)
				eng.gestureAtEnd = isAtEnd(eng.state, eng.max, cfg);
			eng.lastWheel = now;
			feed(
				wheelDelta(e, window.innerHeight, cfg.wheelLinePx),
				eng.gestureAtEnd,
			);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				latest.current.onEscape();
				return;
			}
			if (vertical) return;
			const dir = KEY_DIRECTION[e.key];
			if (!dir) return;
			e.preventDefault();
			feed(dir * window.innerWidth * cfg.keyStepViewport, !e.repeat);
		};
		const syncNative = () => {
			const bar = latest.current.barRef.current;
			const max = vp.scrollHeight - vp.clientHeight;
			if (bar)
				bar.style.transform = `scaleX(${progressRatio(vp.scrollTop, max).toFixed(4)})`;
		};

		vp.addEventListener("keydown", onKey);
		vp.focus({ preventScroll: true });
		if (vertical) {
			for (const el of track.querySelectorAll<HTMLElement>(
				"[data-speed]",
			))
				el.style.translate = "";
			vp.addEventListener("scroll", syncNative, { passive: true });
			syncNative();
			return () => {
				vp.removeEventListener("keydown", onKey);
				vp.removeEventListener("scroll", syncNative);
			};
		}

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(track);
		observer.observe(vp);
		window.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			observer.disconnect();
			vp.removeEventListener("keydown", onKey);
			window.removeEventListener("wheel", onWheel);
			for (const p of eng.panels)
				for (const l of p.layers) l.el.style.translate = "";
		};
	}, [vertical, reduced, startPush]);

	// ponytail: loop runs while mounted and bails out when settled; gate on IntersectionObserver if a page ever hosts several scrollers.
	useRaf((_dt, now) => {
		const eng = engine.current;
		const { trackRef, barRef } = latest.current;
		const track = trackRef.current;
		if (!track || eng.panels.length === 0 || eng.done) return;

		let x: number;
		const push = eng.push;
		if (push) {
			const t = (now - push.start) / cfg.pushMs;
			x = push.from + (push.to - push.from) * easeInOut(t);
			if (t >= 1) {
				eng.done = true;
				latest.current.onThreshold();
			}
		} else {
			eng.state = stepScroller(
				{
					...eng.state,
					target: snapTarget(
						eng.state,
						eng.max,
						eng.lastWidth,
						now,
						cfg,
					),
				},
				cfg,
				reduced,
			);
			x = eng.state.current;
		}
		if (x === eng.lastX) return;
		eng.lastX = x;

		track.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
		const bar = barRef.current;
		if (bar)
			bar.style.transform = `scaleX(${progressRatio(x, eng.max).toFixed(4)})`;
		if (reduced) return;
		const reach = window.innerWidth * cfg.visiblePanelViewports;
		for (const p of eng.panels) {
			if (p.left - x > reach || p.left + p.width - x < -reach) continue;
			for (const l of p.layers)
				l.el.style.translate = `${parallaxOffset(p.left, x, l.speed, cfg).toFixed(2)}px 0`;
		}
	}, !vertical);

	/** "Next project" button: the same push as a scroll (vertical: navigate at once). */
	const commit = useCallback(() => {
		if (vertical) {
			latest.current.onThreshold();
			return;
		}
		startPush();
	}, [vertical, startPush]);

	return { vertical, commit };
}
