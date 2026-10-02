import React from "react";
import { cva } from "class-variance-authority";
import type { CoreSkill } from "@/api/types/portfolio/profile";
import { HabitTone } from "@/types/home";

const cardVariants = cva(
	"box-border flex flex-col justify-between rounded-[28px] p-7 max-desk:min-h-80 max-desk:gap-8",
	{
		variants: {
			tone: {
				[HabitTone.Solid]:
					"bg-foreground text-background desk:-translate-y-6",
				[HabitTone.Card]:
					"bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)] desk:translate-y-7.5",
				[HabitTone.Outline]:
					"bg-transparent text-foreground shadow-[inset_0_0_0_1.5px_var(--foreground)] desk:-translate-y-1.5",
			},
			pinned: {
				true: "h-[min(68vh,600px)] w-[min(440px,82vw)] shrink-0",
				false: "w-full",
			},
		},
	},
);

interface HabitCardProps {
	habit: CoreSkill;
	index: number;
	total: number;
	tone: HabitTone;
	pinned: boolean;
}

/** One of the five habits: counter, ghost numeral, label and text. */
export const HabitCard: React.FC<HabitCardProps> = ({
	habit,
	index,
	total,
	tone,
	pinned,
}) => {
	const num = String(index + 1).padStart(2, "0");
	return (
		<article className={cardVariants({ tone, pinned })}>
			<div className="flex justify-between text-[13px] font-semibold tracking-widest">
				<span>{num}</span>
				<span className="opacity-55">{`/ ${String(total).padStart(2, "0")}`}</span>
			</div>
			<div
				aria-hidden="true"
				className="text-[clamp(120px,14vw,220px)] leading-[0.8] font-black tracking-[-0.08em] opacity-12"
			>
				{num}
			</div>
			<div className="flex flex-col gap-3.5">
				<h3 className="m-0 text-[clamp(28px,2.6vw,40px)] leading-none font-extrabold tracking-[-0.045em]">
					{habit.label}
				</h3>
				<p className="m-0 text-base leading-[1.55] opacity-75">
					{habit.text}
				</p>
			</div>
		</article>
	);
};

export default HabitCard;
