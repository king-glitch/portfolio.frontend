import React from "react";
import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

/** Centered card of the signed-out dashboard pages (sign in, recover). */
export const AuthCard: React.FC<AuthCardProps> = ({
	title,
	description,
	children,
}) => {
	const { t } = useTranslation();
	return (
		<main className="flex min-h-svh items-center justify-center bg-muted p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
						{t("dashboard.brand")}
					</p>
					<CardTitle role="heading" aria-level={1}>
						{title}
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>
		</main>
	);
};

export default AuthCard;
