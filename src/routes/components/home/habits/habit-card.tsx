import React from "react";
import type { CoreSkill } from "@/api/types/portfolio/profile";
import { MetaCode } from "@/components/common/typography/meta-code";

interface HabitCardProps {
	habit: CoreSkill;
	index: number;
	total: number;
}

/** One numbered rule row in the habits ledger. */
export const HabitCard: React.FC<HabitCardProps> = ({
	habit,
	index,
	total,
}) => {
	const num = String(index + 1).padStart(2, "0");
	const totalStr = String(total).padStart(2, "0");
	return (
		<article className="group/habit grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-4 border-b py-7 transition-colors duration-200 hover:border-foreground/40 max-desk:grid-cols-1 max-desk:gap-2 desk:gap-8">
			<MetaCode className="transition-colors duration-200 group-hover/habit:text-foreground">
				{`${num} / ${totalStr}`}
			</MetaCode>
			<div className="flex min-w-0 flex-col gap-2">
				<h3 className="m-0 text-[clamp(20px,1.8vw,26px)] leading-snug font-semibold tracking-tight transition-transform duration-300 ease-(--ease-out-expo) group-hover/habit:translate-x-1">
					{habit.label}
				</h3>
				<p className="m-0 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
					{habit.text}
				</p>
			</div>
		</article>
	);
};

export default HabitCard;
