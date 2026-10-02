import React from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { config } from "@/config";
import { themeScript } from "@/lib/theme-script";

interface RootDocumentProps {
	children: React.ReactNode;
}

/** HTML shell (React Router root `Layout`): theme set before paint, meta, scripts. */
export const RootDocument: React.FC<RootDocumentProps> = ({ children }) => {
	return (
		<html lang={config.i18n.defaultLocale} suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
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

export default RootDocument;
