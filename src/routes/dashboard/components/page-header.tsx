import React from "react";

interface PageHeaderProps {
	title: string;
	description?: string;
	/** Right side: usually the page's primary button. */
	action?: React.ReactNode;
}

/** Title row of every dashboard page. */
export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	description,
	action,
}) => {
	return (
		<div className="flex flex-wrap items-start justify-between gap-4 pb-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight">
					{title}
				</h1>
				{description ? (
					<p className="text-sm text-muted-foreground">
						{description}
					</p>
				) : null}
			</div>
			{action}
		</div>
	);
};

export default PageHeader;
