import React from "react";

interface HelloStatCellProps {
	children: React.ReactNode;
}

/** Ruled cell of the stats row (shared by the loaded stat and its skeleton). */
export const HelloStatCell: React.FC<HelloStatCellProps> = ({ children }) => {
	return (
		<div className="flex flex-col gap-3.5 border-b py-7 pr-6 desk:border-r desk:border-b-0">
			{children}
		</div>
	);
};

export default HelloStatCell;
