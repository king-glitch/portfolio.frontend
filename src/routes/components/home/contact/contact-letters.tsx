import React, { useRef } from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { config } from "@/config";
import { useLetterWeight } from "@/hooks/pointer/use-letter-weight";
import { DisplayVariant } from "@/types/ui";

interface ContactLettersProps {
	/** Translated heading; each character becomes a weight-reactive span. */
	text: string;
}

/** Giant "Say hello." whose letters get heavier near the cursor (weight 900 at the pointer, 200 far away). */
export const ContactLetters: React.FC<ContactLettersProps> = ({ text }) => {
	const ref = useRef<HTMLDivElement>(null);
	useLetterWeight(ref);
	return (
		<div ref={ref}>
			<DisplayHeading
				variant={DisplayVariant.Contact}
				aria-label={text}
				style={{ fontWeight: config.home.contact.fixedWeight }}
				className="mt-7"
			>
				{Array.from(text).map((char, i) => (
					<span
						key={`${char}-${i}`}
						data-vw=""
						aria-hidden="true"
						className="inline-block whitespace-pre"
					>
						{char}
					</span>
				))}
			</DisplayHeading>
		</div>
	);
};

export default ContactLetters;
