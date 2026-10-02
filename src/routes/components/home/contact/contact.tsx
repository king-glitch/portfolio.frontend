import React from "react";
import { useTranslation } from "react-i18next";
import { ContactLinks } from "@/components/shared/contact/contact-links";
import { PillButton } from "@/components/common/buttons/pill-button";
import { SectionLabel } from "@/components/common/typography/section-label";
import { config } from "@/config";
import { useShell } from "@/contexts/shell-context";
import { ContactLetters } from "@/routes/components/home/contact/contact-letters";
import { PillVariant } from "@/types/ui";

interface ContactProps {}

/** Closing section: giant heading, short pitch, contact pills and the footer row. */
export const Contact: React.FC<ContactProps> = () => {
	const { t } = useTranslation();
	const { setTerminalOpen } = useShell();
	return (
		<section
			id={config.sections.contact}
			className="border-t px-[clamp(16px,4vw,48px)] pt-[clamp(80px,10vw,160px)] pb-10"
		>
			<div className="mx-auto max-w-340">
				<SectionLabel index={9}>
					{t("home.contact.eyebrow")}
				</SectionLabel>
				<ContactLetters text={t("home.contact.title")} />
				<div className="mt-12 grid items-end gap-12 desk:grid-cols-2">
					<p className="m-0 max-w-140 text-[clamp(20px,2vw,30px)] leading-[1.35] tracking-[-0.02em]">
						{t("home.contact.lede.text")}{" "}
						<span className="text-muted-foreground">
							{t("home.contact.lede.accent")}
						</span>
					</p>
					<ContactLinks className="desk:justify-end" />
				</div>
				<div className="mt-[clamp(80px,10vw,140px)] flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-[13px] text-muted-foreground">
					<span>
						{t("home.contact.copyright", {
							year: new Date().getFullYear(),
						})}
					</span>
					<PillButton
						variant={PillVariant.Ghost}
						onClick={() => setTerminalOpen(true)}
						className="font-mono text-[13px] font-bold"
					>
						{t("home.contact.terminal")}
					</PillButton>
					<a
						href={`#${config.sections.top}`}
						className="font-semibold text-foreground"
					>
						{t("home.contact.top")}
					</a>
				</div>
			</div>
		</section>
	);
};

export default Contact;
