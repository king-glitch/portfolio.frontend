import { MutationCache, QueryClient } from "@tanstack/react-query";
import { ApiErrorKind, isApiError, isRetryable } from "@/api/errors";
import { config } from "@/config";
import { toastApiError } from "@/lib/api-toast";

/** One client for the app and the route loaders, so a loader's prefetch is the component's cache hit. */
export const queryClient = new QueryClient({
	// Every failed mutation reports itself with a toast; forms add field messages on top.
	// A mutation that words its own conflict (409) says so in `meta` and skips the generic toast.
	mutationCache: new MutationCache({
		onError: (error, _variables, _result, mutation) => {
			const own =
				isApiError(error) &&
				error.kind === ApiErrorKind.Conflict &&
				mutation.meta?.[config.query.ownConflictMeta] === true;
			if (!own) toastApiError(error);
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: config.query.staleTimeMs,
			retry: (failures, error) =>
				isRetryable(error) && failures < config.query.retry,
			retryDelay: (attempt) =>
				Math.min(
					config.query.retryBaseMs * 2 ** attempt,
					config.query.retryMaxMs,
				),
		},
	},
});
