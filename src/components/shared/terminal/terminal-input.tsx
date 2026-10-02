import React from "react";
import { useTranslation } from "react-i18next";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { config } from "@/config";

interface TerminalInputProps {
	ref: React.Ref<HTMLInputElement>;
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
}

/** Prompt row. Not a form: Enter runs the command. */
export const TerminalInput: React.FC<TerminalInputProps> = ({
	ref,
	value,
	onChange,
	onSubmit,
}) => {
	const { t } = useTranslation();
	return (
		<InputGroup className="h-12 shrink-0 rounded-none border-0 border-t border-white/12 bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-white/12 has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-transparent">
			<InputGroupAddon className="font-mono text-sm font-bold text-white">
				{config.terminal.prompt}
			</InputGroupAddon>
			<InputGroupInput
				ref={ref}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key !== "Enter") return;
					e.preventDefault();
					onSubmit();
				}}
				aria-label={t("shell.terminal.input.aria-label")}
				placeholder={t("shell.terminal.input.placeholder")}
				autoComplete="off"
				autoCapitalize="off"
				spellCheck={false}
				className="font-mono text-sm text-white caret-white placeholder:text-white/40"
			/>
		</InputGroup>
	);
};

export default TerminalInput;
