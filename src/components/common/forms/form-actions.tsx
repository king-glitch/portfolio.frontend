import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface FormActionsProps {
	/** Unsaved edits: shows the hint. */
	dirty: boolean;
	className?: string;
	/** The action buttons; all the same height. */
	children: React.ReactNode;
}

/** Sticky bottom bar of a long form: the buttons stay in reach, with an "unsaved changes" hint while dirty. */
export const FormActions: React.FC<FormActionsProps> = ({
	dirty,
	className,
	children,
}) => {
	const { t } = useTranslation();
	return (
		<div
			className={cn(
				"sticky bottom-0 z-10 -mx-4 -mb-4 flex flex-wrap items-center gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-8 md:-mb-8 md:px-8",
				className,
			)}
		>
			{children}
			{dirty ? (
				<span role="status" className="text-sm text-muted-foreground">
					{t("components.common.forms.unsaved.hint")}
				</span>
			) : null}
		</div>
	);
};

export default FormActions;
