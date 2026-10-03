import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { AccountSummary } from "@/routes/dashboard/account/components/account-summary";
import { PasswordForm } from "@/routes/dashboard/account/components/password-form";
import { UsernameForm } from "@/routes/dashboard/account/components/username-form";
import { PageHeader } from "@/routes/dashboard/components/page-header";

export function meta() {
	return [{ title: i18n.t("dashboard.account.meta.title") }];
}

interface AccountProps {}

const Account: React.FC<AccountProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			<PageHeader
				title={t("dashboard.account.title")}
				description={t("dashboard.account.description")}
			/>
			<div className="flex max-w-xl flex-col gap-6">
				<AccountSummary />
				<UsernameForm />
				<PasswordForm />
			</div>
		</>
	);
};

export default Account;
