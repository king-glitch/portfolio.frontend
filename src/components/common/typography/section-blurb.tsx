import React from "react";

interface SectionBlurbProps {
	children: React.ReactNode;
}

/** Short muted paragraph on the right of a section heading. */
export const SectionBlurb: React.FC<SectionBlurbProps> = ({ children }) => {
	return (
		<p className="m-0 max-w-75 text-[15px] leading-normal text-muted-foreground">
			{children}
		</p>
	);
};

export default SectionBlurb;
