import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TerminalInput } from "@/components/shared/terminal/terminal-input";
import { TerminalLine } from "@/components/shared/terminal/terminal-line";
import { TerminalTitlebar } from "@/components/shared/terminal/terminal-titlebar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
} from "@/components/ui/dialog";
import { useShell } from "@/contexts/shell-context";
import { useTerminal } from "@/hooks/terminal/use-terminal";

interface TerminalDialogProps {}

/** Bottom-left terminal window (prototype TERMINAL) on the shadcn Dialog. Output and input reset after it closes. */
export const TerminalDialog: React.FC<TerminalDialogProps> = () => {
	const { t } = useTranslation();
	const { terminalOpen, setTerminalOpen } = useShell();
	const { lines, run, reset } = useTerminal();
	const [value, setValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = outputRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [lines]);

	const submit = () => {
		run(value);
		setValue("");
	};

	return (
		<Dialog
			open={terminalOpen}
			onOpenChange={setTerminalOpen}
			onOpenChangeComplete={(open) => {
				if (open) return;
				setValue("");
				reset();
			}}
		>
			<DialogContent
				showCloseButton={false}
				initialFocus={inputRef}
				onClick={() => inputRef.current?.focus()}
				className="top-auto bottom-4 left-4 z-(--z-terminal) h-[min(58dvh,520px)] w-[min(720px,calc(100vw-32px))] max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-[22px] bg-neutral-950 p-0 font-mono text-neutral-50 ring-1 ring-white/16 sm:max-w-none"
			>
				<TerminalTitlebar />
				<DialogDescription className="sr-only">
					{t("shell.terminal.dialog.description")}
				</DialogDescription>
				<div
					ref={outputRef}
					role="log"
					className="flex min-h-0 flex-col gap-1.5 overflow-y-auto px-4 py-3.5 text-[13px] leading-normal"
				>
					{lines.map((line, i) => (
						<TerminalLine key={i} line={line} />
					))}
				</div>
				<TerminalInput
					ref={inputRef}
					value={value}
					onChange={setValue}
					onSubmit={submit}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default TerminalDialog;
