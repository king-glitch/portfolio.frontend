import { useQuery } from "@tanstack/react-query";
import { meQuery } from "@/api/queries/admin";

export const useMe = () => useQuery(meQuery());
