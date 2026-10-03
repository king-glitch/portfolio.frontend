// style-lint-ignore-file common-reuse -- reached through form-tags-field today; the plain chip input for any non-form use
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";

interface TagsFieldProps {
	id?: string;
	value: string[];
	onChange: (value: string[]) => void;
	/** Tags already in use elsewhere; any other text can still be typed in. */
	suggestions: string[];
	invalid?: boolean;
}

/** Short tokens as chips: pick a suggestion or type a new one and press Enter or comma. */
export const TagsField: React.FC<TagsFieldProps> = ({
	id,
	value,
	onChange,
	suggestions,
	invalid,
}) => {
	const { t } = useTranslation();
	const anchor = useComboboxAnchor();
	const [input, setInput] = useState("");
	const items = [...new Set([...value, ...suggestions])];

	const addTyped = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const typed = input.trim();
		if (event.key !== "Enter" && event.key !== ",") return;
		if (!typed) return;
		// an Enter on a highlighted suggestion picks that suggestion instead
		if (event.currentTarget.getAttribute("aria-activedescendant")) return;
		event.preventDefault();
		if (!value.includes(typed)) onChange([...value, typed]);
		setInput("");
	};

	return (
		<Combobox
			multiple
			items={items}
			value={value}
			onValueChange={onChange}
			inputValue={input}
			onInputValueChange={setInput}
		>
			<ComboboxChips ref={anchor}>
				<ComboboxValue>
					{value.map((tag) => (
						<ComboboxChip key={tag}>{tag}</ComboboxChip>
					))}
				</ComboboxValue>
				<ComboboxChipsInput
					id={id}
					aria-invalid={invalid}
					placeholder={t("components.common.fields.tags.placeholder")}
					onKeyDown={addTyped}
				/>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>
					{t("components.common.fields.tags.empty")}
				</ComboboxEmpty>
				<ComboboxList>
					{(tag: string) => (
						<ComboboxItem key={tag} value={tag}>
							{tag}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
};

export default TagsField;
