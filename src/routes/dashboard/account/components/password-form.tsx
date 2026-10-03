import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useChangePassword } from "@/api/hooks/admin/auth/use-change-password";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FormButton } from "@/components/common/buttons/form-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { applyViolations } from "@/lib/forms";

const MIN_PASSWORD = 12;
const MAX_PASSWORD = 128;

const passwordSchema = (t: TFunction) =>
	z.object({
		currentPassword: z.string().min(1, t("dashboard.errors.required")),
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

type PasswordValues = z.infer<ReturnType<typeof passwordSchema>>;

const emptyValues: PasswordValues = { currentPassword: "", newPassword: "" };

interface PasswordFormProps {}

/** Change the admin password; the fields clear on success. */
export const PasswordForm: React.FC<PasswordFormProps> = () => {
	const { t } = useTranslation();
	const change = useChangePassword();
	const schema = useMemo(() => passwordSchema(t), [t]);
	const form = useForm<PasswordValues>({
		resolver: zodResolver(schema),
		defaultValues: emptyValues,
	});

	const onSubmit = form.handleSubmit((values) =>
		change.mutate(values, {
			onSuccess: () => {
				form.reset(emptyValues);
				toast.add({
					type: "success",
					title: t("dashboard.account.password.success"),
				});
			},
			onError: (error) =>
				applyViolations(error, form.setError, [
					"currentPassword",
					"newPassword",
				]),
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>
						{t("dashboard.account.password.title")}
					</CardTitle>
					<CardDescription>
						{t("dashboard.account.password.description", {
							min: MIN_PASSWORD,
						})}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<FormTextField
							control={form.control}
							name="currentPassword"
							label={t(
								"dashboard.account.password.current.label",
							)}
							type="password"
							autoComplete="current-password"
						/>
						<FormTextField
							control={form.control}
							name="newPassword"
							label={t("dashboard.account.password.new.label")}
							type="password"
							autoComplete="new-password"
						/>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<FormButton type="submit" disabled={change.isPending}>
						{change.isPending ? (
							<Spinner data-icon="inline-start" />
						) : null}
						{t("dashboard.account.password.submit")}
					</FormButton>
				</CardFooter>
			</Card>
		</form>
	);
};

export default PasswordForm;
