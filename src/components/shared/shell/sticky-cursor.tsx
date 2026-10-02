import React from "react";
import { useTranslation } from "react-i18next";
import { useStickyCursor } from "@/hooks/pointer/use-sticky-cursor";
import { cn } from "@/lib/utils";

interface StickyCursorProps {}

/** Ring + dot (prototype CURSOR). Not mounted on `(hover: none)`; text colours are literal white/black because the blend mode inverts them. */
export const StickyCursor: React.FC<StickyCursorProps> = () => {
	const { t } = useTranslation();
	const { enabled, ringRef, dotRef, label } = useStickyCursor();
	if (!enabled) return null;

	return (
		<>
			<div
				ref={ringRef}
				aria-hidden="true"
				className={cn(
					"pointer-events-none fixed top-0 left-0 z-500 box-border flex size-9 items-center justify-center rounded-full border border-white text-xs font-semibold tracking-[0.02em] text-transparent mix-blend-difference transition-[background-color,color] duration-300 will-change-transform",
					label && "bg-white text-black",
				)}
				style={{ transform: "translate3d(-200px,-200px,0)" }}
			>
				{label ? t(`common.cursor.${label}`) : null}
			</div>
			<div
				ref={dotRef}
				aria-hidden="true"
				className="pointer-events-none fixed top-0 left-0 z-501 size-1.5 rounded-full bg-white mix-blend-difference transition-opacity duration-300"
				style={{ transform: "translate3d(-200px,-200px,0)" }}
			/>
		</>
	);
};

export default StickyCursor;
