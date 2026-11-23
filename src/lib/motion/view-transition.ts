import { flushSync } from "react-dom";

/**
 * Runs a React state `update` inside a View Transition so named elements morph (FLIP) to
 * their new layout. `kind` lands on `<html data-vt>` for the duration, so CSS can scope the
 * transition (see `html[data-vt="toolkit"]` in main.css). Without the API, or with reduced
 * motion, the update just applies. `anchor`, when given, keeps its viewport position across
 * the update (content removed above it would otherwise yank the page).
 */
export function morph(
	kind: string,
	update: () => void,
	reduced: boolean,
	anchor?: HTMLElement | null,
): void {
	const apply = () => {
		const before = anchor?.getBoundingClientRect().top;
		flushSync(update);
		if (anchor && before !== undefined)
			window.scrollBy(0, anchor.getBoundingClientRect().top - before);
	};
	if (reduced || !document.startViewTransition) {
		apply();
		return;
	}
	const root = document.documentElement;
	root.dataset.vt = kind;
	void document.startViewTransition(apply).finished.finally(() => {
		if (root.dataset.vt === kind) delete root.dataset.vt;
	});
}
