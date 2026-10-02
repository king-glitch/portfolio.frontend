import React from "react";
import { RiPrinterLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { PillButton } from "@/components/common/buttons/pill-button";
import { PillVariant } from "@/types/ui";

interface ResumePrintButtonProps {}

/** Opens the print dialog; hidden in print itself. */
export const ResumePrintButton: React.FC<ResumePrintButtonProps> = () => {
	const { t } = useTranslation();
	return (
		<PillButton
			variant={PillVariant.Outline}
			onClick={() => window.print()}
			className="fixed right-6 bottom-5.5 z-20 bg-card print:hidden"
		>
			<RiPrinterLine data-icon="inline-start" />
			{t("about.resume.print.label")}
		</PillButton>
	);
};

export default ResumePrintButton;
