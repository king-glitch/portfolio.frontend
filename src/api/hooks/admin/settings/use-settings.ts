import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/api/queries/admin";

export const useSettings = () => useQuery(settingsQuery());
