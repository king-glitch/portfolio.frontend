import React, { useRef } from "react";
import { useWordReveal } from "@/hooks/scroll/use-word-reveal";

interface HelloWordsProps {
	text: string;
}

/** The about paragraph; each word fades from 0.16 to 1 as the block scrolls into view. */
export const HelloWords: React.FC<HelloWordsProps> = ({ text }) => {
	const ref = useRef<HTMLParagraphElement>(null);
	useWordReveal(ref, true);
	return (
		<p
			ref={ref}
			className="m-0 text-[clamp(26px,3.4vw,54px)] leading-[1.14] font-semibold tracking-[-0.038em]"
		>
			{text.split(/\s+/).map((word, i) => (
				<span key={`${i}-${word}`} data-rw="" className="opacity-16">
					{`${word} `}
				</span>
			))}
		</p>
	);
};

export default HelloWords;
