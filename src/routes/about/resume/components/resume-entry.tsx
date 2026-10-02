import React from "react";

interface ResumeEntryProps {
	children: React.ReactNode;
}

/** One ruled resume entry that never splits across printed pages. */
export const ResumeEntry: React.FC<ResumeEntryProps> = ({ children }) => {
	return (
		<div className="border-t border-print-line py-2.5 print:break-inside-avoid">
			{children}
		</div>
	);
};

export default ResumeEntry;
