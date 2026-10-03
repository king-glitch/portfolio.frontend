import React, { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";
import { useRecover } from "@/api/hooks/admin/auth/use-recover";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormButton } from "@/components/common/buttons/form-button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { config } from "@/config";
import { applyViolations } from "@/lib/forms";

const MIN_PASSWORD = 12;
const MAX_PASSWORD = 128;

const recoverSchema = (t: TFunction) =>
	z.object({
		recoveryCode: z.string().trim().min(1, t("dashboard.errors.required")),
		newPassword: z
			.string()
			.min(
				MIN_PASSWORD,
				t("dashboard.errors.password", { min: MIN_PASSWORD }),
			)
			.max(
				MAX_PASSWORD,
				t("dashboard.errors.password", { min: MIN_PASSWORD }),
			),
	});

type RecoverValues = z.infer<ReturnType<typeof recoverSchema>>;

interface RecoverFormProps {}

/** Recovery code + new password. The replacement code is shown once, on success. */
export const RecoverForm: React.FC<RecoverFormProps> = () => {
	const { t } = useTranslation();
	const recover = useRecover();
	const [newCode, setNewCode] = useState<string>();
	const schema = useMemo(() => recoverSchema(t), [t]);
	const form = useForm<RecoverValues>({
		resolver: zodResolver(schema),
		defaultValues: { recoveryCode: "", newPassword: "" },
	});

	const onSubmit = form.handleSubmit((values) =>
		recover.mutate(values, {
			onSuccess: setNewCode,
			onError: (error) =>
				applyViolations(error, form.setError, [
					"recoveryCode",
					"newPassword",
				]),
		}),
	);

	if (newCode)
		return (
			<FieldGroup>
				<Alert>
					<AlertTitle>
						{t("dashboard.authentication.recover.done.title")}
					</AlertTitle>
					<AlertDescription>
						{t("dashboard.authentication.recover.done.description")}
					</AlertDescription>
				</Alert>
				<code className="rounded-lg bg-muted p-3 font-mono text-sm break-all select-all">
					{newCode}
				</code>
				<FormButton
					nativeButton={false}
					render={<Link to={config.routes.dashboardLogin} />}
				>
					{t("dashboard.authentication.recover.done.action")}
				</FormButton>
			</FieldGroup>
		);

	return (
		<form noValidate onSubmit={onSubmit}>
			<FieldGroup>
				<FormTextField
					control={form.control}
					name="recoveryCode"
					label={t("dashboard.authentication.recover.code.label")}
					autoComplete="off"
					autoFocus
				/>
				<FormTextField
					control={form.control}
					name="newPassword"
					label={t("dashboard.authentication.recover.password.label")}
					description={t(
						"dashboard.authentication.recover.password.hint",
						{
							min: MIN_PASSWORD,
						},
					)}
					type="password"
					autoComplete="new-password"
				/>
				<FormButton type="submit" disabled={recover.isPending}>
					{recover.isPending ? (
						<Spinner data-icon="inline-start" />
					) : null}
					{t("dashboard.authentication.recover.submit")}
				</FormButton>
				<FormButton
					variant="link"
					nativeButton={false}
					render={<Link to={config.routes.dashboardLogin} />}
				>
					{t("dashboard.authentication.recover.back")}
				</FormButton>
			</FieldGroup>
		</form>
	);
};

export default RecoverForm;
