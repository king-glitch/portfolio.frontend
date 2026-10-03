import React from "react";
import {
	RiArrowDownLine,
	RiArrowUpLine,
	RiDeleteBinLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFields } from "@/routes/dashboard/components/dynamic-form/dynamic-fields";
import type { FieldSpec, FormRecord } from "@/types/dynamic-form";

interface BlockCardProps {
	index: number;
	total: number;
	/** Translated block type. */
	typeLabel: string;
	/** Undefined: a block type this form cannot edit; it can only be moved or removed. */
	fields: FieldSpec[] | undefined;
	params: FormRecord;
	invalid: boolean;
	onChange: (params: FormRecord) => void;
	onMove: (delta: number) => void;
	onRemove: () => void;
}

/** One block: its type, move/remove buttons and the fields of that type. */
export const BlockCard: React.FC<BlockCardProps> = ({
	index,
	total,
	typeLabel,
	fields,
	params,
	invalid,
	onChange,
	onMove,
	onRemove,
}) => {
	const { t } = useTranslation();
	const actions = [
		{
			id: "up",
			icon: RiArrowUpLine,
			label: t("dashboard.blocks.move.up", { name: typeLabel }),
			disabled: index === 0,
			onClick: () => onMove(-1),
		},
		{
			id: "down",
			icon: RiArrowDownLine,
			label: t("dashboard.blocks.move.down", { name: typeLabel }),
			disabled: index === total - 1,
			onClick: () => onMove(1),
		},
		{
			id: "remove",
			icon: RiDeleteBinLine,
			label: t("dashboard.blocks.remove", { name: typeLabel }),
			disabled: false,
			onClick: onRemove,
		},
	];
	return (
		<Card size="sm">
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle>
					{index + 1}. {typeLabel}
				</CardTitle>
				<div className="flex gap-1">
					{actions.map(
						({ id, icon: Icon, label, disabled, onClick }) => (
							<Button
								key={id}
								variant="ghost"
								size="icon"
								aria-label={label}
								disabled={disabled}
								onClick={onClick}
							>
								<Icon />
							</Button>
						),
					)}
				</div>
			</CardHeader>
			<CardContent>
				{fields ? (
					<DynamicFields
						specs={fields}
						record={params}
						invalid={invalid}
						onChange={onChange}
					/>
				) : (
					<p className="text-sm text-muted-foreground">
						{t("dashboard.blocks.unsupported")}
					</p>
				)}
			</CardContent>
		</Card>
	);
};

export default BlockCard;
