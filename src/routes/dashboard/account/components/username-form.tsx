import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useChangeUsername } from "@/api/hooks/admin/auth/use-change-username";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
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

const MIN_USERNAME = 3;
const MAX_USERNAME = 32;

const usernameSchema = (t: TFunction) =>
	z.object({
		newUsername: z
			.string()
			.trim()
			.min(
				MIN_USERNAME,
				t("dashboard.errors.username", {
					min: MIN_USERNAME,
					max: MAX_USERNAME,
				}),
			)
			.max(
				MAX_USERNAME,
				t("dashboard.errors.username", {
					min: MIN_USERNAME,
					max: MAX_USERNAME,
				}),
			),
		password: z.string().min(1, t("dashboard.errors.required")),
	});

type UsernameValues = z.infer<ReturnType<typeof usernameSchema>>;

const emptyValues: UsernameValues = { newUsername: "", password: "" };

interface UsernameFormProps {}

/** Change the admin username (asks for the password); the top bar name refreshes on success. */
export const UsernameForm: React.FC<UsernameFormProps> = () => {
	const { t } = useTranslation();
	const change = useChangeUsername();
	const schema = useMemo(() => usernameSchema(t), [t]);
	const form = useForm<UsernameValues>({
		resolver: zodResolver(schema),
		defaultValues: emptyValues,
	});

	const onSubmit = form.handleSubmit((values) =>
		change.mutate(values, {
			onSuccess: () => {
				form.reset(emptyValues);
				toast.add({
					type: "success",
					title: t("dashboard.account.username.success"),
				});
			},
			onError: (error) =>
				applyViolations(error, form.setError, [
					"newUsername",
					"password",
				]),
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>
						{t("dashboard.account.username.title")}
					</CardTitle>
					<CardDescription>
						{t("dashboard.account.username.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<FormTextField
							control={form.control}
							name="newUsername"
							label={t("dashboard.account.username.new.label")}
							autoComplete="username"
						/>
						<FormTextField
							control={form.control}
							name="password"
							label={t(
								"dashboard.account.username.password.label",
							)}
							type="password"
							autoComplete="current-password"
						/>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<FormButton type="submit" disabled={change.isPending}>
						{change.isPending ? (
							<Spinner data-icon="inline-start" />
						) : null}
						{t("dashboard.account.username.submit")}
					</FormButton>
				</CardFooter>
			</Card>
		</form>
	);
};

export default UsernameForm;
