import React, { useRef } from "react";
import { HelloStatCell } from "@/routes/components/home/hello/hello-stat-cell";
import { useCountUp } from "@/hooks/motion/use-count-up";

interface HelloStatProps {
	value: number;
	/** Minimum digits (zero padded). */
	pad: number;
	suffix?: string;
	label: string;
}

/** Big counting number with a caption; counts up once when it reaches the viewport. */
export const HelloStat: React.FC<HelloStatProps> = ({
	value,
	pad,
	suffix,
	label,
}) => {
	const countRef = useRef<HTMLSpanElement>(null);
	useCountUp(countRef, value, pad);
	return (
		<HelloStatCell>
			<span className="text-[clamp(64px,8vw,128px)] leading-[0.85] font-extrabold tracking-[-0.07em] tabular-nums">
				<span ref={countRef} />
				<span className="text-muted-foreground">{suffix}</span>
			</span>
			<span className="max-w-55 text-sm leading-[1.4] text-muted-foreground">
				{label}
			</span>
		</HelloStatCell>
	);
};

export default HelloStat;
