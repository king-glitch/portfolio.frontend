import { useRef } from "react";

/** The latest defined value, kept after it turns undefined, so an overlay can animate out with its content. */
export function useRetainedValue<T>(value: T | undefined): T | undefined {
	const ref = useRef(value);
	if (value !== undefined) ref.current = value;
	return ref.current;
}
