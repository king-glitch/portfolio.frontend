import React, { useEffect, useSyncExternalStore } from "react";
import { Navigate, Outlet, redirect } from "react-router";
import { Companion } from "@/components/shared/shell/companion";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { config } from "@/config";
import { PreloaderProvider } from "@/contexts/preloader-context";
import { hasSession, subscribeSession } from "@/lib/auth/session";
import { ShellSidebar } from "@/routes/dashboard/components/shell/shell-sidebar";
import { ShellTopbar } from "@/routes/dashboard/components/shell/shell-topbar";

/** No tokens, no dashboard: the page never renders signed out. */
export function clientLoader() {
	if (!hasSession()) throw redirect(config.routes.dashboardLogin);
	return null;
}

export function meta() {
	return [{ name: "robots", content: "noindex, nofollow" }];
}

interface DashboardLayoutProps {}

/** Owner dashboard shell: sidebar, top bar, then the routed page. Signing out (or a dead session) sends you to the login. */
const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
	const signedIn = useSyncExternalStore(
		subscribeSession,
		hasSession,
		() => true,
	);
	// Scopes the dashboard's motion and view-transition rules (main.css) while it is mounted.
	useEffect(() => {
		const root = document.documentElement;
		root.dataset.area = config.dashboard.area;
		return () => {
			delete root.dataset.area;
		};
	}, []);
	if (!signedIn)
		return <Navigate to={config.routes.dashboardLogin} replace />;
	return (
		<TooltipProvider>
			<SidebarProvider>
				<ShellSidebar />
				<SidebarInset>
					<ShellTopbar />
					<div data-dash-content className="flex-1 p-4 md:p-8">
						<div className="mx-auto w-full max-w-6xl">
							<Outlet />
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
};

export default DashboardLayout;
