import { useCallback, useSyncExternalStore } from "react";
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

/** Current theme from the `dark` class on <html> (set before paint by `themeScript`) and a persisted toggle. */
export function useTheme() {
	const theme = useSyncExternalStore(subscribe, read, () => Theme.Dark);
	const toggle = useCallback(() => {
		const next = read() === Theme.Dark ? Theme.Light : Theme.Dark;
		document.documentElement.classList.toggle(
			config.theme.darkClass,
			next === Theme.Dark,
		);
		try {
			localStorage.setItem(config.theme.storageKey, next);
		} catch {
			// storage blocked: the choice still applies for this visit
		}
	}, []);
	return { theme, toggle };
}
