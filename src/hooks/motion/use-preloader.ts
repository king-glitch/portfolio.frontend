import { useEffect, useRef, useState } from "react";
import { usePreloader } from "@/contexts/preloader-context";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import { easeInOutCubic } from "@/lib/motion/lerp";

export enum PreloaderPhase {
	Counting = "counting",
	Hold = "hold",
	Out = "out",
	Done = "done",
}

/** First load only: a module flag (not storage) so a refresh plays it again, client navigation does not. */
let played = false;

/**
 * Drives the preloader: count 000..100 over `durationMs`, hold, wipe out, unmount.
 * The number and bar are written straight to the DOM (no re-render per frame).
 * `loaded` (context) flips when the wipe starts; hero animations wait on it.
 * Reduced motion skips everything.
 */
export function usePreloaderProgress() {
	const { setLoaded } = usePreloader();
	const reduced = useReducedMotion();
	const [phase, setPhase] = useState<PreloaderPhase>(
		played ? PreloaderPhase.Done : PreloaderPhase.Counting,
	);
	const numRef = useRef<HTMLSpanElement>(null);
	const barRef = useRef<HTMLDivElement>(null);
	const start = useRef<number | null>(null);
	const { durationMs, holdMs, unmountDelayMs, digits } =
		config.shell.preloader;

	useRaf(
		(_dt, t) => {
			start.current ??= t;
			const p = Math.min(1, (t - start.current) / durationMs);
			const e = easeInOutCubic(p);
			if (numRef.current)
				numRef.current.textContent = String(
					Math.round(e * 100),
				).padStart(digits, "0");
			if (barRef.current)
				barRef.current.style.transform = `scaleX(${e.toFixed(4)})`;
			if (p >= 1) setPhase(PreloaderPhase.Hold);
		},
		phase === PreloaderPhase.Counting && !reduced,
	);

	useEffect(() => {
		if (reduced || phase === PreloaderPhase.Done) {
			played = true;
			setLoaded(true);
			setPhase(PreloaderPhase.Done);
			return;
		}
		if (phase === PreloaderPhase.Hold) {
			const id = window.setTimeout(() => {
				played = true;
				setLoaded(true);
				setPhase(PreloaderPhase.Out);
			}, holdMs);
			return () => window.clearTimeout(id);
		}
		if (phase === PreloaderPhase.Out) {
			const id = window.setTimeout(
				() => setPhase(PreloaderPhase.Done),
				unmountDelayMs,
			);
			return () => window.clearTimeout(id);
		}
	}, [phase, reduced, holdMs, unmountDelayMs, setLoaded]);

	return { phase, numRef, barRef };
}
