import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse), (hover: none)";

function subscribe(onChange: () => void) {
	const media = window.matchMedia(QUERY);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

/** True on touch-first devices: pointer-follow engines stay off there. */
export function useCoarsePointer(): boolean {
	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false,
	);
}
