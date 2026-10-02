import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { PreloaderProvider } from "@/contexts/preloader-context";
import { ShellProvider } from "@/contexts/shell-context";
import { queryClient } from "@/lib/query-client";
import "@/main.css";

export { RootDocument as Layout } from "@/components/shared/root/root-document";
export { RootError as ErrorBoundary } from "@/components/shared/root/root-error";
export { RootFallback as HydrateFallback } from "@/components/shared/root/root-fallback";

interface RootProps {}

/** App providers around the routed shell. */
const Root: React.FC<RootProps> = () => {
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
