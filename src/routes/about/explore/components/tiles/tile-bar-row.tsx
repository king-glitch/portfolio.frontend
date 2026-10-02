import React from "react";

interface TileBarRowProps {
	label: string;
	/** The track (and its fill) next to the label. */
	children: React.ReactNode;
}

/** Label column plus a track: rows of the word bars and the timeline. */
export const TileBarRow: React.FC<TileBarRowProps> = ({ label, children }) => {
	return (
		<div className="grid grid-cols-[var(--wall-label)_minmax(0,1fr)] items-center gap-2.5 text-(length:--wall-xs) font-bold">
			<span className="truncate">{label}</span>
			{children}
		</div>
	);
};

export default TileBarRow;
