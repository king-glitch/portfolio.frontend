import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { useStickyCursor } from "@/hooks/pointer/use-sticky-cursor";
import { CursorMode } from "@/types/cursor";

const ringVariants = cva(
	"pointer-events-none fixed top-0 left-0 z-500 box-border flex items-center justify-center overflow-hidden text-xs font-semibold tracking-[0.02em] whitespace-nowrap mix-blend-difference transition-[background-color,color,opacity,border-color] duration-300 will-change-transform print:hidden",
	{
		variants: {
			mode: {
				[CursorMode.Idle]:
					"border border-white bg-transparent text-transparent",
				[CursorMode.Hover]:
					"border border-white bg-white text-transparent",
				[CursorMode.Label]: "border border-white bg-white text-black",
				[CursorMode.Text]: "border-0 bg-white text-transparent",
			},
			visible: { true: "opacity-100", false: "opacity-0" },
		},
	},
);

const dotVariants = cva(
	"pointer-events-none fixed top-0 left-0 z-501 size-1.5 rounded-full bg-white mix-blend-difference transition-opacity duration-200 print:hidden",
	{
		variants: {
			shown: { true: "opacity-100", false: "opacity-0" },
		},
	},
);

interface StickyCursorProps {}

/** Ring + dot (prototype CURSOR, refined). Not mounted on `(hover: none)`; colours are literal white because the blend mode inverts them. */
export const StickyCursor: React.FC<StickyCursorProps> = () => {
	const { t } = useTranslation();
	const { enabled, ringRef, dotRef, mode, label, visible } =
		useStickyCursor();
	if (!enabled) return null;

	return (
		<>
			<div
				ref={ringRef}
				aria-hidden="true"
				className={ringVariants({ mode, visible })}
				style={{ transform: "translate3d(-200px,-200px,0)" }}
			>
				{label ? t(`common.cursor.${label}`) : null}
			</div>
			<div
				ref={dotRef}
				aria-hidden="true"
				className={dotVariants({
					shown: visible && mode === CursorMode.Idle,
				})}
				style={{ transform: "translate3d(-200px,-200px,0)" }}
			/>
		</>
	);
};

export default StickyCursor;
