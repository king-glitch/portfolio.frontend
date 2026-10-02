import React from "react";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CursorLabel } from "@/types/cursor";
import { PillSize, PillVariant } from "@/types/ui";

const pillVariants = cva(
	"rounded-pill px-5 font-semibold transition-[background-color,color,transform] duration-300 data-magnetic:duration-500 data-magnetic:ease-(--ease-out-expo)",
	{
		variants: {
			variant: {
				[PillVariant.Solid]:
					"bg-foreground text-background hover:bg-foreground/85",
				[PillVariant.Outline]:
					"bg-transparent text-foreground shadow-[inset_0_0_0_1px_var(--foreground)] hover:bg-foreground hover:text-background",
				[PillVariant.Ghost]:
					"bg-transparent text-foreground hover:bg-muted",
				[PillVariant.Invert]:
					"bg-background text-foreground hover:bg-background/85",
			},
			size: {
				[PillSize.Sm]: "h-8 text-xs",
				[PillSize.Md]: "h-9.5 text-sm",
				[PillSize.Lg]: "h-11 text-sm",
				[PillSize.Xl]: "h-11.5 text-base",
			},
		},
	},
);

interface PillButtonProps extends Omit<
	React.ComponentProps<typeof Button>,
	"variant" | "size"
> {
	variant?: PillVariant;
	size?: PillSize;
	/** Pulls toward the cursor (`data-magnetic`, handled by StickyCursor). */
	magnetic?: boolean;
	/** Label shown in the cursor ring (`data-cursor`). */
	cursor?: CursorLabel;
}

/** Design-system pill (prototype `.tap`). Heights: sm 32, md 38, lg 44, xl 46. */
export const PillButton: React.FC<PillButtonProps> = ({
	variant = PillVariant.Solid,
	size = PillSize.Md,
	magnetic,
	cursor,
	className,
	...props
}) => {
	return (
		<Button
			data-magnetic={magnetic ? "" : undefined}
			data-cursor={cursor}
			className={cn(pillVariants({ variant, size }), className)}
			{...props}
		/>
	);
};

export default PillButton;
