import React from "react";
import { RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { FormButton } from "@/components/common/buttons/form-button";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlockAddMenuProps {
	/** Block types that can be added; `label` is translated. */
	types: { value: string; label: string }[];
	onPick: (type: string) => void;
	/** Small "+" between two cards instead of the full "Add block" button. */
	insert?: boolean;
}

/** One-click block picker: a menu of the block types. */
export const BlockAddMenu: React.FC<BlockAddMenuProps> = ({
	types,
	onPick,
	insert,
}) => {
	const { t } = useTranslation();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					insert ? (
						<Button
							variant="ghost"
							size="icon-sm"
							className="self-center"
							aria-label={t("dashboard.blocks.insert")}
						/>
					) : (
						<FormButton variant="outline" className="self-start" />
					)
				}
			>
				<RiAddLine data-icon={insert ? undefined : "inline-start"} />
				{insert ? null : t("dashboard.blocks.add")}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{types.map((item) => (
					<DropdownMenuItem
						key={item.value}
						onClick={() => onPick(item.value)}
					>
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default BlockAddMenu;
