// style-lint-ignore-file query-states -- decorative menu text; the same queries show error + retry in MenuProjects and on the pages
import React from "react";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuContactsProps {}

/** Contact values as plain text in the menu footer (prototype). Text-only: an error just hides them. */
export const MenuContacts: React.FC<MenuContactsProps> = () => {
	const { data, isPending, isError } = useProfile();
	if (isError) return <span />;
	if (isPending) return <Skeleton className="h-4 w-72 bg-current/10" />;
	return (
		<div className="flex flex-wrap gap-4.5 text-[13px] font-semibold">
			{[
				data.contact.email,
				data.contact.github,
				data.contact.linkedin,
			].map((value) => (
				<span key={value}>{value}</span>
			))}
		</div>
	);
};

export default MenuContacts;
