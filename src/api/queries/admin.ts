import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
	getAdminNote,
	getAdminProject,
	getMe,
	listAdminFrames,
	listAdminNotes,
	listFiles,
	listAdminProjects,
	listSettings,
} from "@/api/services/admin";
import type { FileListParams } from "@/api/types/admin/storage";
import { config } from "@/config";

const keys = config.queryKeys.admin;

export const meQuery = () =>
	queryOptions({ queryKey: [keys.me], queryFn: getMe });

export const adminProjectsQuery = () =>
	queryOptions({
		queryKey: [keys.projects.list],
		queryFn: listAdminProjects,
	});

export const adminProjectQuery = (id: string) =>
	queryOptions({
		queryKey: [keys.projects.detail, id],
		queryFn: () => getAdminProject(id),
	});

export const adminNotesQuery = () =>
	queryOptions({ queryKey: [keys.notes.list], queryFn: listAdminNotes });

export const adminNoteQuery = (id: string) =>
	queryOptions({
		queryKey: [keys.notes.detail, id],
		queryFn: () => getAdminNote(id),
	});

export const adminFramesQuery = () =>
	infiniteQueryOptions({
		queryKey: [keys.frames],
		queryFn: ({ pageParam }) => listAdminFrames(pageParam),
		initialPageParam: "",
		getNextPageParam: (page) => page.nextCursor,
	});

export const settingsQuery = () =>
	queryOptions({ queryKey: [keys.settings], queryFn: listSettings });

export const adminFilesQuery = (params: FileListParams) =>
	infiniteQueryOptions({
		queryKey: [keys.storage.files, params],
		queryFn: ({ pageParam }) => listFiles(pageParam, params),
		initialPageParam: "",
		getNextPageParam: (page) => page.nextCursor,
	});
