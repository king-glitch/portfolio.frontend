import React from "react";
import type { ParseKeys } from "i18next";
import { RiArrowRightUpLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface MenuPageLinkProps {
	index: number;
	titleKey: ParseKeys;
	subKey: ParseKeys;
	current: boolean;
	/** Stagger of the entrance animation, seconds. */
	delayS: number;
	/** Route to open; without it the row is a plain button (`onSelect` does the work). */
	to?: string;
	onSelect: () => void;
	onHover: () => void;
}

/** One big menu row. Siblings dim while the list is hovered (CSS on the list), the hovered row stays full and slides in. */
export const MenuPageLink: React.FC<MenuPageLinkProps> = ({
	index,
	titleKey,
	subKey,
	current,
	delayS,
	to,
	onSelect,
	onHover,
}) => {
	const { t } = useTranslation();
	return (
		<Button
			variant="ghost"
			nativeButton={to === undefined}
			render={to ? <Link to={to} viewTransition /> : undefined}
			aria-current={current ? "page" : undefined}
			onClick={onSelect}
			onMouseEnter={onHover}
			onFocus={onHover}
			className="group/row h-auto w-full justify-start rounded-none border-0 border-b border-current/30 px-0 py-2 text-left whitespace-normal transition-[opacity,padding] duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-transparent hover:pl-5.5 focus-visible:pl-5.5 focus-visible:ring-0 dark:hover:bg-transparent"
		>
			<span
				className="menu-in flex w-full items-center gap-5.5"
				style={{ animationDelay: `${delayS}s` }}
			>
				<span className="w-7 text-[13px] font-semibold tabular-nums opacity-50">
					{String(index + 1).padStart(2, "0")}
				</span>
				<span className="grow text-[clamp(48px,7.4vw,124px)] leading-[0.98] font-extrabold tracking-[-0.065em]">
					{t(titleKey)}
				</span>
				<span className="max-w-47.5 text-right text-sm font-normal opacity-60 max-[760px]:hidden">
					{t(subKey)}
				</span>
				<RiArrowRightUpLine className="size-8 -translate-x-3 opacity-0 transition-[opacity,translate] duration-500 group-hover/row:translate-x-0 group-hover/row:opacity-100" />
			</span>
		</Button>
	);
};

export default MenuPageLink;
