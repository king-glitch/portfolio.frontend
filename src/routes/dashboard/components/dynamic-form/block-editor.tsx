import React, { useState } from "react";
import { RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { FormButton } from "@/components/common/buttons/form-button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	asString,
	blockParams,
	emptyRecord,
	withBlockParams,
} from "@/lib/dynamic-form/values";
import { BlockCard } from "@/routes/dashboard/components/dynamic-form/block-card";
import type { FieldSpec, FormRecord } from "@/types/dynamic-form";

interface BlockEditorProps {
	label: string;
	value: FormRecord[];
	onChange: (blocks: FormRecord[]) => void;
	/** Block types that can be added; `label` is translated. */
	types: { value: string; label: string }[];
	/** Fields per block type. */
	specs: Record<string, FieldSpec[]>;
	/** Project blocks keep their fields in `params`; note blocks keep them beside `type`. */
	nested: boolean;
	/** Message to show, e.g. the form's validation error. */
	error?: string;
}

/** Ordered list of blocks, each edited with the fields of its type; add, move and remove. */
export const BlockEditor: React.FC<BlockEditorProps> = ({
	label,
	value,
	onChange,
	types,
	specs,
	nested,
	error,
}) => {
	const { t } = useTranslation();
	const [adding, setAdding] = useState(types[0]?.value ?? "");
	const labelOf = (type: string) =>
		types.find((item) => item.value === type)?.label ?? type;

	const move = (index: number, delta: number) => {
		const next = [...value];
		const [block] = next.splice(index, 1);
		if (block) next.splice(index + delta, 0, block);
		onChange(next);
	};
	const add = () => {
		const fields = specs[adding];
		if (!fields) return;
		onChange([
			...value,
			withBlockParams(adding, emptyRecord(fields), nested),
		]);
	};

	return (
		<Field data-invalid={Boolean(error)}>
			<FieldLabel>{label}</FieldLabel>
			<FieldDescription>{t("dashboard.blocks.hint")}</FieldDescription>
			{value.map((block, index) => {
				const type = asString(block.type);
				return (
					<BlockCard
						key={index}
						index={index}
						total={value.length}
						typeLabel={labelOf(type)}
						fields={specs[type]}
						params={blockParams(block, nested)}
						invalid={Boolean(error)}
						onChange={(params) =>
							onChange(
								value.map((item, i) =>
									i === index
										? withBlockParams(type, params, nested)
										: item,
								),
							)
						}
						onMove={(delta) => move(index, delta)}
						onRemove={() =>
							onChange(value.filter((_, i) => i !== index))
						}
					/>
				);
			})}
			<div className="flex flex-wrap gap-2">
				<Select
					items={types}
					value={adding}
					onValueChange={(next) => next && setAdding(next)}
				>
					<SelectTrigger
						aria-label={t("dashboard.blocks.type.aria-label")}
						className="h-11 w-56"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{types.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<FormButton variant="outline" onClick={add}>
					<RiAddLine data-icon="inline-start" />
					{t("dashboard.blocks.add")}
				</FormButton>
			</div>
			{error ? <FieldError>{error}</FieldError> : null}
		</Field>
	);
};

export default BlockEditor;
