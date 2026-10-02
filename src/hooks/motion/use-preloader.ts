import { useEffect, useRef, useState } from "react";
import { usePreloader } from "@/contexts/preloader-context";
import { useRaf } from "@/hooks/motion/use-raf";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import { easeInOutCubic } from "@/lib/motion/lerp";
import { MascotZone, type MascotHandle } from "@/types/ui";

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
 * The number, bar and status line are written straight to the DOM (no re-render per frame);
 * the mascot watches the counter, nods at each status and looks up and pops at 100.
 * `loaded` (context) flips when the wipe starts; hero animations wait on it.
 * Reduced motion skips everything.
 */
export function usePreloaderProgress(statuses: string[]) {
	const { setLoaded } = usePreloader();
	const reduced = useReducedMotion();
	const [phase, setPhase] = useState<PreloaderPhase>(
		played ? PreloaderPhase.Done : PreloaderPhase.Counting,
	);
	const numRef = useRef<HTMLSpanElement>(null);
	const barRef = useRef<HTMLDivElement>(null);
	const statusRef = useRef<HTMLSpanElement>(null);
	const mascotRef = useRef<MascotHandle>(null);
	const stage = useRef(0);
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
			// Status line steps through its stages; the mascot nods at each one.
			const next = Math.min(
				statuses.length - 1,
				Math.floor(e * statuses.length),
			);
			if (next !== stage.current) {
				stage.current = next;
				if (statusRef.current)
					statusRef.current.textContent = statuses[next] ?? "";
				mascotRef.current?.poke(1.5);
			}
			if (p >= 1) {
				// Done: it looks up at the visitor and pops.
				if (statusRef.current)
					statusRef.current.textContent =
						statuses[statuses.length - 1] ?? "";
				mascotRef.current?.setZone(MascotZone.Center, 0.25);
				mascotRef.current?.poke(9);
				setPhase(PreloaderPhase.Hold);
			}
		},
		phase === PreloaderPhase.Counting && !reduced,
	);

	// The page cannot scroll under the counter; it unlocks when the wipe starts.
	const locked =
		!reduced &&
		(phase === PreloaderPhase.Counting || phase === PreloaderPhase.Hold);
	useEffect(() => {
		if (!locked) return;
		const html = document.documentElement;
		html.style.overflow = "hidden";
		window.scrollTo(0, 0);
		return () => {
			html.style.overflow = "";
		};
	}, [locked]);

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

	return { phase, numRef, barRef, statusRef, mascotRef };
}
