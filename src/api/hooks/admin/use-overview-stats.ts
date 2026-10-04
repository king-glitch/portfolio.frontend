import { useAdminFrames } from "@/api/hooks/admin/frames/use-admin-frames";
import { useAdminNotes } from "@/api/hooks/admin/notes/use-admin-notes";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";
import { useAdminFiles } from "@/api/hooks/admin/storage/use-admin-files";
import { ContentStatus } from "@/api/types/admin/enums";
import { DashboardSection } from "@/types/ui";

export interface OverviewStat {
	section: DashboardSection;
	isPending: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => unknown;
	/** Published items for projects and notes, every loaded item for frames and files. */
	count: number;
	/** Projects and notes only. */
	drafts?: number;
	/** More pages exist than are loaded: `count` is a lower bound ("24+"). */
	more: boolean;
}

const published = (items: { status: ContentStatus }[]) =>
	items.filter((item) => item.status === ContentStatus.Published).length;

const pick = (query: {
	isPending: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => unknown;
}) => ({
	isPending: query.isPending,
	isError: query.isError,
	error: query.error,
	refetch: query.refetch,
});

/**
 * One entry per list section, read from the lists' own cached queries (the same keys the list pages
 * use, so no extra requests). Feeds the overview cards and the sidebar badges.
 */
export function useOverviewStats(): OverviewStat[] {
	const projects = useAdminProjects();
	const notes = useAdminNotes();
	const frames = useAdminFrames();
	const files = useAdminFiles({ kinds: [], q: "" });
	const projectItems = projects.data ?? [];
	const noteItems = notes.data ?? [];
	return [
		{
			section: DashboardSection.Projects,
			...pick(projects),
			count: published(projectItems),
			drafts: projectItems.length - published(projectItems),
			more: false,
		},
		{
			section: DashboardSection.Notes,
			...pick(notes),
			count: published(noteItems),
			drafts: noteItems.length - published(noteItems),
			more: false,
		},
		{
			section: DashboardSection.Gallery,
			...pick(frames),
			count: (frames.data?.pages ?? []).reduce(
				(total, page) => total + page.frames.length,
				0,
			),
			more: frames.hasNextPage,
		},
		{
			section: DashboardSection.Files,
			...pick(files),
			count: (files.data?.pages ?? []).reduce(
				(total, page) => total + page.files.length,
				0,
			),
			more: files.hasNextPage,
		},
	];
}
