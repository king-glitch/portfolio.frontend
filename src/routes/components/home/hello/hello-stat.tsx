import React, { useRef } from "react";
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
		<div className="flex flex-col gap-3.5 border-b py-7 pr-6 desk:border-r desk:border-b-0">
			<span className="text-[clamp(64px,8vw,128px)] leading-[0.85] font-extrabold tracking-[-0.07em] tabular-nums">
				<span ref={countRef} />
				<span className="text-muted-foreground">{suffix}</span>
			</span>
			<span className="max-w-55 text-sm leading-[1.4] text-muted-foreground">
				{label}
			</span>
		</div>
	);
};

export default HelloStat;
