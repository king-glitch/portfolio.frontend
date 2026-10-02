import React from "react";
import { cn } from "@/lib/utils";

interface HeroWordProps {
	children: string;
	/** Seconds before the word rises. */
	delayS: number;
	className?: string;
	onClick?: () => void;
}

/** One headline word: masked, rises into place once the preloader is done (`gated`). */
export const HeroWord: React.FC<HeroWordProps> = ({
	children,
	delayS,
	className,
	onClick,
}) => {
	return (
		<span
			onClick={onClick}
			className="mb-[-0.08em] inline-block overflow-hidden pb-[0.08em] align-top"
		>
			<span
				className={cn(
					"inline-block animate-rise gated motion-reduce:animate-none",
					className,
				)}
				style={{ animationDelay: `${delayS}s` }}
			>
				{children}
			</span>
		</span>
	);
};

export default HeroWord;
