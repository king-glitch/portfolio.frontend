import { useEffect, useState, type RefObject } from "react";

/** True while the element intersects the viewport (grown by `rootMargin`); gates rAF engines. */
export function useInView(
	ref: RefObject<Element | null>,
	rootMargin = "0px",
	enabled = true,
): boolean {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		if (!enabled) return;
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => setInView(entry?.isIntersecting ?? false),
			{ rootMargin },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, rootMargin, enabled]);
	return enabled && inView;
}
