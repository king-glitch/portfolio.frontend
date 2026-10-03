import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { AuthCard } from "@/routes/dashboard/authentication/components/auth-card";
import { RecoverForm } from "@/routes/dashboard/authentication/recover/components/recover-form";

export function meta() {
	return [
		{ title: i18n.t("dashboard.authentication.recover.meta.title") },
		{ name: "robots", content: "noindex, nofollow" },
	];
}

interface RecoverProps {}

const Recover: React.FC<RecoverProps> = () => {
	const { t } = useTranslation();
	return (
		<AuthCard
			title={t("dashboard.authentication.recover.title")}
			description={t("dashboard.authentication.recover.description")}
		>
			<RecoverForm />
		</AuthCard>
	);
};

export default Recover;
