import React from "react";
import { isRouteErrorResponse } from "react-router";
import i18n from "@/lib/i18n";

interface RootErrorProps {
	error: unknown;
}

const NOT_FOUND = 404;

/** Last-resort error screen (React Router root `ErrorBoundary`); stack only in dev. */
export const RootError: React.FC<RootErrorProps> = ({ error }) => {
	let message = i18n.t("common.errors.boundary.title");
	let details = i18n.t("common.errors.boundary.description");
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		const notFound = error.status === NOT_FOUND;
		message = notFound
			? String(error.status)
			: i18n.t("common.errors.boundary.status");
		details = notFound
			? i18n.t("common.errors.boundary.not-found.description")
			: error.statusText || details;
	} else if (import.meta.env.DEV && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack ? (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			) : null}
		</main>
	);
};

export default RootError;
