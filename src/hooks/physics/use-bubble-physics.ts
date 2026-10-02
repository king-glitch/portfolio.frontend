import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useRaf } from "@/hooks/motion/use-raf";
import { config } from "@/config";
import { createBall, dropBalls, stepBalls, type Ball } from "@/lib/motion/physics";

const BALL = "[data-ball]";

interface Drag {
	ball: Ball;
	ox: number;
	oy: number;
	left: number;
	top: number;
}

/**
 * Gravity, bounce, collisions and drag/throw for the `[data-ball]` children of `playRef`.
 * Starts only when `enabled` (data loaded, no reduced motion): balls drop once the box is 80% in
 * view, then step only within 200px of the viewport. Rect/size cached; writes `transform` only.
 * `count` re-initialises the bodies when the number of bubbles changes. Returns `shake` (re-drop).
 */
export function useBubblePhysics(
	playRef: RefObject<HTMLElement | null>,
	count: number,
	enabled: boolean,
): { shake: () => void } {
	const balls = useRef<Ball[]>([]);
	const els = useRef<HTMLElement[]>([]);
	const size = useRef({ w: 0, h: 0 });
	const drag = useRef<Drag | null>(null);
	const [near, setNear] = useState(false);
	const [dropped, setDropped] = useState(false);

	const drop = useCallback(() => {
		dropBalls(balls.current, size.current.w, Math.random, config.home.toolkit);
		setDropped(true);
	}, []);

	useEffect(() => {
		const play = playRef.current;
		if (!play || !enabled) return;
		els.current = Array.from(play.querySelectorAll<HTMLElement>(BALL));
		balls.current = els.current.map((el) => createBall(el.offsetWidth / 2));
		size.current = { w: play.clientWidth, h: play.clientHeight };

		const resize = new ResizeObserver(() => {
			size.current = { w: play.clientWidth, h: play.clientHeight };
		});
		resize.observe(play);

		const nearObserver = new IntersectionObserver(
			([entry]) => setNear(entry?.isIntersecting ?? false),
			{ rootMargin: `${config.home.toolkit.stepMarginPx}px 0px` },
		);
		nearObserver.observe(play);

		const dropObserver = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				dropObserver.disconnect();
				drop();
			},
			{ rootMargin: `0px 0px -${(1 - config.home.toolkit.dropViewport) * 100}% 0px` },
		);
		dropObserver.observe(play);

		const onDown = (e: PointerEvent) => {
			if (!(e.target instanceof Element)) return;
			const el = e.target.closest<HTMLElement>(BALL);
			const ball = el ? balls.current[els.current.indexOf(el)] : undefined;
			if (!el || !ball) return;
			e.preventDefault();
			const r = play.getBoundingClientRect();
			drag.current = { ball, ox: e.clientX - r.left - ball.x, oy: e.clientY - r.top - ball.y, left: r.left, top: r.top };
			ball.drag = true;
			ball.vx = 0;
			ball.vy = 0;
		};
		const onMove = (e: PointerEvent) => {
			const d = drag.current;
			if (!d) return;
			const nx = e.clientX - d.left - d.ox;
			const ny = e.clientY - d.top - d.oy;
			d.ball.vx = (nx - d.ball.x) * config.home.toolkit.throwFactor;
			d.ball.vy = (ny - d.ball.y) * config.home.toolkit.throwFactor;
			d.ball.x = nx;
			d.ball.y = ny;
		};
		const onUp = () => {
			if (drag.current) drag.current.ball.drag = false;
			drag.current = null;
		};
		play.addEventListener("pointerdown", onDown);
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		return () => {
			resize.disconnect();
			nearObserver.disconnect();
			dropObserver.disconnect();
			play.removeEventListener("pointerdown", onDown);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			drag.current = null;
			setNear(false);
			setDropped(false);
		};
	}, [playRef, count, enabled, drop]);

	useRaf(() => {
		const { w, h } = size.current;
		stepBalls(balls.current, w, h, config.home.toolkit);
		balls.current.forEach((b, i) => {
			const el = els.current[i];
			if (el) el.style.transform = `translate3d(${(b.x - b.r).toFixed(1)}px,${(b.y - b.r).toFixed(1)}px,0)`;
		});
	}, enabled && near && dropped);

	return { shake: drop };
}
