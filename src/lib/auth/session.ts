import { z } from "zod";
import { config } from "@/config";

const sessionSchema = z.object({
	token: z.string().min(1),
	/** ISO instant the backend stops accepting `token`. */
	expiresAt: z.string(),
});

type Session = z.infer<typeof sessionSchema>;

const listeners = new Set<() => void>();
let cache: Session | null | undefined;

const isLive = (session: Session): boolean =>
	new Date(session.expiresAt).getTime() > Date.now();

function readStorage(): Session | null {
	try {
		const raw = localStorage.getItem(config.dashboard.sessionStorageKey);
		const parsed = sessionSchema.safeParse(raw ? JSON.parse(raw) : null);
		return parsed.success ? parsed.data : null;
	} catch {
		// storage blocked or the stored value is not JSON: signed out
		return null;
	}
}

/** The stored session, or null when there is none or it has expired. */
export function getSession(): Session | null {
	cache ??= readStorage();
	return cache && isLive(cache) ? cache : null;
}

export function setSession(session: Session | null): void {
	cache = session;
	try {
		if (session)
			localStorage.setItem(
				config.dashboard.sessionStorageKey,
				JSON.stringify(session),
			);
		else localStorage.removeItem(config.dashboard.sessionStorageKey);
	} catch {
		// storage blocked: the session lives in memory until reload
	}
	for (const listener of listeners) listener();
}

export const hasSession = (): boolean => getSession() !== null;

/** `useSyncExternalStore` subscription; another tab signing out signs this one out too. */
export function subscribeSession(listener: () => void): () => void {
	listeners.add(listener);
	const onStorage = (event: StorageEvent) => {
		if (event.key !== config.dashboard.sessionStorageKey) return;
		cache = undefined;
		listener();
	};
	window.addEventListener("storage", onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}
