import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useMeasure } from "@/hooks/physics/use-measure";
import { config } from "@/config";
import {
	pinExtra,
	pinHeight,
	pinProgress,
	pinTranslate,
} from "@/lib/motion/pin";

const WIDE_QUERY = `(min-width: ${config.home.habits.pinMinViewportPx}px)`;

function subscribe(onChange: () => void) {
	const media = window.matchMedia(WIDE_QUERY);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

/**
 * Horizontal scroll driven by vertical scroll over a CSS `position: sticky` stage.
 * Sets the outer height to `innerHeight + overflow`, translates the track by progress.
 * Returns whether the pin is active (viewport >= 760px and no reduced motion); otherwise the
 * caller lays the cards out vertically and nothing is written.
 */
export function usePinnedTrack(
	outerRef: RefObject<HTMLElement | null>,
	trackRef: RefObject<HTMLElement | null>,
): boolean {
	const reduced = useReducedMotion();
	const wide = useSyncExternalStore(
		subscribe,
		() => window.matchMedia(WIDE_QUERY).matches,
		() => false,
	);
	const pinned = wide && !reduced;
	const cache = useRef({ docTop: 0, height: 0, extra: 0 });

	const apply = () => {
		const track = trackRef.current;
		if (!track) return;
		const { docTop, height, extra } = cache.current;
		const progress = pinProgress(
			docTop - window.scrollY,
			height,
			window.innerHeight,
		);
		track.style.transform = `translate3d(${pinTranslate(progress, extra).toFixed(1)}px,0,0)`;
	};

	useMeasure(
		() => {
			const outer = outerRef.current;
			const track = trackRef.current;
			if (!outer || !track) return;
			const extra = pinExtra(track.scrollWidth, window.innerWidth);
			const height = pinHeight(window.innerHeight, extra);
			outer.style.height = `${height}px`;
			cache.current = {
				docTop: outer.getBoundingClientRect().top + window.scrollY,
				height,
				extra,
			};
			apply();
		},
		pinned,
		[trackRef],
	);

	useEffect(() => {
		const outer = outerRef.current;
		const track = trackRef.current;
		if (!pinned) {
			if (outer) outer.style.height = "";
			if (track) track.style.transform = "";
			return;
		}
		window.addEventListener("scroll", apply, { passive: true });
		return () => window.removeEventListener("scroll", apply);
	}, [pinned]);

	return pinned;
}
