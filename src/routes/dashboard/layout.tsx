import React, { useSyncExternalStore } from "react";
import { Navigate, Outlet, redirect } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { config } from "@/config";
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
	if (!signedIn)
		return <Navigate to={config.routes.dashboardLogin} replace />;
	return (
		<SidebarProvider>
			<ShellSidebar />
			<SidebarInset>
				<ShellTopbar />
				<div className="flex-1 p-4 md:p-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;
