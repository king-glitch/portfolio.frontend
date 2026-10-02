import React from "react";
import { useTranslation } from "react-i18next";
import { PillButton } from "@/components/common/buttons/pill-button";
import { PillSize, PillVariant } from "@/types/ui";

interface ResumePrintButtonProps {}

/** Opens the print dialog (sits in the mode switch). */
export const ResumePrintButton: React.FC<ResumePrintButtonProps> = () => {
	const { t } = useTranslation();
	return (
		<PillButton
			variant={PillVariant.Outline}
			size={PillSize.Sm}
			onClick={() => window.print()}
			className="text-sm font-bold"
		>
			{t("about.resume.print.label")}
		</PillButton>
	);
};

export default ResumePrintButton;
