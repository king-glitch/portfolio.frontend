import { useCallback, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";
import { Theme } from "@/types/ui";

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

/** Where the new theme starts spreading from (viewport px). */
interface ThemeOrigin {
	x: number;
	y: number;
}

/**
 * Current theme from the `dark` class on <html> (set before paint by `themeScript`) and a persisted
 * toggle. With `origin`, the new theme spreads from that point as a circle (View Transitions API;
 * `html[data-vt="theme"]` in main.css); without it, or with reduced motion, it swaps at once.
 */
export function useTheme() {
	const theme = useSyncExternalStore(subscribe, read, () => Theme.Dark);
	const reduced = useReducedMotion();
	const toggle = useCallback(
		(origin?: ThemeOrigin) => {
			const next = read() === Theme.Dark ? Theme.Light : Theme.Dark;
			const root = document.documentElement;
			const apply = () => {
				root.classList.toggle(
					config.theme.darkClass,
					next === Theme.Dark,
				);
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
			void document
				.startViewTransition(apply)
				.finished.finally(() => delete root.dataset.vt);
		},
		[reduced],
	);
	return { theme, toggle };
}
