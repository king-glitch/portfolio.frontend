import React, { useState } from "react";
import {
	RiArrowDownLine,
	RiArrowDownSLine,
	RiArrowUpLine,
	RiDeleteBinLine,
	RiFileCopyLine,
} from "@remixicon/react";
import { useController, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FieldError } from "@/components/ui/field";
import { blockDomId } from "@/lib/dynamic-form/focus";
import {
	asString,
	blockParams,
	blockSummary,
	hasMissing,
	withBlockParams,
} from "@/lib/dynamic-form/values";
import { DynamicFields } from "@/routes/dashboard/components/dynamic-form/dynamic/dynamic-fields";
import type { BlocksFormValues, FieldSpec } from "@/types/dynamic-form";

interface BlockCardProps {
	control: Control<BlocksFormValues>;
	index: number;
	total: number;
	/** Block types with translated labels. */
	types: { value: string; label: string }[];
	/** Fields per block type; a type without an entry cannot be edited here, only moved or removed. */
	specs: Record<string, FieldSpec[]>;
	/** Project blocks keep their fields in `params`; note blocks keep them beside `type`. */
	nested: boolean;
	/** Open when first shown (a block just added or duplicated). */
	startOpen: boolean;
	onMove: (delta: number) => void;
	onDuplicate: () => void;
	onRemove: () => void;
}

/** One collapsible block: type and summary in the header, move/duplicate/remove, the fields of that type inside. It reads and writes its own slot of the form and opens itself when it has a problem. */
export const BlockCard: React.FC<BlockCardProps> = ({
	control,
	index,
	total,
	types,
	specs,
	nested,
	startOpen,
	onMove,
	onDuplicate,
	onRemove,
}) => {
	const { t } = useTranslation();
	const [userOpen, setUserOpen] = useState(startOpen);
	const { field, fieldState, formState } = useController({
		control,
		name: `blocks.${index}`,
	});
	const type = asString(field.value.type);
	const typeLabel = types.find((item) => item.value === type)?.label ?? type;
	const fields = specs[type];
	const params = blockParams(field.value, nested);
	const serverError = fieldState.error?.root?.message;
	// required fields only turn red after a failed submit
	const invalid =
		formState.submitCount > 0 && fields
			? hasMissing(params, fields)
			: false;
	const open = userOpen || invalid || Boolean(serverError);
	const summary = fields ? blockSummary(params, fields) : "";
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
			id: "duplicate",
			icon: RiFileCopyLine,
			label: t("dashboard.blocks.duplicate", { name: typeLabel }),
			disabled: false,
			onClick: onDuplicate,
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
		<Card size="sm" id={blockDomId(index)}>
			<Collapsible open={open} onOpenChange={setUserOpen}>
				<CardHeader className="flex-row items-center justify-between gap-2">
					<CollapsibleTrigger
						render={
							<Button
								variant="ghost"
								className="h-auto min-w-0 flex-1 justify-start gap-2 py-1"
							/>
						}
					>
						<RiArrowDownSLine
							data-icon="inline-start"
							className={open ? undefined : "-rotate-90"}
						/>
						<span className="font-medium">
							{index + 1}. {typeLabel}
						</span>
						{summary ? (
							<span className="truncate text-muted-foreground">
								{summary}
							</span>
						) : null}
						{invalid || serverError ? (
							<Badge variant="destructive">
								{t("dashboard.blocks.invalid")}
							</Badge>
						) : null}
					</CollapsibleTrigger>
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
				<CollapsibleContent>
					<CardContent className="flex flex-col gap-4">
						{fields ? (
							<DynamicFields
								specs={fields}
								record={params}
								invalid={invalid}
								onChange={(next) =>
									field.onChange(
										withBlockParams(type, next, nested),
									)
								}
							/>
						) : (
							<p className="text-sm text-muted-foreground">
								{t("dashboard.blocks.unsupported")}
							</p>
						)}
						{serverError ? (
							<FieldError>{serverError}</FieldError>
						) : null}
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
};

export default BlockCard;
