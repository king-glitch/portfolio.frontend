import React from "react";
import { useTranslation } from "react-i18next";
import { counterDigits, padCount } from "@/lib/portfolio/project-nav";
import { CounterReel } from "@/routes/work/[project-id]/components/topbar/counter-reel";

interface RollingCounterProps {
	/** 1-based position; undefined while the project list loads. */
	position?: number;
	total?: number;
}

/** "02 / 06" with rolling digit reels. */
export const RollingCounter: React.FC<RollingCounterProps> = ({
	position,
	total,
}) => {
	const { t } = useTranslation();
	if (position === undefined || total === undefined) {
		return (
			<span className="text-[22px] font-extrabold tracking-[-0.04em] text-muted-foreground">
				{t("work.counter.placeholder")}
			</span>
		);
	}
	const { tens, units } = counterDigits(position);
	return (
		<span
			role="img"
			aria-label={t("work.counter.label", { index: position, total })}
			className="inline-flex items-baseline text-[22px] font-extrabold tracking-[-0.04em] tabular-nums"
		>
			<CounterReel digit={tens} delay={0.3} />
			<CounterReel digit={units} delay={0.38} />
			<span className="ml-1.5 text-[13px] font-medium text-muted-foreground">
				/ {padCount(total)}
			</span>
		</span>
	);
};

export default RollingCounter;
