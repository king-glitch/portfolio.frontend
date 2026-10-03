import { Toaster } from "@/components/ui/toast";
import { PreloaderProvider } from "@/contexts/preloader-context";
import { ShellProvider } from "@/contexts/shell-context";
import { queryClient } from "@/lib/query-client";
import "@/main.css";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet } from "react-router";

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
					<Toaster />
				</ShellProvider>
			</PreloaderProvider>
		</QueryClientProvider>
	);
};

export default Root;
