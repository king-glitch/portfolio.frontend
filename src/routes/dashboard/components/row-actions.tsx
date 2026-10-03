import React from "react";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface RowActionsProps {
	/** Name of the row, for the buttons' accessible names. */
	name: string;
	editTo: string;
	onDelete: () => void;
	/** Buttons before edit/delete (e.g. move up/down). */
	children?: React.ReactNode;
}

/** Right-aligned edit and delete buttons of a table row. */
export const RowActions: React.FC<RowActionsProps> = ({
	name,
	editTo,
	onDelete,
	children,
}) => {
	const { t } = useTranslation();
	return (
		<div className="flex justify-end gap-1">
			{children}
			<Button
				variant="ghost"
				size="icon"
				aria-label={t("dashboard.row.edit.aria-label", { name })}
				nativeButton={false}
				render={<Link to={editTo} />}
			>
				<RiEditLine />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				aria-label={t("dashboard.row.delete.aria-label", { name })}
				onClick={onDelete}
			>
				<RiDeleteBinLine />
			</Button>
		</div>
	);
};

export default RowActions;
