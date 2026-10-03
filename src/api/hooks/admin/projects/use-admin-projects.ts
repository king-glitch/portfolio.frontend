import { useQuery } from "@tanstack/react-query";
import { adminProjectsQuery } from "@/api/queries/admin";

export const useAdminProjects = () => useQuery(adminProjectsQuery());
