import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { emptyRecord, withBlockParams } from "@/lib/dynamic-form/values";
import { BlockAddMenu } from "@/routes/dashboard/components/dynamic-form/block/block-add-menu";
import { BlockCard } from "@/routes/dashboard/components/dynamic-form/block/block-card";
import type { BlocksFormValues, FieldSpec } from "@/types/dynamic-form";

interface BlockEditorProps {
	label: string;
	/** Block types that can be added; `label` is translated. */
	types: { value: string; label: string }[];
	/** Fields per block type. */
	specs: Record<string, FieldSpec[]>;
	/** Project blocks keep their fields in `params`; note blocks keep them beside `type`. */
	nested: boolean;
}

/** Ordered list of collapsible blocks: add (end or between), move, duplicate, remove with undo. Cards keep their identity through moves. Must sit inside a `FormProvider` whose form has a `blocks` array. */
export const BlockEditor: React.FC<BlockEditorProps> = ({
	label,
	types,
	specs,
	nested,
}) => {
	const { t } = useTranslation();
	// The enclosing form (a `FormProvider`) holds a `blocks` array of records.
	const { control, formState, getValues } =
		useFormContext<BlocksFormValues>();
	const { fields, insert, move, remove } = useFieldArray({
		control,
		name: "blocks",
	});
	const { errors } = formState;
	const error = errors.blocks?.root?.message ?? errors.blocks?.message;
	// the card that was just added or duplicated mounts open
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const add = (type: string, at: number) => {
		const blockFields = specs[type];
		if (!blockFields) return;
		insert(at, withBlockParams(type, emptyRecord(blockFields), nested));
		setOpenIndex(at);
	};
	const duplicate = (index: number) => {
		insert(index + 1, structuredClone(getValues(`blocks.${index}`)));
		setOpenIndex(index + 1);
	};
	const removeWithUndo = (index: number) => {
		const removed = structuredClone(getValues(`blocks.${index}`));
		const name = String(removed.type);
		remove(index);
		toast.add({
			type: "info",
			title: t("dashboard.blocks.removed", {
				name: types.find((item) => item.value === name)?.label ?? name,
			}),
			actionProps: {
				children: t("dashboard.blocks.undo"),
				onClick: () => {
					insert(index, removed);
					setOpenIndex(index);
				},
			},
		});
	};

	return (
		<Field data-invalid={Boolean(error)}>
			<FieldLabel>{label}</FieldLabel>
			<FieldDescription>{t("dashboard.blocks.hint")}</FieldDescription>
			{fields.map((field, index) => (
				<React.Fragment key={field.id}>
					{index > 0 ? (
						<BlockAddMenu
							insert
							types={types}
							onPick={(type) => add(type, index)}
						/>
					) : null}
					<BlockCard
						control={control}
						index={index}
						total={fields.length}
						types={types}
						specs={specs}
						nested={nested}
						startOpen={index === openIndex}
						onMove={(delta) => move(index, index + delta)}
						onDuplicate={() => duplicate(index)}
						onRemove={() => removeWithUndo(index)}
					/>
				</React.Fragment>
			))}
			<BlockAddMenu
				types={types}
				onPick={(type) => add(type, fields.length)}
			/>
			{error ? <FieldError>{error}</FieldError> : null}
		</Field>
	);
};

export default BlockEditor;
