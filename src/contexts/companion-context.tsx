import React from "react";
import { onCompanion } from "@/lib/companion";
import type { CompanionEvent, CompanionTarget, Point } from "@/types/ui";

interface CompanionContextValue {
	/** Void flinches and comments; no-op while it is not mounted. */
	react: (event: CompanionEvent) => void;
	/** Centre of Void, or undefined while it is not on screen. */
	origin: () => Point | undefined;
	/** Called by the mounted `Companion`; returns the detach. */
	attach: (target: CompanionTarget) => () => void;
}

const CompanionContext = React.createContext<CompanionContextValue | null>(
	null,
);

interface CompanionProviderProps {
	children: React.ReactNode;
}

/**
 * Lets any component poke Void or ask where it is, without re-rendering anything: the value never
 * changes, it forwards to whatever `Companion` registered. Mutation results arrive through
 * `announceCompanion`.
 */
export const CompanionProvider: React.FC<CompanionProviderProps> = ({
	children,
}) => {
	const target = React.useRef<CompanionTarget | null>(null);
	const value = React.useMemo<CompanionContextValue>(
		() => ({
			react: (event) => target.current?.react(event),
			origin: () => target.current?.origin(),
			attach: (next) => {
				target.current = next;
				return () => {
					if (target.current === next) target.current = null;
				};
			},
		}),
		[],
	);
	React.useEffect(
		() => onCompanion((event) => target.current?.react(event)),
		[],
	);
	return (
		<CompanionContext.Provider value={value}>
			{children}
		</CompanionContext.Provider>
	);
};

export function useCompanion(): CompanionContextValue {
	const context = React.useContext(CompanionContext);
	if (!context)
		throw new Error("useCompanion must be used inside CompanionProvider");
	return context;
}

export default CompanionProvider;
