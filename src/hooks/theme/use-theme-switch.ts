import { useCallback } from "react";
import { config } from "@/config";
import { useCompanion } from "@/contexts/companion-context";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useTheme } from "@/hooks/theme/use-theme";
import { CompanionEvent } from "@/types/ui";

/**
 * The theme toggle, driven by Void: it squashes first, then the new theme spreads from it (from the
 * button when Void is not on screen). Reduced motion swaps at once; Void still comments.
 */
export function useThemeSwitch() {
	const { theme, toggle } = useTheme();
	const { react, origin } = useCompanion();
	const reduced = useReducedMotion();
	const switchTheme = useCallback(
		(button: HTMLElement) => {
			const box = button.getBoundingClientRect();
			const from = origin() ?? {
				x: box.left + box.width / 2,
				y: box.top + box.height / 2,
			};
			if (reduced) {
				toggle();
				return;
			}
			react(CompanionEvent.Anticipate);
			window.setTimeout(
				() => toggle(from),
				config.companion.anticipationMs,
			);
		},
		[origin, react, reduced, toggle],
	);
	return { theme, switchTheme };
}
