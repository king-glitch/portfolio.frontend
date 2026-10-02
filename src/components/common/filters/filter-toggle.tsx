import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { FilterOption } from "@/types/ui";

interface FilterToggleProps<T extends string> {
	value: T;
	options: FilterOption<T>[];
	onChange: (value: T) => void;
	/** Accessible name of the group (already translated). */
	ariaLabel: string;
	className?: string;
}

/** Single-select chip group (home project filter, notes tag filter). Re-pressing the active chip keeps it selected. */
export function FilterToggle<T extends string>({
	value,
	options,
	onChange,
	ariaLabel,
	className,
}: FilterToggleProps<T>) {
	return (
		<ToggleGroup
			aria-label={ariaLabel}
			spacing={2}
			value={[value]}
			onValueChange={([next]) => {
				const option = options.find((o) => o.id === next);
				if (option) onChange(option.id);
			}}
			className={className}
		>
			{options.map((option) => (
				<ToggleGroupItem
					key={option.id}
					value={option.id}
					className="h-10 gap-1.5 rounded-pill px-4 text-[13px] font-semibold shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,color,box-shadow] duration-300 hover:bg-transparent hover:shadow-[inset_0_0_0_1px_var(--foreground)] aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground"
				>
					{option.label}
					{option.count === undefined ? null : (
						<span className="tabular-nums opacity-55">
							{option.count}
						</span>
					)}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export default FilterToggle;
