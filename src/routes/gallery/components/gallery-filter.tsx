import React from "react";
import { useTranslation } from "react-i18next";
import type { GalleryTags } from "@/api/types/portfolio/gallery";
import { FilterToggle } from "@/components/common/filters/filter-toggle";
import type { FilterOption } from "@/types/ui";

/** Value of the "All" chip. Never blank: Base UI ignores an empty toggle value. */
const ALL = "__all__";

interface GalleryFilterProps {
	/** The server's chips: total frame count and the most used tags. */
	tags: GalleryTags;
	/** Active tag, undefined = all. */
	value: string | undefined;
	onChange: (tag: string | undefined) => void;
}

/** Tag chips bound to `?tag=`, with the server's counts. */
export const GalleryFilter: React.FC<GalleryFilterProps> = ({
	tags,
	value,
	onChange,
}) => {
	const { t } = useTranslation();
	const options: FilterOption<string>[] = [
		{ id: ALL, label: t("gallery.filter.all"), count: tags.total },
		...tags.tags.map(({ tag, count }) => ({ id: tag, label: tag, count })),
	];
	return (
		<FilterToggle
			ariaLabel={t("gallery.filter.aria-label")}
			value={value ?? ALL}
			options={options}
			onChange={(next) => onChange(next === ALL ? undefined : next)}
			className="flex-wrap"
		/>
	);
};

export default GalleryFilter;
