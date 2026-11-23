import { useQuery } from "@tanstack/react-query";
import { stackStopsQuery } from "@/api/queries/portfolio";

/** The home "how a tap travels" stops (public `stack_stops` setting). */
export function useStackStops() {
	return useQuery(stackStopsQuery());
}
