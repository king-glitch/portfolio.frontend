import React from "react";
import {
	RiArrowDownLine,
	RiArrowUpLine,
	RiDeleteBinLine,
} from "@remixicon/react";
import {
	Controller,
	type Control,
	type UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormTextareaField } from "@/components/common/fields/form/form-textarea-field";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { TagsField } from "@/components/common/fields/tags-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { slugify } from "@/lib/portfolio/ids";
import type { StackValues } from "@/routes/dashboard/settings/stack/components/stack-form-schema";

interface StackStopRowProps {
	control: Control<StackValues>;
	setValue: UseFormSetValue<StackValues>;
	index: number;
	total: number;
	/** Already stored: the id is read-only. */
	saved: boolean;
	/** Name as loaded, for the buttons' accessible names. */
	name: string;
	/** Project stack entries, offered as keyword suggestions. */
	suggestions: string[];
	onMove: (delta: number) => void;
	onRemove: () => void;
}

/** One stop: name (id derived from it until saved), description, matching keywords; move and remove. */
export const StackStopRow: React.FC<StackStopRowProps> = ({
	control,
	setValue,
	index,
	total,
	saved,
	name,
	suggestions,
	onMove,
	onRemove,
}) => {
	const { t } = useTranslation();
	const actions = [
		{
			id: "up",
			icon: RiArrowUpLine,
			label: t("dashboard.settings.stack.move.up", { name }),
			disabled: index === 0,
			onClick: () => onMove(-1),
		},
		{
			id: "down",
			icon: RiArrowDownLine,
			label: t("dashboard.settings.stack.move.down", { name }),
			disabled: index === total - 1,
			onClick: () => onMove(1),
		},
		{
			id: "remove",
			icon: RiDeleteBinLine,
			label: t("dashboard.settings.stack.remove", { name }),
			disabled: false,
			onClick: onRemove,
		},
	];
	return (
		<div className="flex flex-col gap-4 rounded-xl border p-4">
			<div className="flex flex-wrap items-start gap-3">
				<div className="min-w-40 flex-1">
					<FormTextField
						control={control}
						name={`stops.${index}.name`}
						label={t("dashboard.settings.stack.name.label")}
						onInput={(event) => {
							if (!saved)
								setValue(
									`stops.${index}.id`,
									slugify(event.currentTarget.value),
									{
										shouldValidate: true,
									},
								);
						}}
					/>
				</div>
				<div className="min-w-40 flex-1">
					<FormTextField
						control={control}
						name={`stops.${index}.id`}
						label={t("dashboard.settings.stack.id.label")}
						readOnly={saved}
					/>
				</div>
				<div className="flex gap-1 self-end">
					{actions.map(
						({ id, icon: Icon, label, disabled, onClick }) => (
							<Button
								key={id}
								type="button"
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
			</div>
			<FormTextareaField
				control={control}
				name={`stops.${index}.description`}
				label={t("dashboard.settings.stack.description.label")}
			/>
			<Controller
				control={control}
				name={`stops.${index}.keywords`}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={`stops-${index}-keywords`}>
							{t("dashboard.settings.stack.keywords.label")}
						</FieldLabel>
						<TagsField
							id={`stops-${index}-keywords`}
							value={field.value}
							onChange={field.onChange}
							suggestions={suggestions}
							invalid={fieldState.invalid}
						/>
						{fieldState.invalid ? (
							<FieldError errors={[fieldState.error]} />
						) : null}
					</Field>
				)}
			/>
		</div>
	);
};

export default StackStopRow;
