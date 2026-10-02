import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Mascot } from "@/components/common/mascot/mascot";
import { MascotBubble } from "@/components/common/mascot/mascot-bubble";
import { config } from "@/config";
import i18n from "@/lib/i18n";
import { BubbleSide, MascotZone, PillVariant } from "@/types/ui";

interface RootErrorProps {}

const NOT_FOUND = 404;

/** Last-resort error screen (React Router root `ErrorBoundary`); stack only in dev. */
export const RootError: React.FC<RootErrorProps> = () => {
	// The hook, not a prop: React Router 8 does not pass `error` to the root boundary.
	const error = useRouteError();
	let message = i18n.t("common.errors.boundary.title");
	let details = i18n.t("common.errors.boundary.description");
	let stack: string | undefined;
	let notFound = false;

	if (isRouteErrorResponse(error)) {
		notFound = error.status === NOT_FOUND;
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

	if (notFound)
		return (
			<main className="flex min-h-svh flex-col items-center justify-center gap-10 bg-background p-6 text-center text-foreground">
				<div className="flex flex-col items-center gap-4">
					<Mascot
						options={{ zone: MascotZone.Bottom, range: 0.2 }}
						className="w-[clamp(120px,22vw,220px)]"
					/>
					<MascotBubble side={BubbleSide.Top}>
						{i18n.t("common.not-found.mascot")}
					</MascotBubble>
				</div>
				<div className="mt-10 flex flex-col items-center gap-4">
					<h1 className="m-0 text-[clamp(96px,18vw,240px)] leading-[0.8] font-black tracking-[-0.08em]">
						{message}
					</h1>
					<p className="m-0 text-muted-foreground">{details}</p>
					<PillButton
						variant={PillVariant.Strong}
						nativeButton={false}
						render={<a href={config.routes.home} />}
					>
						{i18n.t("common.not-found.action")}
					</PillButton>
				</div>
			</main>
		);

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
