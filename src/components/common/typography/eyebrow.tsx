import React from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
	children: React.ReactNode;
	className?: string;
}

/** Small tracked uppercase label (prototype `.lbl`). */
export const Eyebrow: React.FC<EyebrowProps> = ({ children, className }) => {
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

export default Eyebrow;
