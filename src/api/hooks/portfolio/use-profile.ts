import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/services/portfolio";
import { config } from "@/config";

export function useProfile() {
	return useQuery({
		queryKey: [config.queryKeys.portfolio.profile],
		queryFn: getProfile,
	});
}
