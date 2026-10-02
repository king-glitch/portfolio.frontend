import React from "react";

interface ResumeHeadingProps {
	children: React.ReactNode;
}

/** Small-caps heading shared by the four resume blocks. */
export const ResumeHeading: React.FC<ResumeHeadingProps> = ({ children }) => {
	return (
		<h2 className="mb-2 text-xs font-extrabold tracking-[0.14em] uppercase">
			{children}
		</h2>
	);
};

export default ResumeHeading;
