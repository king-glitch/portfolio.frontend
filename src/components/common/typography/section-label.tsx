import React, { useRef } from "react";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { useScramble } from "@/hooks/motion/use-scramble";

interface SectionLabelProps {
	/** 1-based section number, shown as "(01)". */
	index: number;
	/** Translated label text. */
	children: string;
	className?: string;
}

/** "(01) Hello" eyebrow that scrambles in. The visible copy is aria-hidden; screen readers get an exact sr-only copy. */
export const SectionLabel: React.FC<SectionLabelProps> = ({
	index,
	children,
	className,
}) => {
	const ref = useRef<HTMLSpanElement>(null);
	useScramble(ref);
	const text = `(${String(index).padStart(2, "0")}) ${children}`;
	return (
		<Eyebrow className={className}>
			<span ref={ref} aria-hidden="true">
				{text}
			</span>
			<span className="sr-only">{text}</span>
		</Eyebrow>
	);
};

export default SectionLabel;
