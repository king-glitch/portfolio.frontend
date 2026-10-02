import React from "react";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CursorLabel } from "@/types/cursor";
import { PillSize, PillVariant } from "@/types/ui";

const pillVariants = cva(
	"rounded-pill border-0 font-semibold transition-[background-color,color,box-shadow,transform] duration-300 data-magnetic:duration-500 data-magnetic:ease-(--ease-out-expo)",
	{
		variants: {
			variant: {
				[PillVariant.Solid]:
					"bg-foreground text-background hover:bg-foreground hover:text-background",
				[PillVariant.Outline]:
					"bg-transparent text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-foreground hover:text-background",
				[PillVariant.Strong]:
					"bg-transparent text-foreground shadow-[inset_0_0_0_1px_var(--foreground)] hover:bg-foreground hover:text-background",
				[PillVariant.Muted]:
					"bg-transparent text-foreground shadow-[inset_0_0_0_1px_rgb(127_127_127/0.45)] hover:bg-foreground hover:text-background",
				[PillVariant.Ghost]:
					"bg-transparent text-current hover:bg-transparent hover:text-current dark:hover:bg-transparent",
				[PillVariant.Invert]:
					"bg-background text-foreground hover:bg-background hover:text-foreground",
			},
			size: {
				[PillSize.Sm]: "h-10 px-4 text-[13px]",
				[PillSize.Md]: "h-11 px-4.5 text-sm",
				[PillSize.Lg]: "h-12 px-5.5 text-sm",
				[PillSize.Xl]: "h-16 px-7.5 text-lg",
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

/** Design-system pill (prototype `.tap`). Heights: sm 40, md 44, lg 48, xl 64. */
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
