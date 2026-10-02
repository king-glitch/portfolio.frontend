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

interface Engine {
	state: ReturnType<typeof initialScroller>;
	max: number;
	panels: PanelMeta[];
	lastX: number;
	/** Curtain progress actually drawn (eases toward the pull ratio, or 1 once committed). */
	shownQ: number;
	lastQ: number;
	/** The pull reached the threshold: input is ignored while the track snaps and the curtain leaves. */
	committed: boolean;
	done: boolean;
}

const newEngine = (): Engine => ({
	state: initialScroller(),
	max: 0,
	panels: [],
	lastX: Number.NaN,
	shownQ: 0,
	lastQ: Number.NaN,
	committed: false,
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
 * Desktop: wheel/keys drive an eased track with parallax and end resistance, writing only
 * `transform` / `translate`. Pulling past the end slides the next-project curtain away; at the
 * threshold the track snaps back, the curtain finishes leaving and `onThreshold` swaps in the next
 * page, whose first panel is the one already on screen.
 * Phones and tablets (not `config.media.horizontal`): engine off, the page scrolls vertically like a normal page.
 * Reduced motion: no easing, no parallax, the threshold navigates at once.
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

	// Rects are cached here and refreshed on ResizeObserver; never read per frame.
	useEffect(() => {
		const { viewportRef, trackRef } = latest.current;
		const vp = viewportRef.current;
		const track = trackRef.current;
		if (!vp || !track) return;
		const eng = (engine.current = newEngine());
		track.style.transform = "";

		const measure = () => {
			eng.max = Math.max(0, track.scrollWidth - vp.clientWidth);
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
			eng.state.target = Math.min(eng.state.target, eng.max);
			eng.lastX = Number.NaN;
		};

		const feed = (d: number) => {
			if (eng.committed) return;
			const r = feedScroll(eng.state, d, eng.max, performance.now(), cfg);
			eng.state = r.state;
			if (!r.navigate) return;
			eng.committed = true;
			if (reduced) {
				eng.done = true;
				latest.current.onThreshold();
			}
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
			if (vertical) return;
			const dir = KEY_DIRECTION[e.key];
			if (!dir) return;
			e.preventDefault();
			feed(dir * window.innerWidth * cfg.keyStepViewport);
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
	}, [vertical, reduced]);

	// ponytail: loop runs while mounted and bails out when settled; gate on IntersectionObserver if a page ever hosts several scrollers.
	useRaf((_dt, now) => {
		const eng = engine.current;
		const { trackRef, barRef, meterRef, curtainRef } = latest.current;
		const track = trackRef.current;
		if (!track || eng.panels.length === 0 || eng.done) return;
		if (eng.committed) {
			eng.state = {
				...eng.state,
				target: eng.max,
				pull:
					eng.state.pull < cfg.pullZeroBelowPx
						? 0
						: eng.state.pull * cfg.commitDecay,
			};
		}
		eng.state = stepScroller(eng.state, now, cfg, reduced);
		const goal = eng.committed ? 1 : pullRatio(eng.state.pull, cfg);
		eng.shownQ += (goal - eng.shownQ) * cfg.curtainLerp;
		if (Math.abs(goal - eng.shownQ) < cfg.curtainEpsilon) eng.shownQ = goal;

		const x = reduced ? eng.state.current : scrollX(eng.state, cfg);
		const q = eng.shownQ;
		if (
			eng.committed &&
			q === 1 &&
			eng.state.pull === 0 &&
			eng.max - eng.state.current < cfg.endEpsilonPx
		) {
			eng.done = true;
			latest.current.onThreshold();
		}
		if (x === eng.lastX && q === eng.lastQ) return;
		eng.lastX = x;
		eng.lastQ = q;

		track.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
		const bar = barRef.current;
		if (bar)
			bar.style.transform = `scaleX(${progressRatio(eng.state.current, eng.max).toFixed(4)})`;
		const meter = meterRef.current;
		if (meter) meter.style.transform = `scaleX(${q.toFixed(4)})`;
		const curtain = curtainRef.current;
		if (curtain) curtain.style.translate = `${(-q * 100).toFixed(3)}% 0`;
		if (reduced) return;
		const reach = window.innerWidth * cfg.visiblePanelViewports;
		for (const p of eng.panels) {
			if (p.left - x > reach || p.left + p.width - x < -reach) continue;
			for (const l of p.layers)
				l.el.style.translate = `${parallaxOffset(p.left, x, l.speed, cfg).toFixed(2)}px 0`;
		}
	}, !vertical);

	/** "Next project" button: run the same hand-off as a full pull (vertical: navigate at once). */
	const commit = useCallback(() => {
		const eng = engine.current;
		if (vertical || reduced) {
			latest.current.onThreshold();
			return;
		}
		eng.committed = true;
	}, [vertical, reduced]);

	return { vertical, commit };
}
