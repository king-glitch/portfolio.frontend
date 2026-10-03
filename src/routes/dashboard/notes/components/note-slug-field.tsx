import React from "react";
import { useWatch, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { slugify } from "@/lib/portfolio/ids";
import type { NoteFormValues } from "@/routes/dashboard/notes/components/note-form-schema";

/** The backend's fallback when a title has no letters or digits. */
const FALLBACK_SLUG = "note";

interface NoteSlugFieldProps {
	control: Control<NoteFormValues>;
}

/** Optional URL slug. Empty = the backend derives it from the title, shown here as the placeholder (same rule: lowercase, non-alphanumerics to "-", trimmed). */
export const NoteSlugField: React.FC<NoteSlugFieldProps> = ({ control }) => {
	const { t } = useTranslation();
	const title = useWatch({ control, name: "title" });
	return (
		<FormTextField
			control={control}
			name="slug"
			label={t("dashboard.notes.form.slug.label")}
			description={t("dashboard.notes.form.slug.hint")}
			placeholder={slugify(title) || FALLBACK_SLUG}
		/>
	);
};

export default NoteSlugField;
