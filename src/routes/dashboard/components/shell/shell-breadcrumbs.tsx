import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { config } from "@/config";
import { DashboardSection, SettingsTab } from "@/types/ui";

const NEW_SEGMENT = "new";

const sectionOf = (segment: string | undefined): DashboardSection | undefined =>
	Object.values(DashboardSection).find((section) => section === segment);

interface ShellBreadcrumbsProps {}

/** Section, then "New" or "Edit" on a form page; derived from the URL, so refresh and shared links agree. */
export const ShellBreadcrumbs: React.FC<ShellBreadcrumbsProps> = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const [, section, detail] = pathname
		.slice(config.routes.dashboard.length)
		.split("/");
	const known = sectionOf(section);
	if (!known) return null;
	const label = t(`dashboard.nav.items.${known}`);
	const tab = Object.values(SettingsTab).find((value) => value === detail);
	const formLabel =
		detail === NEW_SEGMENT
			? t("dashboard.breadcrumbs.new")
			: t("dashboard.breadcrumbs.edit");
	// Settings tabs are named after themselves; every other detail page is a form.
	const detailLabel = tab ? t(`dashboard.settings.tabs.${tab}`) : formLabel;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					{detail ? (
						<BreadcrumbLink
							render={
								<Link
									to={`${config.routes.dashboard}/${known}`}
								/>
							}
						>
							{label}
						</BreadcrumbLink>
					) : (
						<BreadcrumbPage>{label}</BreadcrumbPage>
					)}
				</BreadcrumbItem>
				{detail ? (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{detailLabel}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				) : null}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default ShellBreadcrumbs;
