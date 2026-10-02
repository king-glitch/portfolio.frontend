import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { config } from "@/config";

/**
 * Scrolls to a home section. On another route it navigates home with the hash
 * (ScrollRestoration lands on the element) through a view transition.
 */
export function useGoSection() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const reduced = useReducedMotion();

	return useCallback(
		(id: string) => {
			if (pathname !== config.routes.home) {
				void navigate(
					{ pathname: config.routes.home, hash: `#${id}` },
					{ viewTransition: true },
				);
				return;
			}
			const behavior = reduced ? "auto" : "smooth";
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ behavior });
			else if (id === config.sections.top)
				window.scrollTo({ top: 0, behavior });
		},
		[pathname, navigate, reduced],
	);
}
