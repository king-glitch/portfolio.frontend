import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useLogin } from "@/api/hooks/admin/auth/use-login";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FormButton } from "@/components/common/buttons/form-button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { config } from "@/config";
import { applyViolations } from "@/lib/forms";

const loginSchema = (t: TFunction) =>
	z.object({
		username: z.string().trim().min(1, t("dashboard.errors.required")),
		password: z.string().min(1, t("dashboard.errors.required")),
	});

type LoginValues = z.infer<ReturnType<typeof loginSchema>>;

interface LoginFormProps {}

/** Username and password; success opens the dashboard, failure toasts (and marks fields the server names). */
export const LoginForm: React.FC<LoginFormProps> = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const login = useLogin();
	const schema = useMemo(() => loginSchema(t), [t]);
	const form = useForm<LoginValues>({
		resolver: zodResolver(schema),
		defaultValues: { username: "", password: "" },
	});

	const onSubmit = form.handleSubmit((values) =>
		login.mutate(values, {
			onSuccess: () =>
				void navigate(config.routes.dashboard, { replace: true }),
			onError: (error) =>
				applyViolations(error, form.setError, ["username", "password"]),
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit}>
			<FieldGroup>
				<FormTextField
					control={form.control}
					name="username"
					label={t("dashboard.authentication.login.username.label")}
					autoComplete="username"
					autoFocus
				/>
				<FormTextField
					control={form.control}
					name="password"
					label={t("dashboard.authentication.login.password.label")}
					type="password"
					autoComplete="current-password"
				/>
				<FormButton type="submit" disabled={login.isPending}>
					{login.isPending ? (
						<Spinner data-icon="inline-start" />
					) : null}
					{t("dashboard.authentication.login.submit")}
				</FormButton>
				<FormButton
					variant="link"
					nativeButton={false}
					render={<Link to={config.routes.dashboardRecover} />}
				>
					{t("dashboard.authentication.login.recover")}
				</FormButton>
			</FieldGroup>
		</form>
	);
};

export default LoginForm;
