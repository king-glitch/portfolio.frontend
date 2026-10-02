import React from "react";
import { cn } from "@/lib/utils";

interface PanelLabelProps {
	children: React.ReactNode;
	className?: string;
}

/** Small tracked uppercase label (prototype `.lbl`). */
// Same look as common/typography SectionLabel (which needs an index); fold into it.
export const PanelLabel: React.FC<PanelLabelProps> = ({
	children,
	className,
}) => {
	return (
		<span
			className={cn(
				"text-[13px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
				className,
			)}
		>
			{children}
		</span>
	);
};

export default PanelLabel;
