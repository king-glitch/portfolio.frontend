import React from "react";
import { useTranslation } from "react-i18next";
import { useMe } from "@/api/hooks/admin/auth/use-me";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface AccountSummaryProps {}

/** Who is signed in and when they last signed in. */
export const AccountSummary: React.FC<AccountSummaryProps> = () => {
	const { t } = useTranslation();
	const me = useMe();

	if (me.isPending) return <Skeleton className="h-20 w-full" />;
	if (me.isError)
		return (
			<QueryErrorAlert
				onRetry={() => void me.refetch()}
				error={me.error}
			/>
		);

	const lastLogin = me.data.lastLoginAt
		? new Date(me.data.lastLoginAt).toLocaleString(
				config.i18n.defaultLocale,
			)
		: t("dashboard.account.summary.never");
	return (
		<Card>
			<CardContent className="flex items-center gap-4">
				<Avatar size="lg">
					<AvatarFallback>
						{me.data.username.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="font-medium">{me.data.username}</span>
					<span className="text-sm text-muted-foreground">
						{t("dashboard.account.summary.last-login", {
							date: lastLogin,
						})}
					</span>
				</div>
			</CardContent>
		</Card>
	);
};

export default AccountSummary;
