import React from "react";
import { RiCloseLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";

interface TerminalTitlebarProps {}

/** Three dots, the prompt path as the dialog title, esc hint and the close button. */
export const TerminalTitlebar: React.FC<TerminalTitlebarProps> = () => {
	const { t } = useTranslation();
	return (
		<div className="flex items-center justify-between gap-3 border-b border-white/12 px-4 py-3">
			<div className="flex items-center gap-3">
				<span aria-hidden="true" className="flex gap-1.5">
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							className="size-2.5 rounded-full bg-white/25"
						/>
					))}
				</span>
				<DialogTitle className="font-mono text-xs font-normal opacity-60">
					{t("shell.terminal.titlebar.label")}
				</DialogTitle>
			</div>
			<DialogClose
				aria-label={t("shell.terminal.close.aria-label")}
				className="inline-flex h-11 items-center gap-2 rounded-pill px-2 font-mono text-xs opacity-60 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-white/40"
			>
				{t("shell.terminal.titlebar.esc")}
				<RiCloseLine className="size-4" />
			</DialogClose>
		</div>
	);
};

export default TerminalTitlebar;
