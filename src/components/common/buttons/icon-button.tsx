import React from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { PillButton } from "@/components/common/buttons/pill-button";
import { cn } from "@/lib/utils";
import { PillVariant } from "@/types/ui";

interface IconButtonProps extends Omit<
	React.ComponentProps<typeof PillButton>,
	"size" | "children"
> {
	/** Accessible name (already translated). */
	label: string;
	icon: RemixiconComponentType;
}

/** 44px round icon button; `label` is its aria-label. */
export const IconButton: React.FC<IconButtonProps> = ({
	label,
	icon: Icon,
	variant = PillVariant.Outline,
	className,
	...props
}) => {
	return (
		<PillButton
			variant={variant}
			aria-label={label}
			className={cn("size-11 p-0", className)}
			{...props}
		>
			<Icon />
		</PillButton>
	);
};

export default IconButton;
