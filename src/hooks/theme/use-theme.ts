import { useCallback, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import { Theme, type Point } from "@/types/ui";

function subscribe(onChange: () => void) {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	return () => observer.disconnect();
}

const read = () =>
	document.documentElement.classList.contains(config.theme.darkClass)
		? Theme.Dark
		: Theme.Light;

/**
 * Current theme from the `dark` class on <html> (set before paint by `themeScript`) and a persisted
 * toggle. With `origin`, the new theme spreads from that point as a circle (View Transitions API;
 * `html[data-vt="theme"]` in main.css); without it, or with reduced motion, it swaps at once.
 */
export function useTheme() {
	const theme = useSyncExternalStore(subscribe, read, () => Theme.Dark);
	const reduced = useReducedMotion();
	const toggle = useCallback(
		(origin?: Point) => {
			const next = read() === Theme.Dark ? Theme.Light : Theme.Dark;
			const root = document.documentElement;
			const apply = () => {
				// Freeze every CSS transition for the swap: otherwise each `transition-colors`
				// element fades on its own clock and the switch smears (reads as lag).
				const freeze = document.createElement("style");
				freeze.textContent =
					"*,*::before,*::after{transition:none!important}";
				document.head.append(freeze);
				root.classList.toggle(
					config.theme.darkClass,
					next === Theme.Dark,
				);
				void root.offsetHeight; // commit the new colours with transitions off
				requestAnimationFrame(() => freeze.remove());
				try {
					localStorage.setItem(config.theme.storageKey, next);
				} catch {
					// storage blocked: the choice still applies for this visit
				}
			};
			if (!origin || reduced || !document.startViewTransition) {
				apply();
				return;
			}
			root.dataset.vt = "theme";
			root.style.setProperty("--vt-x", `${origin.x}px`);
			root.style.setProperty("--vt-y", `${origin.y}px`);
			// farthest corner, a bit over: the bounce easing then dips back visibly before it settles
			const reach = Math.hypot(
				Math.max(origin.x, innerWidth - origin.x),
				Math.max(origin.y, innerHeight - origin.y),
			);
			root.style.setProperty(
				"--vt-r",
				`${Math.ceil(reach * config.theme.spreadReach)}px`,
			);
			void document
				.startViewTransition(apply)
				.finished.finally(() => delete root.dataset.vt);
		},
		[reduced],
	);
	return { theme, toggle };
}
