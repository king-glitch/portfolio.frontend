import React, { useState } from "react";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LinesEditorProps {
	id?: string;
	value: string[];
	onChange: (value: string[]) => void;
	invalid?: boolean;
}

/** A list of sentences, one input per row with add and remove: for text that may itself contain commas. */
export const LinesEditor: React.FC<LinesEditorProps> = ({
	id,
	value,
	onChange,
	invalid,
}) => {
	const { t } = useTranslation();
	// one key per row so removing a row does not hand its input state to the next one
	const [keys, setKeys] = useState(() =>
		value.map(() => crypto.randomUUID()),
	);
	const [focusIndex, setFocusIndex] = useState(-1);
	// an outside reset can change the row count: rows without a key get a positional one
	const rowKeys = value.map((_, index) => keys[index] ?? `row-${index}`);

	const change = (index: number, text: string) =>
		onChange(value.map((line, i) => (i === index ? text : line)));
	const add = () => {
		setKeys([...rowKeys, crypto.randomUUID()]);
		setFocusIndex(value.length);
		onChange([...value, ""]);
	};
	const remove = (index: number) => {
		setKeys(rowKeys.filter((_, i) => i !== index));
		setFocusIndex(-1);
		onChange(value.filter((_, i) => i !== index));
	};

	return (
		<div className="flex flex-col gap-2">
			{value.map((line, index) => (
				<div key={rowKeys[index]} className="flex items-center gap-2">
					<Input
						id={index === 0 ? id : undefined}
						value={line}
						aria-invalid={invalid}
						aria-label={t("components.common.fields.lines.row", {
							index: index + 1,
						})}
						autoFocus={index === focusIndex}
						onChange={(event) => change(index, event.target.value)}
					/>
					<Button
						variant="ghost"
						size="icon"
						aria-label={t("components.common.fields.lines.remove", {
							index: index + 1,
						})}
						onClick={() => remove(index)}
					>
						<RiDeleteBinLine />
					</Button>
				</div>
			))}
			<Button variant="outline" className="self-start" onClick={add}>
				<RiAddLine data-icon="inline-start" />
				{t("components.common.fields.lines.add")}
			</Button>
		</div>
	);
};

export default LinesEditor;
