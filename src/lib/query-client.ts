import { MutationCache, QueryClient } from "@tanstack/react-query";
import { ApiErrorKind, isApiError, isRetryable } from "@/api/errors";
import { config } from "@/config";
import { toastApiError } from "@/lib/api-toast";
import { announceCompanion, companionEventOf } from "@/lib/companion";
import { CompanionEvent } from "@/types/ui";

/** One client for the app and the route loaders, so a loader's prefetch is the component's cache hit. */
export const queryClient = new QueryClient({
	// Every failed mutation reports itself with a toast; forms add field messages on top.
	// A mutation that words its own conflict (409) says so in `meta` and skips the generic toast.
	// Void (the companion) reacts to the same results: tagged mutations succeed out loud, failures flinch.
	mutationCache: new MutationCache({
		onSuccess: (_data, variables, _result, mutation) => {
			const event = companionEventOf(mutation.meta, variables);
			if (event) announceCompanion(event);
		},
		onError: (error, _variables, _result, mutation) => {
			announceCompanion(CompanionEvent.Error);
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
