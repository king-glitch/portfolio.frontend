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
			variant="outline"
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
					className="rounded-pill px-4"
				>
					{option.label}
					{option.count === undefined ? null : (
						<span className="text-muted-foreground tabular-nums">
							{option.count}
						</span>
					)}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export default FilterToggle;
