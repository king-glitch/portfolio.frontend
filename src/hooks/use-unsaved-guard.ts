import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router";

/**
 * Stops leaving a form with unsaved edits: in-app navigation to another page is blocked until the
 * user confirms (render `UnsavedChangesDialog` with the returned `blocker`), and closing or
 * reloading the tab asks the browser's own question. `allowLeave()` lets the next navigation
 * through (call it right before navigating after a save).
 */
export function useUnsavedGuard(dirty: boolean) {
	const skip = useRef(false);
	const blocker = useBlocker(
		useCallback(
			({
				currentLocation,
				nextLocation,
			}: {
				currentLocation: { pathname: string };
				nextLocation: { pathname: string };
			}) =>
				dirty &&
				!skip.current &&
				currentLocation.pathname !== nextLocation.pathname,
			[dirty],
		),
	);

	useEffect(() => {
		if (!dirty) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);

	return {
		blocker,
		allowLeave: () => {
			skip.current = true;
		},
	};
}
