import React from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
	children: React.ReactNode;
	className?: string;
}

/** Small editorial meta label (sentence case, quiet tracking). */
export const Eyebrow: React.FC<EyebrowProps> = ({ children, className }) => {
	return (
		<span
			className={cn(
				"text-[13px] font-medium tracking-[0.02em] text-muted-foreground",
				className,
			)}
		>
			{children}
		</span>
	);
};

export default Eyebrow;
