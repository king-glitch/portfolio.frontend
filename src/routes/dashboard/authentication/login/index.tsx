import React from "react";
import { useTranslation } from "react-i18next";
import { redirect } from "react-router";
import { config } from "@/config";
import { hasSession } from "@/lib/auth/session";
import i18n from "@/lib/i18n";
import { AuthCard } from "@/routes/dashboard/authentication/components/auth-card";
import { LoginForm } from "@/routes/dashboard/authentication/login/components/login-form";

/** Already signed in: straight to the dashboard. */
export function clientLoader() {
	if (hasSession()) throw redirect(config.routes.dashboard);
	return null;
}

export function meta() {
	return [
		{ title: i18n.t("dashboard.authentication.login.meta.title") },
		{ name: "robots", content: "noindex, nofollow" },
	];
}

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	const { t } = useTranslation();
	return (
		<AuthCard
			title={t("dashboard.authentication.login.title")}
			description={t("dashboard.authentication.login.description")}
		>
			<LoginForm />
		</AuthCard>
	);
};

export default Login;
