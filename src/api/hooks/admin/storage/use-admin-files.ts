import { useInfiniteQuery } from "@tanstack/react-query";
import { adminFilesQuery } from "@/api/queries/admin";
import type { FileListParams } from "@/api/types/admin/storage";

export const useAdminFiles = (params: FileListParams) =>
	useInfiniteQuery(adminFilesQuery(params));
