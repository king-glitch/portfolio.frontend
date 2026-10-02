// style-lint-ignore-file one-component-per-file -- React Router root module must export Layout, the app component and ErrorBoundary together
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from "react-router";
import { PreloaderProvider } from "@/contexts/preloader-context";
import { ShellProvider } from "@/contexts/shell-context";
import { config } from "@/config";
import i18n from "@/lib/i18n";
import { themeScript } from "@/lib/theme-script";
import type { Route } from "./+types/root";
import "@/main.css";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<html lang={config.i18n.defaultLocale} suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<Meta />
				<Links />
			</head>
			<body className="print:bg-print-background print:text-print-foreground">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
};

interface RootProps {}

const Root: React.FC<RootProps> = () => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: config.query.staleTimeMs,
						retry: config.query.retry,
					},
				},
			}),
	);
	return (
		<QueryClientProvider client={queryClient}>
			<PreloaderProvider>
				<ShellProvider>
					<Outlet />
				</ShellProvider>
			</PreloaderProvider>
		</QueryClientProvider>
	);
};

export default Root;

interface ErrorBoundaryProps {
	error: Route.ErrorBoundaryProps["error"];
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error }) => {
	let message = i18n.t("common.errors.boundary.title");
	let details = i18n.t("common.errors.boundary.description");
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message =
			error.status === 404
				? String(error.status)
				: i18n.t("common.errors.boundary.status");
		details =
			error.status === 404
				? i18n.t("common.errors.boundary.not-found.description")
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
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
