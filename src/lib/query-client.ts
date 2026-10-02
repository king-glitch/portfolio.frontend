import { QueryClient } from "@tanstack/react-query";
import { config } from "@/config";

/** One client for the app and the route loaders, so a loader's prefetch is the component's cache hit. */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: config.query.staleTimeMs,
			retry: config.query.retry,
		},
	},
});
