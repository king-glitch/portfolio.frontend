import { useAdminNotes } from "@/api/hooks/admin/notes/use-admin-notes";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";

/** Every tag already used by a project or a note, sorted: suggestions for the tag fields. */
export function useTagSuggestions(): string[] {
	const projects = useAdminProjects();
	const notes = useAdminNotes();
	const tags = [
		...(projects.data ?? []).flatMap((project) => project.tags),
		...(notes.data ?? []).flatMap((note) => note.tags),
	];
	return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
}
