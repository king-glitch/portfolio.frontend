import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/api/queries/portfolio";

export function useProfile() {
	return useQuery(profileQuery());
}
